"""Test module `assetdb.filetools`.  """

from pathlib import PurePath
from unittest import TestCase, main

from assetdb import filetools


class UtilTestCase(TestCase):
    def test_get_path(self):
        result = filetools.path('test')
        self.assertIsInstance(result, PurePath)
        result = filetools.path('test', 'path')
        self.assertIsInstance(result, PurePath)


if __name__ == '__main__':
    main()
