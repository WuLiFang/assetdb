"""Test module `database.asset`.   """

from unittest import TestCase, main
from assetdb.database import asset
from util import set_debug_settings
from assetdb import util


class AssetTestCase(TestCase):
    def setUp(self):
        set_debug_settings()

    def test_setup(self):
        asset.setup()

    def test_add_asset(self):
        asset.add_asset(util.path('Set/test.mb'))


if __name__ == '__main__':
    main()
