"""
API blueprint for the PovertyLine application.
"""
from flask import Blueprint

api_bp = Blueprint('api', __name__)

from app.api import users, profiles, resources
