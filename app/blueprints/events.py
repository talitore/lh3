from flask import Blueprint, render_template, request, redirect, url_for, flash
from app import db
from app.models import Event

events = Blueprint('events', __name__)

@events.route('/')
def list_events():
    events_list = Event.query.all()
    return render_template('events/list.html', events=events_list)

@events.route('/create', methods=['GET', 'POST'])
def create_event():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        location = request.form.get('location')
        # Additional fields (event_date, fees, etc.) can be processed here
        new_event = Event(title=title, description=description, location=location)
        db.session.add(new_event)
        db.session.commit()
        flash('Event created successfully')
        return redirect(url_for('events.list_events'))
    return render_template('events/create.html')

@events.route('/<int:event_id>')
def event_detail(event_id):
    event = Event.query.get_or_404(event_id)
    return render_template('events/detail.html', event=event)
