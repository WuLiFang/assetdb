"""Assetdb RESTful API core functionity.  """

import logging

from flask import request

from ... import setting
from ..app import APP

LOGGER = logging.getLogger(__name__)


def dispatch(cls, *args, **kwargs):
    """Dispatch function call to class.  """

    return getattr(cls, request.method.lower())(*args, **kwargs)


@APP.route(f'/api/root')
def get_root():
    """Get root path"""

    return setting.ROOT
