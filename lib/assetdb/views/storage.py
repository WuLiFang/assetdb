"""Expose asset storage.  """
from flask import send_from_directory

from .. import setting
from .app import APP


@APP.route(f'/storage/<path:filename>')
def get_storage(filename):
    """Get storage file from filename.  """
    return send_from_directory(setting.ROOT, filename)
