"""Assetdb app setup.  """
import logging

from flask import Flask
from raven.contrib.flask import Sentry

from .. import __about__

APP = Flask(__about__.__name__)
SENTRY = Sentry(APP, logging=True,
                level=logging.WARNING)
