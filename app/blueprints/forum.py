from flask import Blueprint, render_template, request, redirect, url_for, flash
from app import db
from app.models import ForumPost
from flask_login import login_required, current_user

forum = Blueprint('forum', __name__)

@forum.route('/')
def list_posts():
    posts = ForumPost.query.order_by(ForumPost.timestamp.desc()).all()
    return render_template('forum/list.html', posts=posts)

@forum.route('/create', methods=['GET', 'POST'])
@login_required
def create_post():
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        new_post = ForumPost(title=title, content=content, user_id=current_user.id)
        db.session.add(new_post)
        db.session.commit()
        flash('Post created successfully')
        return redirect(url_for('forum.list_posts'))
    return render_template('forum/create.html')

@forum.route('/<int:post_id>')
def post_detail(post_id):
    post = ForumPost.query.get_or_404(post_id)
    return render_template('forum/detail.html', post=post)
