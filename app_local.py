from flask import Flask, render_template, request, url_for, redirect,session,jsonify,abort,redirect
from datetime import datetime, timedelta
import os
from pymongo import MongoClient
from datetime import timedelta
import requests


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')



if __name__=="__main__":
    app.run(debug=True)