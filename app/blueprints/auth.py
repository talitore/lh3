from flask import Blueprint, render_template, redirect, url_for, flash, request, jsonify
from app import supabase
from app.models import User
from flask_login import login_user, logout_user, login_required, current_user
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os

auth = Blueprint('auth', __name__, template_folder='templates')

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if the user exists
        user = User.get_by_username(username)
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('main.index'))
        flash('Invalid username or password', 'error')
    return render_template('auth/login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('main.index'))

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        # Validate input
        if not username or not email or not password:
            flash('All fields are required', 'error')
            return render_template('auth/register.html')

        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return render_template('auth/register.html')

        # Check if user already exists
        existing_user = User.get_by_username(username)
        if existing_user:
            flash('Username already exists', 'error')
            return render_template('auth/register.html')

        existing_email = User.get_by_email(email)
        if existing_email:
            flash('Email already in use', 'error')
            return render_template('auth/register.html')

        # Create a user record
        try:
            hashed_password = generate_password_hash(password)
            response = supabase.table('users').insert({
                'username': username,
                'email': email,
                'password_hash': hashed_password,
                'role': 'member',
                'privacy_settings': {'profile': 'public', 'runs': 'public', 'stats': 'public'}
            }).execute()

            if response.data:
                flash('Registration successful! Please log in.', 'success')
                return redirect(url_for('auth.login'))
        except Exception as e:
            flash(f'Registration failed: {str(e)}', 'error')

    return render_template('auth/register.html')

@auth.route('/profile')
@login_required
def profile():
    return render_template('auth/profile.html', user=current_user)

@auth.route('/profile/edit', methods=['GET', 'POST'])
@login_required
def edit_profile():
    if request.method == 'POST':
        bio = request.form.get('bio')
        hash_nickname = request.form.get('hash_nickname')
        privacy_profile = request.form.get('privacy_profile', 'public')
        privacy_runs = request.form.get('privacy_runs', 'public')
        privacy_stats = request.form.get('privacy_stats', 'public')

        # Handle avatar upload
        avatar = None
        if 'avatar' in request.files:
            file = request.files['avatar']
            if file and file.filename:
                filename = secure_filename(file.filename)
                # Here we'd normally save the file, but for Supabase we'd use their storage
                # For now, just update the filename in the database
                avatar = filename

        try:
            update_data = {
                'bio': bio,
                'hash_nickname': hash_nickname,
                'privacy_settings': {
                    'profile': privacy_profile,
                    'runs': privacy_runs,
                    'stats': privacy_stats
                }
            }

            if avatar:
                update_data['avatar'] = avatar

            response = supabase.table('users').update(update_data).eq('id', current_user.id).execute()

            if response.data:
                flash('Profile updated successfully!', 'success')
                return redirect(url_for('auth.profile'))
        except Exception as e:
            flash(f'Failed to update profile: {str(e)}', 'error')

    return render_template('auth/edit_profile.html', user=current_user)

@auth.route('/users')
@login_required
def list_users():
    if not current_user.is_admin():
        flash('You do not have permission to view this page', 'error')
        return redirect(url_for('main.index'))

    response = supabase.table('users').select('*').execute()
    users = [User(**user_data) for user_data in response.data]
    return render_template('auth/users.html', users=users)

@auth.route('/users/<int:user_id>')
def view_user(user_id):
    user = User.get(user_id)
    if not user:
        flash('User not found', 'error')
        return redirect(url_for('main.index'))

    # Check privacy settings if not the current user or an admin
    if not current_user.is_authenticated or (current_user.id != user.id and not current_user.is_admin()):
        if user.privacy_settings.get('profile') != 'public':
            flash('This profile is private', 'error')
            return redirect(url_for('main.index'))

    return render_template('auth/view_user.html', user=user)
