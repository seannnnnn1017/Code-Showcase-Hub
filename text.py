import paho.mqtt.client as mqtt

# 定義 MQTT 代理地址和端口
broker_address = "test.mosquitto.org"
port = 1883
username = 'op23756778'
password = 'aio_UCJy96adfLWqDN8bLFQsXjlhfkUX'

# 定義要訂閱的主題
topic = "op23756778"

# 當連接成功時的回調函數
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    # 訂閱主題
    client.subscribe(topic)

# 當收到消息時的回調函數
def on_message(client, userdata, msg):
    print("Received message: " + str(msg.payload))

# 創建 MQTT 用戶端
client = mqtt.Client()

# 設置用戶名和密碼
client.username_pw_set(username, password)

# 設置連接成功和收到消息的回調函數
client.on_connect = on_connect
client.on_message = on_message

# 連接到 MQTT 代理
client.connect(broker_address, port, 60)

# 開始循環，保持連接
print('sta')
client.loop_forever()
