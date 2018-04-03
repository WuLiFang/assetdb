"""Assetdb main view.  """

from flask import Flask, abort, g, jsonify, render_template, request

from ..__about__ import __version__

from .app import APP


@APP.route('/')
def main():
    return render_template('index.html', __version__=__version__)
