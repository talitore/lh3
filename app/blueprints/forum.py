from flask import Blueprint, render_template, request, redirect, url_for, flash
from app import supabase
from app.models import ForumPost
from flask_login import login_required, current_user

forum = Blueprint('forum', __name__)

@forum.route('/')
def list_posts():
    posts = ForumPost.get_all()
    return render_template('forum/list.html', posts=posts)

@forum.route('/create', methods=['GET', 'POST'])
@login_required
def create_post():
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')

        try:
            response = supabase.table('forum_posts').insert({
                'title': title,
                'content': content,
                'user_id': current_user.id,
                'timestamp': 'now()'  # Supabase will handle the timestamp
            }).execute()

            if response.data:
                flash('Post created successfully')
                return redirect(url_for('forum.list_posts'))
        except Exception as e:
            flash('Failed to create post.')

    return render_template('forum/create.html')

@forum.route('/<int:post_id>')
def post_detail(post_id):
    post = ForumPost.get(post_id)
    if post is None:
        flash('Post not found.')
        return redirect(url_for('forum.list_posts'))
    return render_template('forum/detail.html', post=post)
