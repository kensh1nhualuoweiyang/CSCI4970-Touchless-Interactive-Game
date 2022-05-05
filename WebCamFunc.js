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
    flipImage(pixels.data, videoWidth, videoHeight);
    switchDisplay(pixels.data, videoWidth, videoHeight);
    if(previousPixel == null){
      previousPixel = tempCtx.getImageData(0, 0, settings.width, settings.height)
      flipImage(previousPixel.data, videoWidth, videoHeight);
    }

    secondCtx.putImageData(pixels, 0, 0);
    
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
 * @param {int[]} pixels the image data that consist of the current frame that's displayed
 * @param {int} videoWidth width in pixels of the image
 * @param {int} videoHeight height in pixels of the image
 * @returns void
 */
function switchDisplay(pixels, videoWidth, videoHeight) {

  switch(currentDisplay)
  {
    case "Mirror":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Continuous Hue Change";
        timeDisplayed = 0;
      }
      mirror(pixels, videoWidth, videoHeight);
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
        changeHue(pixels, videoWidth, videoHeight, hueValue);
      break;
    case "Pixelated Wave":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Spiral";
        timeDisplayed = 0;
      }
      pixelate(pixels, videoWidth, videoHeight, 6)
      wave(pixels, videoWidth, videoHeight);
      break;
    case "Spiral":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Continuous Pixelation";
        timeDisplayed = 0;
      }
      spiral(pixels, videoWidth, videoHeight);
      break;
    case "Continuous Pixelation":
      if(timeDisplayed >= 1000)
      {
        currentDisplay = "Moving Rectangle";
        timeDisplayed = 0;
      }
      continuousPixelation(pixels, videoWidth, videoHeight);
      break;
    case "Moving Rectangle":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Mirror Wave";
        timeDisplayed = 0;
      }
      movingRectangle(pixels, videoWidth, videoHeight, 200, 200);
      break;
    case "Mirror Wave":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Underwater";
        timeDisplayed = 0;
        img.src = "underwater.jpg";
        previousPixel = tempCtx.getImageData(0, 0, settings.width, settings.height)
        flipImage(previousPixel.data, videoWidth, videoHeight);
      }
      mirror(pixels, videoWidth, videoHeight);
      wave(pixels, videoWidth, videoHeight);
      break;
    case "Underwater":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Pixelated Spiral";
        timeDisplayed = 0;
      }
      increaseColor(pixels, videoWidth, videoHeight, 0, 0, 50);
      backgroundRemoval(pixels, videoWidth, videoHeight);
      break;
    case "Pixelated Spiral":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Background Removal";
        timeDisplayed = 0;
        img.src = "background.jpg";
      }
      pixelate(pixels, videoWidth, videoHeight, 6);
      spiral(pixels, videoWidth, videoHeight);
      break;
    case "Background Removal":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Four Corners";
        timeDisplayed = 0;
      }
      backgroundRemoval(pixels, videoWidth, videoHeight);
      break;
    case "Four Corners":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Mirror Spiral";
        timeDisplayed = 0;
      }
      display4images(pixels, videoWidth, videoHeight);
      break;
    case "Mirror Spiral":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Upside Down";
        timeDisplayed = 0;
      }
      spiral(pixels, videoWidth, videoHeight);
      mirror(pixels, videoWidth, videoHeight);
      break;
    case "Upside Down":
      if(timeDisplayed >= 500)
      {
        currentDisplay = "Volcano";
        timeDisplayed = 0;
        img.src = "volcano.jpg";
      }
      upsideDown(pixels, videoWidth, videoHeight);
      break;
    case "Volcano":
      if(timeDisplayed >= 500)
      {
        timeDisplayed = 0;
        window.location.href = window.location.href;
      }
      increaseColor(pixels, videoWidth, videoHeight, 40, 0, 0);
      backgroundRemoval(pixels, videoWidth, videoHeight);
      break;
  }
}

/**
 * Method utilized to alter the pixel in order to create a background effect based on the image data passed in
 * @param {int[]} pixels the image data that represents the current frame displayed
 * @param {int} videoWidth width in pixels of the image
 * @param {int} videoHeight height in pixels of the image
 * @returns void
 */
function backgroundRemoval(pixels, videoWidth, videoHeight) {
  let minX = videoWidth
  let maxX = 0
  
  for (let y = 0; y < videoHeight; y++) {
   
    for (let x = 0; x < videoWidth; x++) {

      let pixelIndex = videoWidth * 4 * y + x * 4;
      let previousR = previousPixel.data[pixelIndex]
      let previousG = previousPixel.data[pixelIndex + 1]
      let previousB = previousPixel.data[pixelIndex + 2]
      let previousA = previousPixel.data[pixelIndex + 3]
      let currentR = pixels[pixelIndex]
      let currentG = pixels[pixelIndex + 1]
      let currentB = pixels[pixelIndex + 2]
      let currentA = pixels[pixelIndex + 3]


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
        pixels[pixelIndex] = tempImageData.data[pixelIndex]
        pixels[pixelIndex + 1] = tempImageData.data[pixelIndex + 1]
        pixels[pixelIndex + 2] = tempImageData.data[pixelIndex + 2]
        pixels[pixelIndex + 3] = tempImageData.data[pixelIndex + 3]
      }
    }

  }
  if(frameCounter >= 175)
  {
    previousPixel = tempCtx.getImageData(0, 0, settings.width, settings.height)
    flipImage(previousPixel.data, videoWidth, videoHeight);
    frameCounter = 0;
  }
  else
  {
    frameCounter++;
  }
}

/**
 * Method that alters the image by executing a continous different degress of pixelation
 * @param {int[]} pixels the origin image data
 * @param {int} videoWidth width in pixels of the image
 * @param {int} videoHeight height in pixels of the image
 * @returns void
 */
function continuousPixelation(pixels, videoWidth, videoHeight){
  if(pixelation >= 30)
        shrink = true
      else if(pixelation <= 1){
        if(pixelation < 1)
          pixelation = 1
        shrink = false
      }
        
      pixelate(pixels, videoWidth, videoHeight, pixelation)
      if(!shrink && frameCounter == 4){
        pixelation+=1
        frameCounter = 0
      }
      else if( !shrink && frameCounter < 4)
        frameCounter++
      else if(shrink && frameCounter == 4){
        pixelation-=1
        frameCounter = 0
      }
      else{
        frameCounter++
      }
}

/**
 * Method that alters the image with spliting the image into 4 identical portion and each with different color
 * @param {int[]} pixels the original pixel data
 * @param {int} videoWidth width in pixels of the image
 * @param {int} videoHeight height in pixels of the image
 * @returns void
 */
function display4images(pixels, videoWidth, videoHeight) {
  const pixelsCopy = new Array(pixels.length);
  copyArray(pixels, pixelsCopy);
  for (let y = 0; y < videoHeight / 2  ; y ++ ) {
    for (let x = 0; x < videoWidth / 2  ; x ++ ) {
      let pixelIndex = (videoWidth * y + x)* 4; //pixel index
      let originIndex = pixelIndex * 2
      let originIndex2 = originIndex + videoWidth * 4

      let rAvg = (pixelsCopy[originIndex] + pixelsCopy[originIndex + 4] + pixelsCopy[originIndex2] + pixelsCopy[originIndex2 + 4])/4
      let gAvg =( pixelsCopy[originIndex + 1] + pixelsCopy[originIndex + 5] + pixelsCopy[originIndex2 + 1] + pixelsCopy[originIndex2 + 5])/4
      let bAvg = (pixelsCopy[originIndex + 2] + pixelsCopy[originIndex + 6] + pixelsCopy[originIndex2 + 2] + pixelsCopy[originIndex2 + 6])/4
      let aAvg = (pixelsCopy[originIndex + 3] + pixelsCopy[originIndex + 7] + pixelsCopy[originIndex2 + 3] + pixelsCopy[originIndex2 + 7])/4



      pixels[pixelIndex] = rAvg;
      pixels[pixelIndex + 1] = gAvg;
      pixels[pixelIndex + 2] = bAvg;
      pixels[pixelIndex + 3] = aAvg;

      let picture2Index = pixelIndex + 2 * videoWidth;
      pixels[picture2Index] = 0;
      pixels[picture2Index + 1] = gAvg;
      pixels[picture2Index + 2] = bAvg;
      pixels[picture2Index + 3] = aAvg;

      let picture3Index = pixelIndex + 2 * videoWidth * videoHeight;
      pixels[picture3Index] = rAvg;
      pixels[picture3Index + 1] = 0;
      pixels[picture3Index + 2] = bAvg;
      pixels[picture3Index + 3] = aAvg;

      let picture4Index = pixelIndex + 2 * videoWidth * videoHeight + 2 * videoWidth;
      pixels[picture4Index] = rAvg;
      pixels[picture4Index + 1] = gAvg;
      pixels[picture4Index + 2] = 0;
      pixels[picture4Index + 3] = aAvg;
    }
  }
}

/**
 * Function that uses the drawRectangle function to create a moving rectangle that bounces off the side of the image
 * @param {int[]} pixels the image data that represents the current frame displayed
 * @param {int} videoWidth width in pixels of the image
 * @param {int} videoHeight height in pixels of the image
 * @param {int} rectWidth the width in pixels of the drawn rectangle
 * @param {int} rectHeight the height in pixels of the drawn rectangle
 * @returns void
 */
function movingRectangle(pixels, videoWidth, videoHeight, rectWidth, rectHeight)
{
  drawRectangle(pixels, videoWidth, videoHeight, rectWidth, rectHeight, currentX, currentY);

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