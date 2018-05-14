"""Assetdb RESTful API about asset.  """

import logging
from pathlib import Path

import werkzeug
from flask_restful import Resource, reqparse

from ... import database, filetools
from ..app import API
from .core import database_session

LOGGER = logging.getLogger(__name__)


class FileManage(Resource):
    """All files in database.  """

    @staticmethod
    def get():
        """Get all file info.   """
        with database_session() as sess:
            return [i.serialize() for i in sess.query(database.File).all()]

    @staticmethod
    def post():
        """Accept file uploading.  """

        parser = reqparse.RequestParser()
        parser.add_argument('path', required=True)
        parser.add_argument(
            'file', required=True,
            type=werkzeug.datastructures.FileStorage,
            location='files')
        args = parser.parse_args()
        LOGGER.debug('%s', args.path)

        save_path = filetools.path(args.path, args.file.filename)
        try:
            filetools.relpath(save_path)
        except ValueError:
            return 'Invalid save path', 400
        if Path(save_path).exists():
            return 'Filename already inuse', 409

        LOGGER.debug('New file, save to: %s', save_path)
        Path(save_path.parent).mkdir(parents=True, exist_ok=True)
        args.file.save(save_path.as_posix())

        with database_session() as sess:
            item = database.File.add(save_path, sess)
            sess.commit()
            return item.serialize()


API.add_resource(FileManage, '/file')


class File(Resource):
    """API for file.  """

    @staticmethod
    def _get_item(id_, session):
        return session.query(database.File).get(id_)

    @classmethod
    def get(cls, id_):
        """Get file info from id.   """

        with database_session() as sess:
            return cls._get_item(id_, sess).serialize()

    @classmethod
    def delete(cls, id_):
        """Delete a file.  """

        with database_session() as sess:
            item = cls._get_item(id_, sess)
            sess.delete(item)

        return 'Deleted'


API.add_resource(File, '/file/<id_>')
