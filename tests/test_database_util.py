"""Test module `database.util`.   """

from unittest import TestCase, main
from assetdb.database import util
from util import set_debug_settings


class DatabaseUtilTestCase(TestCase):
    def setUp(self):
        set_debug_settings()

    def test_walk_root(self):
        util.walk_root()

    def test_setup(self):
        util.setup()


if __name__ == '__main__':
    main()
