"""Asset database.   """


import logging
from pathlib import PurePath
from tempfile import TemporaryFile
from zipfile import ZipFile

from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from .. import filetools
from .core import Base, SerializableMixin

ASSET_FILE = Table('Asset_File', Base.metadata,
                   Column('asset_id', Integer, ForeignKey('Asset.id')),
                   Column('file_id', Integer, ForeignKey('File.id')))

LOGGER = logging.getLogger(__name__)


class Asset(Base, SerializableMixin):
    """Asset table.  """

    __tablename__ = 'Asset'
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey('Category.id'))
    thumbnail_id = Column(Integer, ForeignKey('File.id'))
    name = Column(String)
    description = Column(String)
    thumbnail = relationship('File')
    category = relationship('Category', back_populates='assets')
    files = relationship('File', secondary=ASSET_FILE)

    def pack(self):
        """Archive asset files to a temporary file.  """

        used_name = []

        def get_arcname(path):
            """Get arcname from path.  """
            assert isinstance(path, PurePath), type(path)
            ret = path.name
            count = 0
            while ret in used_name:
                count += 1
                ret = f'{path.stem}_{count}{path.suffix}'
            used_name.append(ret)
            return ret

        f = TemporaryFile(suffix='.zip',
                          prefix=self.name)
        with ZipFile(f, 'w', allowZip64=True) as zipfile:

            for i in self.files:
                path = filetools.path(i.path)
                try:
                    zipfile.write(path, get_arcname(path))
                except OSError:
                    LOGGER.error('Error during pack', exc_info=True)

        f.seek(0)
        return f
