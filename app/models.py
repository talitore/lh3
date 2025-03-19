from app import supabase, login_manager
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin):
    def __init__(self, id, username, email, password_hash=None):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash

    @staticmethod
    def get(user_id):
        response = supabase.table('users').select('*').eq('id', user_id).execute()
        if response.data:
            user_data = response.data[0]
            return User(user_data['id'], user_data['username'], user_data['email'])
        return None

    @staticmethod
    def get_by_username(username):
        response = supabase.table('users').select('*').eq('username', username).execute()
        if response.data:
            user_data = response.data[0]
            return User(user_data['id'], user_data['username'], user_data['email'])
        return None

    def __repr__(self):
        return f'<User {self.username}>'

@login_manager.user_loader
def load_user(user_id):
    return User.get(int(user_id))

class Event:
    def __init__(self, id, title, description, location, event_date):
        self.id = id
        self.title = title
        self.description = description
        self.location = location
        self.event_date = event_date

    @staticmethod
    def get_all():
        response = supabase.table('events').select('*').execute()
        return [Event(**event) for event in response.data]

    @staticmethod
    def get(event_id):
        response = supabase.table('events').select('*').eq('id', event_id).execute()
        if response.data:
            return Event(**response.data[0])
        return None

    def __repr__(self):
        return f'<Event {self.title}>'

class ForumPost:
    def __init__(self, id, title, content, timestamp, user_id):
        self.id = id
        self.title = title
        self.content = content
        self.timestamp = timestamp
        self.user_id = user_id

    @staticmethod
    def get_all():
        response = supabase.table('forum_posts').select('*').order('timestamp', desc=True).execute()
        return [ForumPost(**post) for post in response.data]

    @staticmethod
    def get(post_id):
        response = supabase.table('forum_posts').select('*').eq('id', post_id).execute()
        if response.data:
            return ForumPost(**response.data[0])
        return None

    def __repr__(self):
        return f'<ForumPost {self.title}>'
