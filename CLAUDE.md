# LH3 Development Guidelines

## Run Commands

- Start development server: `python run.py`
- Install dependencies: `pip install -r requirements.txt`
- Create virtual environment: `python -m venv venv && source venv/bin/activate`
- Set up environment variables: Create a `.env` file with `SUPABASE_URL`, `SUPABASE_KEY`, and `SECRET_KEY`

## Code Style Guidelines

- **Imports**: Group imports by standard library, third-party, then local modules with a blank line between groups
- **Flask Blueprints**: Use blueprints for modular routes organization; all routes in `/app/blueprints/`
- **Models**: Define database models in `app/models.py` with clear class methods
- **Error Handling**: Use try/except blocks for Supabase operations with specific flash messages
- **Authentication**: Use Flask-Login for user authentication
- **Route Naming**: Follow RESTful conventions (list, create, detail, etc.)
- **Type Hints**: Not currently used but encouraged for new code
- **Documentation**: Include docstrings for non-trivial functions
- **Security**: Never commit secrets, use environment variables via python-dotenv
