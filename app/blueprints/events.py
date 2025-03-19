from flask import Blueprint, render_template, request, redirect, url_for, flash
from app import supabase
from app.models import Event

events = Blueprint('events', __name__)

@events.route('/')
def list_events():
    events_list = Event.get_all()
    return render_template('events/list.html', events=events_list)

@events.route('/create', methods=['GET', 'POST'])
def create_event():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        location = request.form.get('location')
        event_date = request.form.get('event_date')

        try:
            response = supabase.table('events').insert({
                'title': title,
                'description': description,
                'location': location,
                'event_date': event_date
            }).execute()

            if response.data:
                flash('Event created successfully')
                return redirect(url_for('events.list_events'))
        except Exception as e:
            flash('Failed to create event.')

    return render_template('events/create.html')

@events.route('/<int:event_id>')
def event_detail(event_id):
    event = Event.get(event_id)
    if event is None:
        flash('Event not found.')
        return redirect(url_for('events.list_events'))
    return render_template('events/detail.html', event=event)
