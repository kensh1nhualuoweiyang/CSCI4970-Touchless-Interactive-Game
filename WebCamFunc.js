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
function loop() {
  if (video.srcObject || track) {
    track = video.srcObject.getTracks()[0];
    settings = track.getSettings();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let videoWidth = settings.width;
    let videoHeight = settings.height;

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
    switchDisplay(pixels, videoHeight, videoWidth)


  }
  else {
    ctx.fillStyle = "magenta"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(loop, canvas);

  }
}


function switchDisplay(pixels, videoHeight, videoWidth) {

  if (currentDisplay == "Gray Scale") {
    if (timeDisplayed < 1000) {
      displaySpiral(pixels, videoHeight, videoWidth)
    }
    else {
      currentDisplay = "Spiral"
      timeDisplayed = 0
    }
  }

  if (currentDisplay == "Spiral") {
    if (timeDisplayed < 1000) {
      displaySpiral(pixels, videoHeight, videoWidth)
    }
    else {
      currentDisplay = "Gray Scale"
      timeDisplayed = 0
    }
  }
}

function displayBlackScreen(pixels, videoHeight, videoWidth) {
  for (let y = 0; y < videoHeight; y++) {
    for (let x = 0; x < videoWidth; x++) {
      let pixelIndex = videoWidth * 4 * y + x * 4;
      pixels.data[pixelIndex] = 0
      pixels.data[pixelIndex + 1] = 0
      pixels.data[pixelIndex + 2] = 0
    }
  }
  secondCtx.putImageData(pixels, 0, 0);
  timeDisplayed++;
  console.log(timeDisplayed)

  ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
    offsetX, offsetY, scale * videoWidth, scale * videoHeight);

  window.requestAnimationFrame(loop, canvas);
}
function copyImageData(srcPixels, dstPixels, width, height) {
  var x, y, position;
  for (y = 0; y < height; ++y) {
    for (x = 0; x < width; ++x) {
      position = y * width + x;
      position *= 4;
      dstPixels[position + 0] = srcPixels[position + 0];
      dstPixels[position + 1] = srcPixels[position + 1];
      dstPixels[position + 2] = srcPixels[position + 2];
      dstPixels[position + 3] = srcPixels[position + 3];
    }
  }
}

function displaySpiral(pixels, videoHeight, videoWidth) {
  var x, y, width, height, size, radius, centerX, centerY, sourcePosition, destPosition;
  var transformedImageData = secondCtx.createImageData(videoWidth, videoHeight);
  var originalPixels = pixels.data;
  var transformedPixels = transformedImageData.data;
  var r, alpha, angle;
  var newX, newY;
  var degrees;
  width = pixels.width;
  height = pixels.height;

  centerX = Math.floor(width / 2);
  centerY = Math.floor(height / 2);
  size = width < height ? width : height;
  radius = Math.floor(size / 2);

  copyImageData(originalPixels, transformedPixels, width, height);
  secondCtx.putImageData(transformedImageData, 0, 0)
  for (y = -radius; y < radius; ++y) {
    for (x = -radius; x < radius; ++x) {
      // Check if the pixel is inside the effect circle
      if (x * x + y * y <= radius * radius) {
        // Calculate the pixel array position
        destPosition = (y + centerY) * width + x + centerX;
        destPosition *= 4;

        // Transform the pixel cartesian coordinates (x, y) to polar coordinates (r, alpha)
        r = Math.sqrt(x * x + y * y);
        alpha = Math.atan2(y, x);

        // Remember that the angle alpha is in radians, transform it to degrees 
        degrees = (alpha * 180.0) / Math.PI;

        // Shift the angle by a constant delta
        // Note the '-' sign was changed by '+' the inverted function
        degrees += 1 * r;

        // Transform back from polar coordinates to cartesian 
        alpha = (degrees * Math.PI) / 180.0;
        newY = Math.floor(r * Math.sin(alpha));
        newX = Math.floor(r * Math.cos(alpha));

        // Get the new pixel location 
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




function displayGreyScreen(pixels, videoHeight, videoWidth) {
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