let video;
let detector;
let connectMQTT = false; // 是否連接 MQTT 伺服器
let now;
let last;


function videoReady(){
  detector = ml5.objectDetector("cocossd", modelReady);
}

function modelReady(){
  detector.detect(video, gotDetections);
}

function gotDetections(error, results){
  if(error){
    console.error(error);
  } else {
    for(let i = 0; i < results.length; i++){
      let object = results[i];

    
      // 畫出綠框框住物體
      stroke(0, 255, 0);
      strokeWeight(4);
      noFill();
      rect(object.x, object.y, object.width, object.height);
      // 顯示標籤在綠框左上角
      noStroke();
      fill(0);
      textSize(24);
      text(object.label, object.x + 10, object.y + 24);
    }
    // 再次偵測
    detector.detect(video, gotDetections);
  }
}

function setup(){
  // 重置計時器
  now = millis();
  
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.hide();
  
 
  
}

function draw(){
  image(video, 0, 0);
}
