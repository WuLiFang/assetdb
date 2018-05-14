"""App setting.  """

import os

ROOT = os.getenv('ASSETDB_ROOT', "Y:/Assets_DataBase")
ENGINE_URI = os.getenv('ASSETDB_ENGINE_URI', 'sqlite:///:memory:')
