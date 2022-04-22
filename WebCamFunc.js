
/**
 * Main method utilized to loop over the different effects
 */
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
    result =switchDisplay(pixels)
    if(previousPixel == null){
      previousPixel = tempCtx.getImageData(0, 0, settings.width, settings.height);
    }
    


    secondCtx.putImageData(result, 0, 0);
    
    tempCtx.drawImage(img,0,0,videoWidth,videoHeight);
    tempImageData = tempCtx.getImageData(0,0,videoWidth,videoHeight);

    timeDisplayed++;
    console.log(timeDisplayed);
    

    
  
    ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
      offsetX, offsetY, scale * videoWidth, scale * videoHeight);
     
  
    window.requestAnimationFrame(loop, canvas);

  }
  else {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
    window.requestAnimationFrame(loop, canvas);

  }
}

/**
 * Method utilize as a main router for which effect to be displayed in the next frame
 * @param {ImageData} pixels the image data that consist of the current frame that's displayed
 */
function switchDisplay(pixels) {

  let tempResult
  if (currentDisplay == "Gray Scale") {
    if (timeDisplayed < 500) {
      tempResult = displayGreyScreen(pixels)
    }
    else {
      currentDisplay = "Spiral"
      timeDisplayed = 0
    }
  }

  if (currentDisplay == "Spiral") {
    if (timeDisplayed < 500) {
      tempResult =displaySpiral(pixels)
    }
    else {
      currentDisplay = "Pixelate"
      timeDisplayed = 0
      window.requestAnimationFrame(loop, canvas);
    }
  }

  if (currentDisplay == "Pixelate") {
    if (timeDisplayed < 500) {
      tempResult =displayPixelate(pixels, 10)
    }
    else {
      currentDisplay = "UpsideDown"
      timeDisplayed = 0
      window.requestAnimationFrame(loop, canvas);
    }
  }

  if (currentDisplay == "UpsideDown") {
    if (timeDisplayed < 500) {
      tempResult =displayUpsideDown(pixels)
    }
    else {
      currentDisplay = "Wave"
      timeDisplayed = 0
      window.requestAnimationFrame(loop, canvas);
    }
  }
  if (currentDisplay == "Wave") {
    if (timeDisplayed < 500) {
      tempResult =displayWave(pixels)
    }
    else {
      currentDisplay = "BackgroundRemoval"
      timeDisplayed = 0
      window.requestAnimationFrame(loop, canvas);
    }
  }
  if (currentDisplay == "BackgroundRemoval") {
     if (timeDisplayed < 2000) {
      tempResult =backgroundRemoval(pixels)
     }
     else {
       currentDisplay = "HueChange"
       timeDisplayed = 0
       window.requestAnimationFrame(loop, canvas);
     }
  }
  if (currentDisplay == "HueChange") {
    if (timeDisplayed < 2000) {
      tempResult =changeHue(pixels, hueValue)
      if (hueValue == 360)
      {
        hueValue = 1;
      }
      else
      {
        hueValue++;
      }
    }
    else {
      currentDisplay = "Mirror"
      timeDisplayed = 0
      window.requestAnimationFrame(loop, canvas);
    }
 }
  if (currentDisplay == "Mirror") {
    if (timeDisplayed < 2000) {
      tempResult =displayMirror(pixels)
    }
    else {
      window.location.href = window.location.href
    }
 }

 return tempResult
}

/**
 * Method utilized to copy image data into another potentially blank image data object
 * @param {ImageData.data} srcPixels the source of the image data to be copied
 * @param {ImageData.data} dstPixels the destination where the copied image data will be stored
 * @param {int} width the maximum width of pixel to be copied
 * @param {int} height the maximum height of the pixel to be copied
 */
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

/**
 * Method utilized to alter the pixel in order to create a spiral effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 */
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
  return transformedImageData
}


/**
 * Method utilized to alter the pixel in order to create a wave effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 */
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
  return transformedImageData

}

/**
 * Method utilized to alter the pixel in order to create a upside down effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 */
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

  return transformedImageData

}


/**
 * Method utilized to alter the pixel in order to create a pixelate effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @param {int} scaleFactor the int that represents how much will be max pixels to be scaled
 */
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

  return transformedImageData

}

/**
 * Method utilized to alter the pixel in order to create a grey effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 */
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
  return pixels

}

/**
 * Method utilized to alter the pixel in order to create a background effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 */
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

    /*for (let x = 0; x < videoWidth; x++) {
      let pixelIndex = videoWidth * 4 * y + x * 4;
      if (x <= minX || x >= maxX) {
        pixels.data[pixelIndex] = 0
        pixels.data[pixelIndex + 1] = 0
        pixels.data[pixelIndex + 2] = 0
        pixels.data[pixelIndex + 3] = 0
      }
    }*/
    
    

    for (let x = 0; x < videoWidth; x++) {
      let pixelIndex = videoWidth * 4 * y + x * 4;
      if (x <= minX || x >= maxX) {
        pixels.data[pixelIndex] = tempImageData.data[pixelIndex]
        pixels.data[pixelIndex + 1] = tempImageData.data[pixelIndex + 1]
        pixels.data[pixelIndex + 2] = tempImageData.data[pixelIndex + 2]
        pixels.data[pixelIndex + 3] = tempImageData.data[pixelIndex + 3]
      }
    }

  }
  return pixels
}

/**
 * Method utilized to alter the pixel in order to create a mirror effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 */
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

  return transformedImageData

}
/**
 * Method that alters the color hue of the given image
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @param {int} hue the amount (in degrees) to change the hue
 */
function changeHue(pixels, hue)
{
  for (let y = 0; y < videoHeight; y++) {
    for (let x = 0; x < videoWidth; x++) {
      let pixelIndex = videoWidth * 4 * y + x * 4;

      let r = pixels.data[pixelIndex];
      let g = pixels.data[pixelIndex + 1];
      let b = pixels.data[pixelIndex + 2];

      let u = Math.cos(hue * Math.PI / 180);
      let w = Math.sin(hue * Math.PI / 180);

      let newR = (0.299 + 0.701 * u + 0.168 * w) * r + (0.587 - 0.587 * u + 0.330 * w) * g + (0.114 - 0.114 * u - 0.497 * w) * b;
      
      let newG = (0.299 - 0.299 * u - 0.328 * w) * r + (0.587 + 0.413 * u + 0.035 * w) * g + (0.114 - 0.114 * u + 0.292 * w) * b;

      let newB = (0.299 - 0.3 * u + 1.25 * w) * r + (0.587 - 0.588 * u - 1.05 * w) * g + (0.114 + 0.886 * u - 0.203 * w) * b;

      //Update the pixel data
      pixels.data[pixelIndex] = newR;
      pixels.data[pixelIndex + 1] = newG;
      pixels.data[pixelIndex + 2] = newB;

    }
  }
  secondCtx.putImageData(pixels, 0, 0);
  timeDisplayed++;
  console.log(timeDisplayed)

  ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
    offsetX, offsetY, scale * videoWidth, scale * videoHeight);

  window.requestAnimationFrame(loop, canvas);
}

/**
 * The video element that serves the purpose of receving the input through webcam
 **/
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

/**
 * Global variable to keep track of the current hue change value. This variable is used to produce the rainbow effect.
 */
let hueValue = 1;

/**
 * The canvas element that serves the purpose of controlling the canvas declared within the html
 **/
let canvas = document.querySelector("#canvas")

/**
 * The contex element that serves the purpose of controlling the canvas declared within the html
 **/
let ctx = canvas.getContext("2d");


window.requestAnimationFrame(loop, canvas);

/**
 * Track element that represent the video source from the video element
 */
let track = null;

/**
 * The settings that's contain within the video element
 */
let settings = null;

/**
 * A temporary canvas where the each unalternative frame will be store and drawn
 */
let tempCanvas = document.createElement("canvas");

/**
 * A temporary context that belongs to the temporary canvas
 */
let tempCtx = tempCanvas.getContext("2d");


/**
 * A canvas element where the alternative image will be drawn into
 */
let secondCanvas = document.createElement("canvas");

/**
 * A context element where the alternative image will be drawn into
 */
let secondCtx = secondCanvas.getContext("2d");


/**
 * The element that represents which effect will be utilize
 */
let currentDisplay = "Gray Scale"

/**
 * A small timer element that represent the time that each effect has been displayed for
 */
let timeDisplayed = 0

/**
 * A scale element that represent how the image will be scaled in the X axis
 */
let proposedScaleX

/**
 * A scale element that represent how the image will be scaled in the Y axis
 */
let proposedScaleY

/**
 * A offset element that represent the amount of offset on the X axis
 */
let offsetX


/**
 * A offset element that represent the amount of offset on the Y axis
 */
let offsetY


/**
 * The element that represents the final scale amount
 */
let scale

/**
 * Element that stored the video height
 */
let videoHeight

/**
 * Element that stored the video width
 */
let videoWidth

/**
 * An element that consist of the image data of the previous frame
 */
let previousPixel

/**
 * A variable to store the current modified pixel to be displayed onto the canvas
 */
let result

let tempImageData

var img = new Image();
img.src="money.jpg";