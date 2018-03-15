from unittest import TestCase, main
from assetdb.database import category
from util import set_debug_settings


class CategoryTestCase(TestCase):
    def setUp(self):
        set_debug_settings()

    def test_setup(self):
        category.setup()
        # util.setup()


if __name__ == '__main__':
    main()
