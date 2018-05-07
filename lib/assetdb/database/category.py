"""Database category table.  """
from pathlib import PurePath

from sqlalchemy import Column, ForeignKey, Integer, String

from .. import setting
from .core import Base, Path, session_scope
from . import exceptions


class Category(Base):
    """Category table.  """
    __tablename__ = 'Category'
    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('Category.id'))
    name = Column(String)
    path = Column(Path, unique=True)

    def to_tuple(self):
        """Serialize"""
        return (self.id,
                self.parent_id,
                self.name,
                self.path and self.path.as_posix())


def add_category(dirpath, name=None):
    """Add a category from dirpath.

    Args:
        dirpath (str): Dirpath relative to ROOT.
        name (str, optional): Defaults to None. Category name.
    """

    dirpath = PurePath(dirpath)
    name = name or dirpath.name

    try:
        path = dirpath.relative_to(setting.ROOT)
    except ValueError:
        raise exceptions.PathError(path)

    with session_scope() as sess:
        if sess.query(Category).filter(Category.path == path).first():
            raise exceptions.DuplicatePathError

        if PurePath(dirpath) == PurePath(setting.ROOT):
            parent_id = None
        else:
            parent_path = dirpath.parent.relative_to(setting.ROOT)
            parent = sess.query(Category).filter(
                Category.path == parent_path).one_or_none()
            parent_id = parent.id

        category = Category(
            parent_id=parent_id,
            name=name,
            path=path,
        )
        sess.add(category)
