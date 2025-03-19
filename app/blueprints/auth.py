from flask import Blueprint, render_template, redirect, url_for, flash, request
from app import supabase
from app.models import User
from flask_login import login_user, logout_user, login_required

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # TODO: use Supabase Auth
        # check if the user exists
        user = User.get_by_username(username)
        if user:
            login_user(user)
            return redirect(url_for('main.index'))
        flash('Invalid credentials')
    return render_template('auth/login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        # TODO: use Supabase Auth
        # create a user record
        try:
            response = supabase.table('users').insert({
                'username': username,
                'email': email,
                # TODO: hash the password
                'password_hash': password
            }).execute()

            if response.data:
                flash('Registration successful, please log in.')
                return redirect(url_for('auth.login'))
        except Exception as e:
            flash('Registration failed. Username or email might already exist.')

    return render_template('auth/register.html')
