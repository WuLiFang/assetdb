from assetdb import setting
import os


def set_debug_settings():
    setting.ROOT = os.path.abspath(os.path.join(__file__, '../dummy_db'))
