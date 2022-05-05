
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
    result = switchDisplay(flipImage(pixels))
    if(previousPixel == null){
      previousPixel = flipImage(tempCtx.getImageData(0, 0, settings.width, settings.height));
    }
    


    secondCtx.putImageData(result, 0, 0);
    
    tempCtx.drawImage(img,0,0,videoWidth,videoHeight);
    tempImageData = tempCtx.getImageData(0,0,videoWidth,videoHeight);

    
    timeDisplayed++;
    console.log(timeDisplayed);
    

    
  
    ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
      offsetX, offsetY, scale * videoWidth, scale * videoHeight);
    

    ctx.font = '50px serif';
    ctx.fillStyle = "white";
    ctx.fillText(currentDisplay, (canvas.width-proposedScaleX)/2,  canvas.height-10);
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
 * @returns a image data that consisted of the altered image data
 */
function switchDisplay(pixels) {

  let tempResult;
  switch(currentDisplay)
  {
    case "Mirror":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Continuous Hue Change";
        timeDisplayed = 0;
      }
      tempResult = mirror(pixels);
      break;
    case "Continuous Hue Change":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Pixelated Wave";
        timeDisplayed = 0;
      }
      if(hueValue == 360)
      {
        hueValue = 1;
      }
      else
      {
        hueValue++;
      }
        tempResult = changeHue(pixels, hueValue);
      break;
    case "Pixelated Wave":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Spiral";
        timeDisplayed = 0;
      }
      tempResult = wave(pixelate(pixels, 6));
      break;
    case "Spiral":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Continuous Pixelation";
        timeDisplayed = 0;
      }
      tempResult = spiral(pixels);
      break;
    case "Continuous Pixelation":
      if(timeDisplayed >= 1000)
      {
        currentDisplay = "Moving Rectangle";
        timeDisplayed = 0;
      }
      tempResult = continuousPixelation(pixels);
      break;
    case "Moving Rectangle":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Mirror Wave";
        timeDisplayed = 0;
      }
      tempResult = movingRectangle(pixels, 200, 200);
      break;
    case "Mirror Wave":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Underwater";
        timeDisplayed = 0;
        img.src = "underwater.jpg";
      }
      tempResult = wave(mirror(pixels));
      break;
    case "Underwater":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Pixelated Spiral";
        timeDisplayed = 0;
      }
      tempResult = backgroundRemoval(increaseColor(pixels, 0, 0, 50));
      break;
    case "Pixelated Spiral":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Background Removal";
        timeDisplayed = 0;
        img.src = "background.jpg";
      }
      tempResult = spiral(pixelate(pixels, 6));
      break;
    case "Background Removal":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Four Corners";
        timeDisplayed = 0;
      }
      tempResult = backgroundRemoval(pixels);
      break;
    case "Four Corners":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Mirror Spiral";
        timeDisplayed = 0;
      }
      tempResult =display4images(pixels);
      break;
    case "Mirror Spiral":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Volcano";
        timeDisplayed = 0;
        img.src = "volcano.jpg";
      }
      tempResult = mirror(spiral(pixels));
      break;
    case "Volcano":
      if(timeDisplayed >= 500)
      {
        timeDisplayed = 0;
        window.location.href = window.location.href;
      }
      tempResult = backgroundRemoval(increaseColor(pixels, 40, 0, 0));
      break;
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
 * Method utilized to alter the pixel in order to create a background effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @returns a image data that consisted of the altered image data
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
      if (difference >= 300) {
        if (minX > x) {
          minX = x
        }
        if (maxX < x) {
          maxX = x
        }
      }
    }
   
    
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
  if(frameCounter >= 175)
  {
    previousPixel = flipImage(tempCtx.getImageData(0, 0, settings.width, settings.height));
    frameCounter = 0;
  }
  else
  {
    frameCounter++;
  }
  return pixels
}

/**
 * Method that alters the color hue of the given image with pixelation and hue alternation
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @param {int} scaleFactor the int that represents how much will be max pixels to be scaled
 * @param {int} hue the amount (in degrees) to change the hue
 * @returns a image data that consisted of the altered image data
 */
function pixelatedHue(pixels, scaleFactor, hue){
  let pixelatedImage = pixelate(pixels, scaleFactor)
  if (hueValue == 360)
  {
    hueValue = 1;
  }
  else
  {
    hueValue++;
  }
  return changeHue(pixelatedImage, hue);
}

/**
 * Method that alters the image by executing a continous different degress of pixelation
 * @param {ImageData} pixels the origin image data
 * @param {ImageData} tempResult the image data where the altered pixels is stored
 * @returns a image data that consisted of the altered image data
 */
function continuousPixelation(pixels, tempResult){
  if(pixelation >= 30)
        shrink = true
      else if(pixelation <= 1){
        if(pixelation < 1)
          pixelation = 1
        shrink = false
      }
        
      tempResult = pixelate(pixels, pixelation)
      if(!shrink && frameCounter == 6){
        pixelation+=1
        frameCounter = 0
      }
      else if( !shrink && frameCounter < 6)
        frameCounter++
      else if(shrink && frameCounter == 6){
        pixelation-=1
        frameCounter = 0
      }
      else{
        frameCounter++
      }
  return tempResult

}



/**
 * Method that alters the image with pixelation and wave alternation
 * @param {ImageData} pixels the original pixel data
 * @param {int} scaleFactor the factor where the pixel is scaled by
 * @returns a image data that consisted of the altered pixel image
 */
function pixelatedWave(pixels, scaleFactor){
  let pixelatedImage = pixelate(pixels, scaleFactor)
  return wave(pixelatedImage)
}

/**
 * Method that alters the image with mirror and wave alternation
 * @param {ImageData} pixels the original pixel data
 * @returns a image data that consisted of the altered pixel image
 */
 function mirrorWave(pixels){
  let mirroredImage = mirror(pixels)
  return wave(mirroredImage)
}


/**
 * Method that alters the image with continous pixelation and mirror alternation
 * @param {ImageData} pixels the original pixel data
 * @returns a image data that consisted of the altered pixel image
 */
 function mirrorContinousPixelation(pixels, tempResult){
  let mirroredImage = mirror(pixels)
  return countinousPixelation(mirroredImage, tempResult)
}


/**
 * Method that alters the image with background removal and mirror alternation
 * @param {ImageData} pixels the original pixel data
 * @returns a image data that consisted of the altered pixel image
 */
 function backgroundRemovalMirrorWithSpiral(pixels){
  let backgroundRemoved = backgroundRemoval(pixels);
  backgroundRemoved =  mirror(backgroundRemoved)
  return spiral(backgroundRemoved);
}



/**
 * Method that alters the image with pixelation Mirror,and Spiral alternation
 * @param {ImageData} pixels the original pixel data
 * @param {int} scaleFactor the factor where the pixel is scaled by
 * @returns a image data that consisted of the altered pixel image
 */
 function pixelatedSpiralWithMirror(pixels, scaleFactor){
  let pixelatedImage = pixelate(pixels, scaleFactor);
  pixelatedImage = spiral(pixelatedImage)
  return mirror(pixelatedImage)
}



/**
 * Method that alters the image with spliting the image into 4 identical portion and each with different color
 * @param {ImageData} pixels the original pixel data
 * @returns a image data that consisted of the altered pixel image
 */
function display4images(pixels) {
  var transformedImageData = secondCtx.createImageData(videoWidth, videoHeight);
  for (let y = 0; y < videoHeight / 2  ; y ++ ) {
    for (let x = 0; x < videoWidth / 2  ; x ++ ) {
      let pixelIndex = (videoWidth * y + x)* 4; //pixel index
      let originIndex = pixelIndex * 2
      let originIndex2 = originIndex + videoWidth * 4

      let rAvg = (pixels.data[originIndex] + pixels.data[originIndex + 4] + pixels.data[originIndex2] + pixels.data[originIndex2 + 4])/4
      let gAvg =( pixels.data[originIndex + 1] + pixels.data[originIndex + 5] + pixels.data[originIndex2 + 1] + pixels.data[originIndex2 + 5])/4
      let bAvg = (pixels.data[originIndex + 2] + pixels.data[originIndex + 6] + pixels.data[originIndex2 + 2] + pixels.data[originIndex2 + 6])/4
      let aAvg = (pixels.data[originIndex + 3] + pixels.data[originIndex + 7] + pixels.data[originIndex2 + 3] + pixels.data[originIndex2 + 7])/4



      transformedImageData.data[pixelIndex] = rAvg;
      transformedImageData.data[pixelIndex + 1] = gAvg;
      transformedImageData.data[pixelIndex + 2] = bAvg;
      transformedImageData.data[pixelIndex + 3] = aAvg;

      let picture2Index = pixelIndex + 2 * videoWidth;
      transformedImageData.data[picture2Index] = 0;
      transformedImageData.data[picture2Index + 1] = gAvg;
      transformedImageData.data[picture2Index + 2] = bAvg;
      transformedImageData.data[picture2Index + 3] = aAvg;

      let picture3Index = pixelIndex + 2 * videoWidth * videoHeight;
      transformedImageData.data[picture3Index] = rAvg;
      transformedImageData.data[picture3Index + 1] = 0;
      transformedImageData.data[picture3Index + 2] = bAvg;
      transformedImageData.data[picture3Index + 3] = aAvg;

      let picture4Index = pixelIndex + 2 * videoWidth * videoHeight + 2 * videoWidth;
      transformedImageData.data[picture4Index] = rAvg;
      transformedImageData.data[picture4Index + 1] = gAvg;
      transformedImageData.data[picture4Index + 2] = 0;
      transformedImageData.data[picture4Index + 3] = aAvg;
    }
  }

  return transformedImageData

}

/**
 * Function that uses the drawRectangle function to create a moving rectangle that bounces off the side of the image
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @param {int} rectWidth the width in pixels of the drawn rectangle
 * @param {int} rectHeight the height in pixels of the drawn rectangle
 * @returns image data corresponding to the transformed image
 */
function movingRectangle(pixels, rectWidth, rectHeight)
{
  let tempResult = drawRectangle(pixels, rectWidth, rectHeight, currentX, currentY);

  //If the rectangle is moving in the positive x and y directions, we need to check if the bottom right corner is out of bounds
  if(xIncreasing == true && yIncreasing == true)
  {
    if(currentX + rectWidth >= videoWidth)
    {
      xIncreasing = false;
      currentX-=3;
    }
    else
    {
      currentX+=3;
    }

    if(currentY + rectHeight >= videoHeight)
    {
      yIncreasing = false;
      currentY-=3;
    }
    else
    {
      currentY+=3;
    }
  }
  //If the rectangle is moving in the positive x and negative y directions, we need to check if the top right corner is out of bounds
  else if(xIncreasing == true && yIncreasing == false)
  {
    if(currentX + rectWidth >= videoWidth)
    {
      xIncreasing = false;
      currentX-=3;
    }
    else
    {
      currentX+=3;
    }

    if(currentY <= 0)
    {
      yIncreasing = true;
      currentY+=3;
    }
    else
    {
      currentY-=3;
    }
  }
  //If the rectangle is moving in the negative x and positive y directions, we need to check if the bottom left corner is out of bounds
  else if(xIncreasing == false && yIncreasing == true)
  {
    if(currentX <= 0)
    {
      xIncreasing = true;
      currentX+=3;
    }
    else
    {
      currentX-=3;
    }

    if(currentY + rectHeight >= videoHeight)
    {
      yIncreasing = false;
      currentY-=3;
    }
    else
    {
      currentY+=3;
    }
  }
  //If the rectangle is moving in the negative x and y directions, we need to check if the top left corner is out of bounds
  else
  {
    if(currentX <= 0)
    {
      xIncreasing = true;
      currentX+=3;
    }
    else
    {
      currentX-=3;
    }

    if(currentY <= 0)
    {
      yIncreasing = true;
      currentY+=3;
    }
    else
    {
      currentY-=3;
    }
  }
  return tempResult;
}

/**
 * The video element that serves the purpose of receving the input through webcam
 **/
let video = document.createElement("video");
video.autoplay = true;

//Getting the camera
if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Something went wrong! " + error);
    });
}

window.addEventListener("keydown", function(event){
  timeDisplayed += 10000;
}, true);

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
let currentDisplay = "Mirror"

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


/**
 * A element used to store a temporay image data
 */
let tempImageData

/**
 * A boolean variable utilized to indicate whether the effect should increase or decrease pixelation
 */
let shrink

/**
 * A variable utilized to determined whether next level of pixelation should be applied
 */
let frameCounter = 0;

/**
 * A variable utilized to determine the rate of pixelation
 */
let pixelation = 1;

/**
 * A boolean variable used in the moving rectangle function that signifies if the x value of the rectangle is increasing
 */
let xIncreasing = true;

/**
 * A boolean variable used in the moving rectangle function that signifies if the y value of the rectangle is increasing
 */
let yIncreasing = true;

/**
 * A variable keeping track of the current x value for the upper left corner of the rectangle used in the moving rectangle function.
 */
let currentX = 0;

/**
 * A variable keeping track of the current y value for the upper left corner of the rectangle used in the moving rectangle function.
 */
let currentY = 0;

//Loading the background image as a global variable to pretend repetition
var img = new Image();
img.src="background.jpg";