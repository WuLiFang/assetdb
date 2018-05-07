"""Assetdb app setup.  """
import logging
import os

from flask import Flask
from raven.contrib.flask import Sentry
from flask_restful import Api

from .. import __about__

APP = Flask(__about__.__name__)
API = Api(APP, prefix='/api')
SENTRY = Sentry(APP, logging=os.getenv('SENTRY_DSN'),
                level=logging.WARNING)
