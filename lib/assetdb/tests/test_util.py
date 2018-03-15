"""Test module `assetdb.util`.  """

from pathlib import PurePath
from unittest import TestCase, main

from assetdb import util


class UtilTestCase(TestCase):
    def test_get_path(self):
        result = util.path('test')
        self.assertIsInstance(result, PurePath)
        result = util.path('test', 'path')
        self.assertIsInstance(result, PurePath)


if __name__ == '__main__':
    main()
