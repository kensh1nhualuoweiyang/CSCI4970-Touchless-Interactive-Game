let video = document.createElement("video");
video.autoplay = true;

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Something went wrong! " + error);
    });
}

let canvas = document.querySelector("#canvas")
let ctx = canvas.getContext("2d");
window.requestAnimationFrame(loop, canvas);
let track = null;
let settings = null;

let tempCanvas = document.createElement("canvas");
let tempCtx = tempCanvas.getContext("2d");

let secondCanvas = document.createElement("canvas");
let secondCtx = secondCanvas.getContext("2d");

let currentDisplay = "Gray Scale"
let timeDisplayed = 0

let proposedScaleX = null
let proposedScaleY = null

let offsetX = null
let offsetY = null

let scale = null

let videoHeight
let videoWidth

let previousPixel

let refresh = 0

let previousMinX = Number.MAX_SAFE_INTEGER
let previousMaxX = 0
let initial = true



function loop() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (video.srcObject || track) {
    track = video.srcObject.getTracks()[0];
    settings = track.getSettings();


    videoWidth = settings.width;
    videoHeight = settings.height;

    secondCanvas.width = videoWidth;
    secondCanvas.height = videoHeight;

    tempCanvas.width = videoWidth;
    tempCanvas.height = videoHeight;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let scaleX = 1;
    let scaleY = 1;
    proposedScaleX = window.innerWidth / settings.width;
    proposedScaleY = window.innerHeight / settings.height;
    scale = Math.min(proposedScaleX, proposedScaleY);



    offsetX = 0;
    offsetY = 0;



    if (scale != proposedScaleX) {
      offsetX = (proposedScaleX - scale) * videoWidth / 2
    }
    else {
      offsetY = (proposedScaleY - scale) * videoHeight / 2
    }

    tempCtx.drawImage(video, 0, 0, settings.width, settings.height);

    let pixels = tempCtx.getImageData(0, 0, settings.width, settings.height);
    switchDisplay(pixels)
    if(previousPixel == null){
      previousPixel = tempCtx.getImageData(0, 0, settings.width, settings.height);
      refresh = 0
    }
     
    refresh++

  }
  else {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
    window.requestAnimationFrame(loop, canvas);

  }
}

function switchDisplay(pixels) {

  if (currentDisplay == "Gray Scale") {
    if (timeDisplayed < 500) {
      displayGreyScreen(pixels)
    }
    else {
      currentDisplay = "Spiral"
      timeDisplayed = 0
    }
  }

  if (currentDisplay == "Spiral") {
    if (timeDisplayed < 500) {
      displaySpiral(pixels)
    }
    else {
      currentDisplay = "Pixelate"
      timeDisplayed = 0
      window.requestAnimationFrame(loop, canvas);
    }
  }

  if (currentDisplay == "Pixelate") {
    if (timeDisplayed < 500) {
      displayPixelate(pixels, 10)
    }
    else {
      currentDisplay = "UpsideDown"
      timeDisplayed = 0
      window.requestAnimationFrame(loop, canvas);
    }
  }

  if (currentDisplay == "UpsideDown") {
    if (timeDisplayed < 500) {
      displayUpsideDown(pixels)
    }
    else {
      currentDisplay = "Wave"
      timeDisplayed = 0
      window.requestAnimationFrame(loop, canvas);
    }
  }
  if (currentDisplay == "Wave") {
    if (timeDisplayed < 500) {
      displayWave(pixels)
    }
    else {
      currentDisplay = "BackgroundRemoval"
      timeDisplayed = 0
      window.requestAnimationFrame(loop, canvas);
    }
  }
  if (currentDisplay == "BackgroundRemoval") {
     if (timeDisplayed < 500) {
    backgroundRemoval(pixels)
     }
     else {
       currentDisplay = "Mirror"
       timeDisplayed = 0
       window.requestAnimationFrame(loop, canvas);
     }
  }
  if (currentDisplay == "Mirror") {
    if (timeDisplayed < 500) {
   displayMirror(pixels)
    }
    else {
      window.location.href = window.location.href
    }
 }
}

function copyImageData(srcPixels, dstPixels, width, height) {
  var x, y, position;
  for (y = 0; y < height; ++y) {
    for (x = 0; x < width; ++x) {
      position = y * width + x;
      position *= 4;
      dstPixels[position] = srcPixels[position];
      dstPixels[position + 1] = srcPixels[position + 1];
      dstPixels[position + 2] = srcPixels[position + 2];
      dstPixels[position + 3] = srcPixels[position + 3];
    }
  }
}

function displaySpiral(pixels) {
  var x, y, width, height, size, radius, centerX, centerY, sourcePosition, destPosition;
  var transformedImageData = secondCtx.createImageData(videoWidth, videoHeight);
  var originalPixels = pixels.data;
  var transformedPixels = transformedImageData.data;
  var r, alpha;
  var newX, newY;
  var degrees;
  width = pixels.width;
  height = pixels.height;

  centerX = Math.floor(width / 2);
  centerY = Math.floor(height / 2);
  size = width < height ? width : height;
  radius = Math.floor(size / 2);

  copyImageData(originalPixels, transformedPixels, width, height);
  for (y = -radius; y < radius; ++y) {
    for (x = -radius; x < radius; ++x) {

      if (x * x + y * y <= radius * radius) {

        destPosition = (y + centerY) * width + x + centerX;
        destPosition *= 4;

        r = Math.sqrt(x * x + y * y);
        alpha = Math.atan2(y, x);

        degrees = (alpha * 180.0) / Math.PI;

        degrees += 1.5 * r;

        alpha = (degrees * Math.PI) / 180.0;
        newY = Math.floor(r * Math.sin(alpha));
        newX = Math.floor(r * Math.cos(alpha));

        sourcePosition = (newY + centerY) * width + newX + centerX;
        sourcePosition *= 4;

        transformedPixels[destPosition + 0] = originalPixels[sourcePosition + 0];
        transformedPixels[destPosition + 1] = originalPixels[sourcePosition + 1];
        transformedPixels[destPosition + 2] = originalPixels[sourcePosition + 2];
        transformedPixels[destPosition + 3] = originalPixels[sourcePosition + 3];
      }
    }
  }
  secondCtx.putImageData(transformedImageData, 0, 0)


  timeDisplayed++;
  console.log(timeDisplayed)

  ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
    offsetX, offsetY, scale * videoWidth, scale * videoHeight);

  window.requestAnimationFrame(loop, canvas);
}


function displayWave(pixels) {
  var transformedImageData = secondCtx.createImageData(videoWidth, videoHeight);
  var originalPixels = pixels.data
  var transformedPixels = transformedImageData.data
  copyImageData(originalPixels, transformedPixels, pixels.width, pixels.height)
  //Variable to determine how many pixel to shift and the direction to shift
  var amt = 18
  var increase = false
  var count = 0
  for (let y = 0; y < videoHeight; y++) {
    for (let x = 0; x < videoWidth; x++) {
      //Getting pixel Index
      let pixelIndex = videoWidth * 4 * y + x * 4;

      let targetPixelIndex


      if (x + amt >= videoWidth) {
        targetPixelIndex = videoWidth * 4 * y + videoWidth * 4
      }
      else {
        targetPixelIndex = videoWidth * 4 * y + (x + amt) * 4;
      }

      //Mapping
      transformedImageData.data[targetPixelIndex] = pixels.data[pixelIndex];
      transformedImageData.data[targetPixelIndex + 1] = pixels.data[pixelIndex + 1];
      transformedImageData.data[targetPixelIndex + 2] = pixels.data[pixelIndex + 2];
      transformedImageData.data[targetPixelIndex + 3] = pixels.data[pixelIndex + 3];
    }

    if (count == 0) {
      if (!increase)
        amt -= 1
      else
        amt += 1
    }

    if (amt == 0 || amt == 18) {
      count++
      if (count == 5) {
        increase = !increase
        count = 0
      }
    }
  }
  previousPixel = tempCtx.getImageData(0, 0, settings.width, settings.height);
  secondCtx.putImageData(transformedImageData, 0, 0);
  timeDisplayed++;
  console.log(timeDisplayed)

  ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
    offsetX, offsetY, scale * videoWidth, scale * videoHeight);

  window.requestAnimationFrame(loop, canvas);

}

function displayUpsideDown(pixels) {
  var transformedImageData = secondCtx.createImageData(videoWidth, videoHeight);

  for (let y = 0; y < videoHeight; y++) {
    for (let x = 0; x < videoWidth; x++) {
      let pixelIndex = videoWidth * 4 * y + x * 4;
      let targetPixelIndex = videoWidth * 4 * (videoHeight - 1 - y) + x * 4;

      transformedImageData.data[targetPixelIndex] = pixels.data[pixelIndex];
      transformedImageData.data[targetPixelIndex + 1] = pixels.data[pixelIndex + 1];
      transformedImageData.data[targetPixelIndex + 2] = pixels.data[pixelIndex + 2];
      transformedImageData.data[targetPixelIndex + 3] = pixels.data[pixelIndex + 3];
    }
  }

  secondCtx.putImageData(transformedImageData, 0, 0);
  timeDisplayed++;
  console.log(timeDisplayed)

  ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
    offsetX, offsetY, scale * videoWidth, scale * videoHeight);

  window.requestAnimationFrame(loop, canvas);
}

function displayPixelate(pixels, scaleFactor) {
  var transformedImageData = secondCtx.createImageData(videoWidth, videoHeight);

  //Loop over all pixels in the image
  for (let y = 0; y < videoHeight; y += scaleFactor) {
    for (let x = 0; x < videoWidth; x += scaleFactor) {
      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      let totalA = 0;

      //Find the maximum x and y values in the case that the image does not divide into an even amount of 'new pixels'
      let maxY = Math.min((y + scaleFactor), videoHeight);
      let maxX = Math.min((x + scaleFactor), videoWidth);

      //Loop over all pixels in the next 'pixel zone' and get the average RGBA value
      for (let pixelY = y; pixelY < maxY; pixelY++) {
        for (let pixelX = x; pixelX < maxX; pixelX++) {
          let pixelIndex = videoWidth * 4 * pixelY + pixelX * 4;

          totalR += pixels.data[pixelIndex];
          totalG += pixels.data[pixelIndex + 1];
          totalB += pixels.data[pixelIndex + 2];
          totalA += pixels.data[pixelIndex + 3];
        }
      }
      let averageR = Math.round(totalR / ((maxY - y) * (maxX - x)));
      let averageG = Math.round(totalG / ((maxY - y) * (maxX - x)));
      let averageB = Math.round(totalB / ((maxY - y) * (maxX - x)));
      let averageA = Math.round(totalA / ((maxY - y) * (maxX - x)));

      //Set all the target pixels to the average RGBA values
      for (let pixelY = y; pixelY < maxY; pixelY++) {
        for (let pixelX = x; pixelX < maxX; pixelX++) {
          let pixelIndex = videoWidth * 4 * pixelY + pixelX * 4;

          transformedImageData.data[pixelIndex] = averageR;
          transformedImageData.data[pixelIndex + 1] = averageG;
          transformedImageData.data[pixelIndex + 2] = averageB;
          transformedImageData.data[pixelIndex + 3] = averageA;
        }
      }
    }
  }

  secondCtx.putImageData(transformedImageData, 0, 0);
  timeDisplayed++;
  console.log(timeDisplayed)

  ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
    offsetX, offsetY, scale * videoWidth, scale * videoHeight);

  window.requestAnimationFrame(loop, canvas);
}

function displayGreyScreen(pixels) {
  for (let y = 0; y < videoHeight; y++) {
    for (let x = 0; x < videoWidth; x++) {
      //The data is linear, get the x,y coordinate
      //We mulitply by 4 since it is stored as rgba
      let pixelIndex = videoWidth * 4 * y + x * 4;

      //Convert to grayscale on half the image

      let r = pixels.data[pixelIndex];
      let g = pixels.data[pixelIndex + 1];
      let b = pixels.data[pixelIndex + 2];

      //Trivial grayscale conversion using the red channel
      g = r;
      b = r;

      //Update the pixel data
      pixels.data[pixelIndex] = r;
      pixels.data[pixelIndex + 1] = g;
      pixels.data[pixelIndex + 2] = b;

    }
  }
  secondCtx.putImageData(pixels, 0, 0);
  timeDisplayed++;
  console.log(timeDisplayed)

  ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
    offsetX, offsetY, scale * videoWidth, scale * videoHeight);

  window.requestAnimationFrame(loop, canvas);
}

function backgroundRemoval(pixels) {
  let minX = videoWidth
  let maxX = 0
  
  for (let y = 0; y < videoHeight; y++) {
   
    for (let x = 0; x < videoWidth; x++) {

      let pixelIndex = videoWidth * 4 * y + x * 4;
      let previousR = previousPixel.data[pixelIndex]
      let previousG = previousPixel.data[pixelIndex + 1]
      let previousB = previousPixel.data[pixelIndex + 2]
      let previousA = previousPixel.data[pixelIndex + 3]
      let currentR = pixels.data[pixelIndex]
      let currentG = pixels.data[pixelIndex + 1]
      let currentB = pixels.data[pixelIndex + 2]
      let currentA = pixels.data[pixelIndex + 3]


      //Calculate the difference in pixel
      let difference = Math.abs(previousR - currentR) + Math.abs(previousA - currentA) + Math.abs(previousB - currentB) + Math.abs(previousG - currentG)



      //Determine the zone
      if (difference >= 200) {
        if (minX > x) {
          minX = x
        }
        if (maxX < x) {
          maxX = x
        }
      }
    }
   

    //If X is out side of the zone, change the rgb pixel to black
    for (let x = 0; x < videoWidth; x++) {
      let pixelIndex = videoWidth * 4 * y + x * 4;
      if (x <= minX || x >= maxX) {
        pixels.data[pixelIndex] = 0
        pixels.data[pixelIndex + 1] = 0
        pixels.data[pixelIndex + 2] = 0
        pixels.data[pixelIndex + 3] = 0
      }
    }

  }


  secondCtx.putImageData(pixels, 0, 0);
  timeDisplayed++;
  refresh++
  
  console.log(timeDisplayed)

  ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
    offsetX, offsetY, scale * videoWidth, scale * videoHeight);

  window.requestAnimationFrame(loop, canvas);

}

function displayMirror(pixels) {
  var transformedImageData = secondCtx.createImageData(videoWidth, videoHeight);
  for (let y = 0; y < videoHeight; y++) {
    for (let x = 0; x < videoWidth / 2; x++) {
      let pixelIndex = videoWidth * 4 * y + x * 4;
      let targetPixelIndex = videoWidth * 4 * y + (videoWidth - x - 1) * 4;

      transformedImageData.data[pixelIndex] = pixels.data[pixelIndex];
      transformedImageData.data[pixelIndex + 1] = pixels.data[pixelIndex + 1];
      transformedImageData.data[pixelIndex + 2] = pixels.data[pixelIndex + 2];
      transformedImageData.data[pixelIndex + 3] = pixels.data[pixelIndex + 3];
      
      transformedImageData.data[targetPixelIndex] = pixels.data[pixelIndex];
      transformedImageData.data[targetPixelIndex + 1] = pixels.data[pixelIndex + 1];
      transformedImageData.data[targetPixelIndex + 2] = pixels.data[pixelIndex + 2];
      transformedImageData.data[targetPixelIndex + 3] = pixels.data[pixelIndex + 3];
    }
  }

  secondCtx.putImageData(transformedImageData, 0, 0);
  timeDisplayed++;
  console.log(timeDisplayed)

  ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
    offsetX, offsetY, scale * videoWidth, scale * videoHeight);

  window.requestAnimationFrame(loop, canvas);
}
