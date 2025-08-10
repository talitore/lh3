# Implemented Use Cases

## User Account Management

- [ ] **Given** a user is on the registration page, **when** they fill in and submit the registration form with valid data, **then** a new user account is created and they are logged in.
- [ ] **Given** a user has an existing account, **when** they go to the sign-in page and submit valid credentials, **then** they are logged in.
- [ ] **Given** a user is logged in, **when** they click the sign-out link, **then** they are logged out.
- [ ] **Given** a user has forgotten their password, **when** they submit their email address on the password reset page, **then** they receive an email with a link to reset their password.
- [ ] **Given** a new user has just signed up, **when** they check their email, **then** they find a verification email with a link to confirm their account.
- [x] **Given** a user is logged in, **when** they submit the change password form with their current password and a new password, **then** their password is updated successfully.

## Event Management

- [ ] **Given** a user is logged in, **when** they fill out and submit the new event form, **then** a new event is created.
- [ ] **Given** a user is on the events page, **when** the page loads, **then** they see a list of all events.
- [ ] **Given** there are existing events, **when** a user clicks on an event, **then** they see the details of that event.
- [ ] **Given** a user has created an event, **when** they go to the edit page for that event and submit changes, **then** the event is updated.
- [ ] **Given** a user has created an event, **when** they delete the event, **then** the event is removed.

## RSVPs

- [ ] **Given** a user is viewing an event, **when** they click the RSVP button, **then** they are marked as attending the event.
- [ ] **Given** a user is viewing an event, **when** they look at the attendee list, **then** they see a list of users who have RSVP'd.

## Photo Sharing

- [ ] **Given** a user is attending an event, **when** they upload a photo on the event page, **then** the photo is added to the event's gallery.
- [ ] **Given** an event has photos, **when** a user views the event's gallery, **then** they see the photos.
