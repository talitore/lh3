from flask import Blueprint, render_template, redirect, url_for, flash, request
from app import db
from app.models import User
from flask_login import login_user, logout_user, login_required

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    # Placeholder login logic
    if request.method == 'POST':
        username = request.form.get('username')
        # In a real app, add proper password checking
        user = User.query.filter_by(username=username).first()
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
    # Placeholder registration logic
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        # Normally, you would hash the password and include additional validation
        user = User(username=username, email=email)
        db.session.add(user)
        db.session.commit()
        flash('Registration successful, please log in.')
        return redirect(url_for('auth.login'))
    return render_template('auth/register.html')
