"""
Simple script to run the Flask development server for the PovertyLine application.
This script doesn't rely on Click and can be run directly with Python.
"""
import os

# Set environment variables manually
os.environ['DATABASE_URL'] = 'sqlite:///povertyline_db.sqlite'
os.environ['SECRET_KEY'] = 'dev-secret-key'
os.environ['JWT_SECRET_KEY'] = 'jwt-secret-key'
os.environ['FLASK_ENV'] = 'development'

from app import create_app

app = create_app()

if __name__ == '__main__':
    print("Starting PovertyLine backend server...")
    print("The API will be available at http://localhost:5005")
    app.run(debug=True, host='0.0.0.0', port=5005)
