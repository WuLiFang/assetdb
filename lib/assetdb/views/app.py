"""Assetdb app setup.  """

from flask import Flask
from .. import __about__

APP = Flask(__about__.__name__)
