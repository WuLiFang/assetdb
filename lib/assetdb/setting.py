"""App setting.  """

import os

ROOT = "Y:/Assets_DataBase"
DATABASE = 'asset.db'
ENGINE_URI = os.getenv('ASSETDB_ENGINE_URI', 'sqlite:///:memory:')
