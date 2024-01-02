from flask import Flask, render_template, request, url_for, redirect,session,jsonify,abort,redirect
from datetime import datetime, timedelta
import os
from pymongo import MongoClient
from datetime import timedelta
import requests


#MQTT
import paho.mqtt.publish as publish

# Define the MQTT broker address and port
broker_address = "io.adafruit.com"
port = 1883
username='op23756778'
password='aio_UCJy96adfLWqDN8bLFQsXjlhfkUX'
# Define the topic to subscribe to
topic = 'op23756778/feeds/visitors'

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/mask_larn')
def mask_larn():
    return render_template('mask_larn.html') 

@app.route('/mask')
def mask():
    return render_template('mask.html')

@app.route('/receive', methods=['POST','GET'])
def receive_message():
    data = request.get_json()
    message = data['message']
    # 根據 message 的值執行相應的操作
    print('Received message:', message)
    publish.single(topic, message, hostname=broker_address, port=port, auth={'username': username, 'password': password})
    return 'Message received successfully.', 200

@app.route('/computer_visual')
def CP():
    return render_template('computer_visual.html')

@app.route('/update_counter', methods=['POST'])
def update_counter():
    data = request.get_json()
    value = data.get('value')
    # Process the value as needed
    print('Received value:', value)
    return 'Value received successfully'
if __name__=="__main__":
    app.run(debug=True)

 