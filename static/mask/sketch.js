let video;
let CNN;               // 卷積神經網路
let predictLabel;      // 預測標籤
let videoSizeW = 640;  // 影像寬度
let videoSizeH = 480;  // 影像高度
let videoResize = 48;  // 進 CNN 前要調整的大小
let snapshotW = 40;       // 縮圖寬度
let snapshotH = 30;       // 縮圖高度
let snapshotY = 500;      // 縮圖水平位置
let labels = ['no_mask', 'mask'];  // 訓練標籤

let host="test.mosquitto.org";
let port=1883;

uploadModel();

function drawGUI(){
  // 建立下方放置縮圖的兩條縮圖列
  // SVG 圖檔來源為：https://www.svgrepo.com/
  guiImgButton('static/mask/assets/upload.png', 657, 20, 70, uploadModel);
  
}

function setup() {
  createCanvas(videoSizeW, videoSizeH*2);
  video = createCapture(VIDEO);
  // 隱藏攝影機原始拍攝畫面
  video.hide();
  
  // 建立 GUI
  drawGUI();
  // 建立 CNN 模型
  let options = {
    inputs: [videoResize, videoResize, 4],
    task: 'imageClassification',
    debug: true,
  };
  CNN = ml5.neuralNetwork(options);
  uploadModel();

}

function draw() {
  // 在視訊畫面上繪製影像
  image(video, 0, 0, videoSizeW, videoSizeH);

  // 檢查特定條件並根據結果執行相應的動作
  if (predictLabel == labels[0]) {
    fill(255, 255, 255);
    textSize(72);
    text("請戴上口罩！", width / 3, height / 3);
    tint(255, 20, 150);
  } else {
    tint(255);
  }
}

function sendMQTTMessage() {
  // 檢查特定條件並根據結果發送 MQTT 訊息
  if (predictLabel == labels[0]) {
    var message = new Paho.MQTT.Message("999");
    message.destinationName = "op23756778";
    client.send(message);
  }
}



// 增加標籤 1 資料(沒有口罩)
function addLabel1Data() {
  addLabelData(0);
}

// 增加標籤 2 資料(有口罩)
function addLabel2Data() {
  addLabelData(1);
}

// 增加標籤方法
function addSample(label) {
  let videoNew = video.get();
  videoNew.resize(videoResize,videoResize);
  let inputImage = {
    image: videoNew,
  };
  let target = {
    label,
  };
  console.log('增加 ' + label + ' 樣本');
  CNN.addData(inputImage, target);
}

// 訓練神經網路
function trainModel() {
    CNN.normalizeData();
    CNN.train({
        epochs: 50,
      },
      finishedTraining
    );
}

// 訓練完成
function finishedTraining() {
  console.log('訓練完成');
  classifyVideo();
}

// 影像分類
function classifyVideo() {
  let videoNew = video.get();
  videoNew.resize(videoResize,videoResize);
  let inputImage = {
    image: videoNew,
  };
  CNN.classify(inputImage, gotResults);
}

// 取得結果
function gotResults(error, results) {
  if (error) {
    return;
  }
  predictLabel = results[0].label;
  console.log("預測結果：" + predictLabel);
  classifyVideo();
}

//----------下載模型----------
function downloadModel() {
  CNN.save('model');
}

//----------上傳模型----------
function uploadModel() {
  const modelInfo = {
    model: 'static/mask/model/model.json',
    metadata: 'static/mask/model/model_meta.json',
    weights: 'static/mask/model/model.weights.bin',
  };
  CNN.load(modelInfo, modelLoaded);
}


function modelLoaded(){
  console.log('模型讀取完畢');
  classifyVideo();
}
