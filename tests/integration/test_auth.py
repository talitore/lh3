import unittest
import json
from app import create_app, db
from app.models import User

class AuthIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self.client = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_registration(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password'
        }
        response = self.client.post('/auth/register', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        user = User.query.filter_by(username='testuser').first()
        self.assertIsNotNone(user)

    def test_login(self):
        user = User(username='testuser', email='test@example.com', password='password')
        db.session.add(user)
        db.session.commit()
        data = {
            'email': 'test@example.com',
            'password': 'password'
        }
        response = self.client.post('/auth/login', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', json.loads(response.data))

    def test_edit_profile(self):
        user = User(username='testuser', email='test@example.com', password='password')
        db.session.add(user)
        db.session.commit()
        
        login_data = {
            'email': 'test@example.com',
            'password': 'password'
        }
        login_response = self.client.post('/auth/login', data=json.dumps(login_data), content_type='application/json')
        access_token = json.loads(login_response.data)['access_token']

        headers = {'Authorization': f'Bearer {access_token}'}
        data = {
            'username': 'newuser',
            'email': 'new@example.com'
        }
        response = self.client.put('/auth/profile', data=json.dumps(data), content_type='application/json', headers=headers)
        self.assertEqual(response.status_code, 200)
        updated_user = User.query.filter_by(email='new@example.com').first()
        self.assertIsNotNone(updated_user)
        self.assertEqual(updated_user.username, 'newuser')