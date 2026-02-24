import os
from dotenv import load_dotenv
basedir = os.path.abspath(os.path.dirname(__file__))

load_dotenv()
class Config:
  OAUTH2_CLIENT_ID = os.environ.get("OAUTH2_CLIENT_ID") or ""
  OAUTH2_CLIENT_SECRET = os.environ.get("OAUTH2_CLIENT_SECRET") or ""
  OAUTH2_META_URL = os.environ.get("OAUTH2_META_URL") or ""
  OAUTH2_REDIRECT_URI = os.environ.get("OAUTH2_REDIRECT_URI") or ""
  FLASK_SECRET = os.environ.get("FLASK_SECRET") or ""
  FINNHUB = os.environ.get("FINNHUB") or ""
  CLIENT_BASE_URL = os.environ.get("CLIENT_BASE_URL") or ""

  # encrypts the data at the server side
  SECRET_KEY = FLASK_SECRET
  FLASK_PORT = 5000
  
  # Session Configuration
  SESSION_TYPE = "filesystem"
  SESSION_COOKIE_SECURE = False
  SESSION_COOKIE_HTTPONLY = True
  SESSION_COOKIE_SAMESITE = 'Lax'
  
  # SECRET_KEY = os.environ.get("SECRET_KEY") or ""
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
