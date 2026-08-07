"""
Django settings for CV Builder - Azure App Service ready.
All sensitive values are read from environment variables.
"""

import os
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Security settings from environment
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
DEBUG = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes')
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'resume_app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'resume_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'resume_project.wsgi.application'

# PostgreSQL database configuration
# Supports DATABASE_URL or individual PostgreSQL env vars
DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    db_url = urlparse(DATABASE_URL)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db_url.path[1:],
            'USER': db_url.username,
            'PASSWORD': db_url.password,
            'HOST': db_url.hostname,
            'PORT': db_url.port or '5432',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME', 'cv_builder'),
            'USER': os.environ.get('DB_USER', 'postgres'),
            'PASSWORD': os.environ.get('DB_PASSWORD', 'postgres'),
            'HOST': os.environ.get('DB_HOST', 'localhost'),
            'PORT': os.environ.get('DB_PORT', '5432'),
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files - WhiteNoise for Azure App Service
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files - local by default, Azure Blob Storage in production
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Azure Blob Storage configuration (enabled when AZURE_STORAGE_ACCOUNT_NAME is set)
AZURE_STORAGE_ACCOUNT_NAME = os.environ.get('AZURE_STORAGE_ACCOUNT_NAME', '')
AZURE_STORAGE_ACCOUNT_KEY = os.environ.get('AZURE_STORAGE_ACCOUNT_KEY', '')
AZURE_STORAGE_CONTAINER_NAME = os.environ.get('AZURE_STORAGE_CONTAINER_NAME', 'media')

if AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY:
    DEFAULT_FILE_STORAGE = 'storages.backends.azure_storage.AzureStorage'
    AZURE_ACCOUNT_NAME = AZURE_STORAGE_ACCOUNT_NAME
    AZURE_ACCOUNT_KEY = AZURE_STORAGE_ACCOUNT_KEY
    AZURE_CONTAINER = AZURE_STORAGE_CONTAINER_NAME
    AZURE_OVERWRITE_FILES = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS - allow frontend origin from environment
CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5173,http://127.0.0.1:5173'
).split(',')

# Django REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],
}

# Application Insights - prepared for Azure monitoring (no SDK implementation)
APPLICATIONINSIGHTS_CONNECTION_STRING = os.environ.get(
    'APPLICATIONINSIGHTS_CONNECTION_STRING', ''
)
