from flask import Flask, render_template, request, url_for, redirect,session,jsonify,abort,redirect
from datetime import datetime, timedelta
import os
from pymongo import MongoClient
from datetime import timedelta
import requests