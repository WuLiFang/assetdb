"""Test tools.  """
import os

from assetdb import setting


def set_debug_settings():
    """Set settings for test.  """

    setting.ROOT = os.path.abspath(os.path.join(__file__, '../dummy_db'))
    setting.ENGINE_URI = 'sqlite:///' + \
        os.path.abspath(os.path.join(__file__, '../dummy_db/asset.db'))
