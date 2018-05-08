"""Asset database.   """


from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from .core import Base, SerializableMixin

ASSET_FILE = Table('Asset_File', Base.metadata,
                   Column('asset_id', Integer, ForeignKey('Asset.id')),
                   Column('file_id', Integer, ForeignKey('File.id')))


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
