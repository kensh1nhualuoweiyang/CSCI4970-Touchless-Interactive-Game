/**
 * Method utilized to alter the pixel in order to create a spiral effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @returns image data that consists of the altered image data
 */
 function spiral(pixels) {
    var x, y, width, height, size, radius, centerX, centerY, sourcePosition, destPosition;
    pixelsCopy = new Array(pixels.length);
    copyArray(pixels, pixelsCopy);

    var r, alpha;
    var newX, newY;
    var degrees;
    width = videoWidth;
    height = videoHeight;
  
    centerX = Math.floor(width / 2);
    centerY = Math.floor(height / 2);
    size = width < height ? width : height;
    radius = Math.floor(size / 2);
  
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
  
          pixels[destPosition + 0] = pixelsCopy[sourcePosition + 0];
          pixels[destPosition + 1] = pixelsCopy[sourcePosition + 1];
          pixels[destPosition + 2] = pixelsCopy[sourcePosition + 2];
          pixels[destPosition + 3] = pixelsCopy[sourcePosition + 3];
        }
      }
    }
}

/**
 * Method utilized to alter the pixel in order to create a wave effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @returns image data that consists of the altered image data
 */
function wave(pixels) {
    const pixelsCopy = new Array(pixels.length);
    copyArray(pixels, pixelsCopy);

    //Variable to determine how many pixels to shift and the direction to shift
    var amt = 18
    var increase = false
    var count = 0
    for (let y = 0; y < videoHeight; y++) {
      for (let x = 0; x < videoWidth; x++) {
        //Getting pixel Index
        let pixelIndex = videoWidth * 4 * y + x * 4;
  
        let targetPixelIndex;
  
  
        if (x + amt >= videoWidth) {
          targetPixelIndex = videoWidth * 4 * y + videoWidth * 4
        }
        else {
          targetPixelIndex = videoWidth * 4 * y + (x + amt) * 4;
        }
  
        //Mapping
        pixels[targetPixelIndex] = pixelsCopy[pixelIndex];
        pixels[targetPixelIndex + 1] = pixelsCopy[pixelIndex + 1];
        pixels[targetPixelIndex + 2] = pixelsCopy[pixelIndex + 2];
        pixels[targetPixelIndex + 3] = pixelsCopy[pixelIndex + 3];
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
}

/**
 * Method utilized to alter the pixel in order to create a upside down effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @returns image data that consists of the altered image data
 */
function upsideDown(pixels) {
    var transformedImageData = secondCtx.createImageData(videoWidth, videoHeight);
    const pixelsCopy = new Array(pixels.length);
  
    for (let y = 0; y < videoHeight; y++) {
      for (let x = 0; x < videoWidth; x++) {
        let pixelIndex = videoWidth * 4 * y + x * 4;
        let targetPixelIndex = videoWidth * 4 * (videoHeight - 1 - y) + x * 4;
  
        pixels[targetPixelIndex] = pixelsCopy[pixelIndex];
        pixels[targetPixelIndex + 1] = pixelsCopy[pixelIndex + 1];
        pixels[targetPixelIndex + 2] = pixelsCopy[pixelIndex + 2];
        pixels[targetPixelIndex + 3] = pixelsCopy[pixelIndex + 3];
      }
    }
}

/**
 * Method utilized to alter the pixel in order to create a pixelate effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @param {int} scaleFactor the int that represents how much will be max pixels to be scaled
 * @returns image data that consists of the altered image data
 */
 function pixelate(pixels, scaleFactor) {
    const pixelsCopy = new Array(pixels.length);
    copyArray(pixels, pixelsCopy);
  
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
  
            totalR += pixelsCopy[pixelIndex];
            totalG += pixelsCopy[pixelIndex + 1];
            totalB += pixelsCopy[pixelIndex + 2];
            totalA += pixelsCopy[pixelIndex + 3];
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
  
            pixels[pixelIndex] = averageR;
            pixels[pixelIndex + 1] = averageG;
            pixels[pixelIndex + 2] = averageB;
            pixels[pixelIndex + 3] = averageA;
          }
        }
      }
    }
}

/**
 * Method utilized to alter the pixel in order to create a grey effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @returns a image data that consisted of the altered image data
 */
 function greyScale(pixels) {
    for (let y = 0; y < videoHeight; y++) {
      for (let x = 0; x < videoWidth; x++) {
        //The data is linear, get the x,y coordinate
        //We mulitply by 4 since it is stored as rgba
        let pixelIndex = videoWidth * 4 * y + x * 4;
  
        //Convert to grayscale on half the image
  
        let r = pixels[pixelIndex];
        let g = pixels[pixelIndex + 1];
        let b = pixels[pixelIndex + 2];
  
        //Trivial grayscale conversion using the red channel
        g = r;
        b = r;
  
        //Update the pixel data
        pixels[pixelIndex] = r;
        pixels[pixelIndex + 1] = g;
        pixels[pixelIndex + 2] = b;
  
      }
    }
}

/**
 * Method utilized to alter the pixel in order to create a mirror effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @returns image data that consists of the altered image data
 */
 function mirror(pixels) {
    for (let y = 0; y < videoHeight; y++) {
      for (let x = 0; x < videoWidth / 2; x++) {
        let pixelIndex = videoWidth * 4 * y + x * 4;
        let targetPixelIndex = videoWidth * 4 * y + (videoWidth - x - 1) * 4;
        
        pixels[targetPixelIndex] = pixels[pixelIndex];
        pixels[targetPixelIndex + 1] = pixels[pixelIndex + 1];
        pixels[targetPixelIndex + 2] = pixels[pixelIndex + 2];
        pixels[targetPixelIndex + 3] = pixels[pixelIndex + 3];
      }
    }
}

/**
 * Method that alters the color hue of the given image
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @param {int} hue the amount (in degrees) to change the hue
 * @returns image data that consists of the altered image data
 */
 function changeHue(pixels, hue)
 {
   for (let y = 0; y < videoHeight; y++) {
     for (let x = 0; x < videoWidth; x++) {
       let pixelIndex = videoWidth * 4 * y + x * 4;
 
       let r = pixels[pixelIndex];
       let g = pixels[pixelIndex + 1];
       let b = pixels[pixelIndex + 2];
 
       let u = Math.cos(hue * Math.PI / 180);
       let w = Math.sin(hue * Math.PI / 180);
 
       let newR = (0.299 + 0.701 * u + 0.168 * w) * r + (0.587 - 0.587 * u + 0.330 * w) * g + (0.114 - 0.114 * u - 0.497 * w) * b;
       
       let newG = (0.299 - 0.299 * u - 0.328 * w) * r + (0.587 + 0.413 * u + 0.035 * w) * g + (0.114 - 0.114 * u + 0.292 * w) * b;
 
       let newB = (0.299 - 0.3 * u + 1.25 * w) * r + (0.587 - 0.588 * u - 1.05 * w) * g + (0.114 + 0.886 * u - 0.203 * w) * b;
 
       //Update the pixel data
       pixels[pixelIndex] = newR;
       pixels[pixelIndex + 1] = newG;
       pixels[pixelIndex + 2] = newB;
 
     }
   }
   return pixels
}

/**
 * Function that draws a rectangle of given dimensions to the screen at given coordinates
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @param {int} rectWidth width in pixels of rectangle to draw
 * @param {int} rectHeight height in pixels of rectangle to draw
 * @param {int} posX x coordinate of top left corner of rectangle
 * @param {int} posY y coordinate of top left corner of rectangle
 * @returns image data that consists of the altered image data
 */
function drawRectangle(pixels, rectWidth, rectHeight, posX, posY)
{
  let pixelIndex;
  //Draw the top and bottom borders of the rectangle
  for(let x = posX; x < posX + rectWidth; x++)
  {
    pixelIndex = videoWidth * posY * 4 + x * 4;

    pixels[pixelIndex] = 0;
    pixels[pixelIndex + 1] = 0;
    pixels[pixelIndex + 2] = 0;

    pixelIndex = videoWidth * (posY + rectHeight - 1) * 4 + x * 4;

    pixels[pixelIndex] = 0;
    pixels[pixelIndex + 1] = 0;
    pixels[pixelIndex + 2] = 0;
  }

  //Draw the left and right borders of the rectangle
  for(let y = posY; y < posY + rectHeight; y++)
  {
    pixelIndex = videoWidth * y * 4 + posX * 4;

    pixels[pixelIndex] = 0;
    pixels[pixelIndex + 1] = 0;
    pixels[pixelIndex + 2] = 0;

    pixelIndex = videoWidth * y * 4 + (posX + rectWidth - 1) * 4;

    pixels[pixelIndex] = 0;
    pixels[pixelIndex + 1] = 0;
    pixels[pixelIndex + 2] = 0;
  }

  return pixels;
}

/**
 * Function to vertically flip the image.
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @returns image data that consists of the altered image data
 */
function flipImage(pixels)
{
  const pixelsCopy = new Array(pixels.length);
  copyArray(pixels, pixelsCopy);
  let pixelIndex;
  let targetPixelIndex;
  for(let y = 0; y < videoHeight; y++)
  {
    for(let x = 0; x < videoWidth; x++)
    {
      pixelIndex = videoWidth * y * 4 + x * 4;
      targetPixelIndex = videoWidth * y * 4 + (videoWidth - x - 1) * 4;

      pixels[targetPixelIndex] = pixelsCopy[pixelIndex];
      pixels[targetPixelIndex + 1] = pixelsCopy[pixelIndex + 1];
      pixels[targetPixelIndex + 2] = pixelsCopy[pixelIndex + 2];
      pixels[targetPixelIndex + 3] = pixelsCopy[pixelIndex + 3];
    }
  }
}

/**
 * Function that increases (or decreases) the rgb values of the image
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @param {int} red amount to change the r values by
 * @param {int} green amount to change the g values by
 * @param {int} blue amount to change the b values by
 * @returns image data that consists of the altered image data
 */
function increaseColor(pixels, red, green, blue)
{
  for(let y = 0; y < videoHeight; y++)
  {
    for(let x = 0; x < videoWidth; x++)
    {
      pixelIndex = videoWidth * y * 4 + x * 4;
      
      if(pixels[pixelIndex] + red < 255)
      {
        pixels[pixelIndex] += red;
      }
      else
      {
        pixels[pixelIndex] = 255;
      }

      if(pixels[pixelIndex + 1] + green < 255)
      {
        pixels[pixelIndex + 1] += green;
      }
      else
      {
        pixels[pixelIndex + 1] = 255;
      }

      if(pixels[pixelIndex + 2] + blue < 255)
      {
        pixels[pixelIndex + 2] += blue;
      }
      else
      {
        pixels[pixelIndex + 2] = 255;
      }
    }
  }
  return pixels;
}

module.exports = flipImage;