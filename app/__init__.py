from flask import Flask
from config import Config
from supabase import create_client, Client
from flask_login import LoginManager

supabase: Client = None
login_manager = LoginManager()
login_manager.login_view = 'auth.login'  # Redirect unauthorized users to the login page

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Supabase
    global supabase
    supabase = create_client(app.config['SUPABASE_URL'], app.config['SUPABASE_KEY'])

    login_manager.init_app(app)

    # Register blueprints
    from app.blueprints.main import main as main_bp
    app.register_blueprint(main_bp)

    from app.blueprints.auth import auth as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    from app.blueprints.events import events as events_bp
    app.register_blueprint(events_bp, url_prefix='/events')

    from app.blueprints.forum import forum as forum_bp
    app.register_blueprint(forum_bp, url_prefix='/forum')

    return app
