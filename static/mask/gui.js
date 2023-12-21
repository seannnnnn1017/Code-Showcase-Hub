let xOrigin, yOrigin; // 圖表原點位置
let xPixels, yPixels; // 圖表 XY 軸刻度間距像素
let xStep, yStep; // 圖表 XY 軸刻度值間隔
let xStart, yStart; // 圖表 XY 軸刻度值啟始值
let txtSize; // 圖表刻度文字大小

// 繪製圓形數值
function drawCircledNum(
  x,         // 圓心及半徑
  y,
  r, 
  cr,        // 填色
  cg,
  cb, 
  txtSize,   // 文字大小
  num,       // 數值
  xOff,
  yOff       // 文字偏移
) {
  fill(cr, cg, cb);
  circle(x, y, r);
  textSize(txtSize);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  text(num, x + xOff, y + yOff);
}

//----繪製 XY 軸方格圖-----
function drawChart(
  _xOrigin,  // 圖表原點位置
  _yOrigin, 
  _xPixels,  // XY 軸刻度間距像素
  _yPixels,  
  _xStep,    // XY 軸刻度值間隔
  _yStep, 
  _xStart,   // XY 軸刻度值啟始值
  _yStart, 
  _txtSize   // 刻度文字大小
) {
  xOrigin = _xOrigin;
  yOrigin = _yOrigin;
  xPixels = _xPixels;
  yPixels = _yPixels;
  xStep = _xStep;
  yStep = _yStep;
  xStart = _xStart;
  yStart = _yStart;
  txtSize = _txtSize;

  textSize(txtSize);
  // 標出 X 軸數值
  for (
    let x = xOrigin, v = xStart;
    x <= width - xPixels;
    x += xPixels, v += xStep
  ) {
    text(v, x - txtSize / 2, yOrigin + txtSize);
    // 畫出 Y 軸線
    line(x, yOrigin, x, 0);
  }
  // 標出 Y 軸數值
  for (let y = yOrigin, v = yStart; y >= yPixels; y -= yPixels, v += yStep) {
    text(v, xOrigin - txtSize * 2, y + txtSize / 2);
    // 畫出 X 軸線
    line(xOrigin, y, width, y);
  }
}

// 在圖表上指定座標繪製半徑 10 像素的圓點
function drawPoint(x, y, sz) {
  x = int(((x - xStart) * xPixels) / xStep) + xOrigin;
  y = yOrigin - int(((y - yStart) * yPixels) / yStep);
  ellipse(x, y, sz, sz);
}

function drawRectangle(x, y, sz) {
  x = int(((x - xStart) * xPixels) / xStep) + xOrigin;
  y = yOrigin - int(((y - yStart) * yPixels) / yStep);
  noStroke();
  rectMode(CENTER);
  rect(x, y, sz, sz);
}

//-----在指定位置繪製圖片按鈕-----
function guiImgButton(
  src, // 圖檔來源
  x,   // 按鈕位置
  y,   
  sz,  // 按鈕大小
  cb,  // 事件處理函式
  alt  // 替代文字
) {
  alt = (alt === undefined) ? "" : alt;
  btn = createImg(src, alt);
  btn.position(x, y);
  btn.size(sz, sz);
  btn.mousePressed(cb);
}

// 畫面左右翻轉
function xFlip(video) {
  push(); // 開始新的畫圖狀態(避免文字也被翻轉)
  // 將起始點更改為右上角
  translate(video.width, 0);
  // 根據 X 軸翻轉
  scale(-1, 1);
  // (影像, 起始x點, 起始y點, 影像寬度, 影像高度)
  image(video, 0, 0, 640, 480);
  pop(); // 恢復舊的畫圖狀態(避免文字也被翻轉)
}

function guiSlider(minVal, maxVal, sz, step) {
  sz = (sz === undefined) ? 640:sz;
  step = (step === undefined) ? 1:step;
  // 建立滑軌(最小值,最大值,間距)
  slider = createSlider(minVal, maxVal, (minVal + maxVal) / 2, step);
  slider.style("width", sz + "px");
  return slider;
}

let btnP = null;
function guiButton(lab, fun, sz) {
  sz = (sz === undefined) ? 20:sz;
  let btn = createButton(lab);
  btn.size(100, 50);
  btn.style("font-size", sz + "px");
  if (!btnP) btnP = createP();
  btnP.child(btn);
  btn.mousePressed(fun);
  return btn;
}

function guiText(txt, sz) {
  sz = (sz === undefined) ? 24:sz;

  // 創建 文字
  let p = createP(txt);
  p.style("font-size", sz + "px");
  return p;
}

let snapshotBars = {
  bars: [],
  addBar: (y, r, g, b, w, h) => {
    snapshotBars.bars.push({
      y: y,
      w: w,
      h: h,
      count: 0,
    }); // w, h, count
    fill(r, g, b);
    rect(0, y, width, h * 2, 5);
    return snapshotBars.bars.length - 1;
  },
  count: (n) => {
    return snapshotBars.bars[n].count;
  },
  addSnapshot: (img, n) => {
    y = snapshotBars.bars[n].y;
    w = snapshotBars.bars[n].w;
    h = snapshotBars.bars[n].h;
    count = snapshotBars.bars[n].count;
    let nSnaps = int(width / w); // 每列縮圖數
    let row = int(count / nSnaps) % 2;
    let col = count % nSnaps;
    image(img, col * w, y + row * h, w, h);
    snapshotBars.bars[n].count++;
  },
};
