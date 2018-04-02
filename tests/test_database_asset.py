"""Test module `database.asset`.   """

from unittest import TestCase, main

from assetdb import util
from assetdb.database import asset
from assetdb.database.util import setup
from util import set_debug_settings


class AssetTestCase(TestCase):
    def setUp(self):
        set_debug_settings()
        setup()

    def test_setup(self):
        asset.setup()

    def test_add_asset(self):
        asset.add_asset(util.path('test.mb'))


if __name__ == '__main__':
    main()
