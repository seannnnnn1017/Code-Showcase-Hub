

let video; // 定義 video 變量，用於存儲視頻流
let detector; // 定義 detector 變量，用於存儲物體檢測器
let leftPeopleCenterXArray = []; // 左側人物的中心點 X 坐標數組，用於存儲檢測到的左側人物的中心點 X 坐標
let rightPeopleCenterXArray = []; // 右側人物的中心點 X 坐標數組，用於存儲檢測到的右側人物的中心點 X 坐標
let leftPeopleCount = 0; // 左側當前人數
let rightPeopleCount = 0; // 右側當前人數
let preleftPeopleCount = 0; // 左側前一幀人數
let prerightPeopleCount = 0; // 右側前一幀人數
let leftToRightCounter = 0; // 由左到右的人流量計數器，用於記錄從左側到右側的人數變化
let rightToLeftCounter = 0; // 由右到左的人流量計數器，用於記錄從右側到左側的人數變化

let Counter=0;
function sendMQTTMessage(message) {
  // 檢查特定條件並根據結果執行相應的動作
  // 建立一個新的 XMLHttpRequest 物件
  var xhr = new XMLHttpRequest();

  // 設定 POST 請求的 URL
  var url = './receive';

  // 設定請求的方法和 URL
  xhr.open('POST', url);

  // 設定請求的標頭
  xhr.setRequestHeader('Content-Type', 'application/json');

  // 監聽請求狀態的改變
  xhr.onload = function() {
    if (xhr.status === 200) {
      // 請求成功，處理返回的資料
      console.log('Message sent successfully.');
    } else {
      // 請求失敗，處理錯誤
      console.error('Failed to send message. Status: ' + xhr.status);
    }
  };

  // 將 message 資料轉換為 JSON 字串
  var data = JSON.stringify({ message: message });

  // 發送請求
  xhr.send(data);
}

function videoReady() {
  detector = ml5.objectDetector("cocossd", modelReady); // 使用 ml5 庫中的 cocossd 模型進行物體檢測，檢測完成後調用 modelReady 函數
}

function modelReady() {
  // 當物體檢測器模型加載完成時調用的函數，用於開始檢測視頻流中的物體
  console.log("模型已加載"); // 在控制台輸出模型已加載的信息
  detector.detect(video, gotDetections); // 對視頻流進行物體檢測，檢測完成後調用 gotDetections 函數處理檢測結果
}

function gotDetections(error, results) {
  // 當物體檢測完成時調用的函數，處理物體檢測結果
  if (error) {
    // 如果發生錯誤，則在控制台輸出錯誤信息
    console.error(error);
  } else {
    leftPeopleCenterXArray = []; // 清空左側人物的中心點 X 坐標數組
    rightPeopleCenterXArray = []; // 清空右側人物的中心點 X 坐標數組
    for (let i = 0; i < results.length; i++) {
      // 遍歷檢測結果數組
      let object = results[i]; // 獲取當前檢測到的物體信息
      if (object.label === "person") {
        // 如果檢測到的物體是人
        let centerX = object.x + object.width / 2; // 計算人物框的中心點 X 坐標
        if (centerX < video.width / 2) {
          // 如果人物在畫面左側
          leftPeopleCenterXArray.push(centerX); // 將人物的中心點 X 坐標存入左側人物數組
        } else {
          // 如果人物在畫面右側
          rightPeopleCenterXArray.push(centerX); // 將人物的中心點 X 坐標存入右側人物數組
        }

        // 繪製綠色邊界框和顯示標籤
        stroke(0, 255, 0); // 設置邊界框顏色為綠色
        strokeWeight(4); // 設置邊界框線條粗細
        noFill(); // 不填充邊界框
        rect(object.x, object.y, object.width, object.height); // 繪製邊界框
        noStroke(); // 取消邊界框的描邊
        fill(0); // 設置文本顏色為黑色
        textSize(24); // 設置文本大小
        text(object.label, object.x + 10, object.y + 24); // 在人物框左上角顯示物體標籤
      }
    }

    let newLeftPeopleCount = leftPeopleCenterXArray.length; // 計算左側人數
    let newRightPeopleCount = rightPeopleCenterXArray.length; // 計算右側人數
 

    leftPeopleCount = newLeftPeopleCount; // 更新左側人數
    rightPeopleCount = newRightPeopleCount; // 更新右側人數

    document.getElementById('leftCounter').innerText = "左邊螢幕人數:"+leftPeopleCount; // 更新顯示左側人數的元素的文本內容
    document.getElementById('rightCounter').innerText = "右邊螢幕人數:"+rightPeopleCount; // 更新顯示右側人數的元素的文本內容


    if (preleftPeopleCount-leftPeopleCount != 0){

    if (preleftPeopleCount-leftPeopleCount == rightPeopleCount-prerightPeopleCount){
      Counter=Counter+preleftPeopleCount-leftPeopleCount;
      setInterval(sendMQTTMessage(preleftPeopleCount-leftPeopleCount), 2000);
    }}
    document.getElementById('Counter').innerText = "當前房間人數:"+Counter; // 更新顯示由左到右的人流量計數器的元素的文本內容


    preleftPeopleCount = leftPeopleCount;
    prerightPeopleCount= rightPeopleCount;
    detector.detect(video, gotDetections); // 立即進行下一次物體檢測
  }
}

function setup() {
  // 在頁面加載時運行的函數，用於創建畫布和視頻元素
  createCanvas(640, 480); // 創建一個 640x480 大小的畫布
  video = createCapture(VIDEO, videoReady); // 創建一個視頻捕獲元素，並在視頻就緒時調用 videoReady 函數
  video.size(640, 480); // 設置視頻捕獲元素的大小為 640x480
  video.hide(); // 隱藏視頻捕獲元素

  // 創建用於顯示左側人數的元素
  let leftCounterElement = document.createElement('div'); // 創建一個 div 元素
  leftCounterElement.id = 'leftCounter'; // 設置該元素的 id 屬性為 'leftCounter'
  leftCounterElement.innerText = '0'; // 設置該元素的文本內容為 '0'
  document.body.appendChild(leftCounterElement); // 將該元素添加到頁面的 body 中

  // 創建用於顯示右側人數的元素
  let rightCounterElement = document.createElement('div'); // 創建一個 div 元素
  rightCounterElement.id = 'rightCounter'; // 設置該元素的 id 屬性為 'rightCounter'
  rightCounterElement.innerText = '0'; // 設置該元素的文本內容為 '0'
  document.body.appendChild(rightCounterElement); // 將該元素添加到頁面的 body 中

  // 創建用於顯示由左到右的人流量計數器的元素
  let leftToRightCounterElement = document.createElement('div'); // 創建一個 div 元素
  leftToRightCounterElement.id = 'Counter'; // 設置該元素的 id 屬性為 'leftToRightCounter'
  leftToRightCounterElement.innerText = '0'; // 設置該元素的文本內容為 '0'
  document.body.appendChild(leftToRightCounterElement); // 將該元素添加到頁面的 body 中

}

function draw() {
  // 在每一幀更新時運行的函數，用於繪製畫面
  image(video, 0, 0); // 將視頻捕獲元素的內容繪製到畫布上
  
  // 繪製中線
  stroke(255); // 設置線條顏色為白色
  strokeWeight(2); // 設置線條粗細
  line(video.width / 2, 0, video.width / 2, video.height); // 繪製垂直中線
}

