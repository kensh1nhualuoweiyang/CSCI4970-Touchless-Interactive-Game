/**
 * Method utilized to alter the pixel in order to create a spiral effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @returns a image data that consisted of the altered image data
 */
 function spiral(pixels) {
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
 * @returns a image data that consisted of the altered image data
 */
function wave(pixels) {
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
 * @returns a image data that consisted of the altered image data
 */
function upsideDown(pixels) {
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
 * @returns a image data that consisted of the altered image data
 */
 function pixelate(pixels, scaleFactor) {
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
 * @returns a image data that consisted of the altered image data
 */
 function greyScale(pixels) {
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
 * Method utilized to alter the pixel in order to create a mirror effect based on the image data passed in
 * @param {ImageData} pixels the image data that represents the current frame displayed
 * @returns a image data that consisted of the altered image data
 */
 function mirror(pixels) {
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
 * @returns a image data that consisted of the altered image data
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
   return pixels
}

function drawRectangle(pixels, rectWidth, rectHeight, posX, posY)
{
  let pixelIndex;
  //Draw the top and bottom borders of the rectangle
  for(let x = posX; x < posX + rectWidth; x++)
  {
    pixelIndex = videoWidth * posY * 4 + x * 4;

    pixels.data[pixelIndex] = 0;
    pixels.data[pixelIndex + 1] = 0;
    pixels.data[pixelIndex + 2] = 0;

    pixelIndex = videoWidth * (posY + rectHeight - 1) * 4 + x * 4;

    pixels.data[pixelIndex] = 0;
    pixels.data[pixelIndex + 1] = 0;
    pixels.data[pixelIndex + 2] = 0;
  }

  //Draw the left and right borders of the rectangle
  for(let y = posY; y < posY + rectHeight; y++)
  {
    pixelIndex = videoWidth * y * 4 + posX * 4;

    pixels.data[pixelIndex] = 0;
    pixels.data[pixelIndex + 1] = 0;
    pixels.data[pixelIndex + 2] = 0;

    pixelIndex = videoWidth * y * 4 + (posX + rectWidth - 1) * 4;

    pixels.data[pixelIndex] = 0;
    pixels.data[pixelIndex + 1] = 0;
    pixels.data[pixelIndex + 2] = 0;
  }

  return pixels;
}

function flipImage(pixels)
{
  var transformedImageData = secondCtx.createImageData(videoWidth, videoHeight);
  let pixelIndex;
  let targetPixelIndex;
  for(let y = 0; y < videoHeight; y++)
  {
    for(let x = 0; x < videoWidth; x++)
    {
      pixelIndex = videoWidth * y * 4 + x * 4;
      targetPixelIndex = videoWidth * y * 4 + (videoWidth - x - 1) * 4;

      transformedImageData.data[targetPixelIndex] = pixels.data[pixelIndex];
      transformedImageData.data[targetPixelIndex + 1] = pixels.data[pixelIndex + 1];
      transformedImageData.data[targetPixelIndex + 2] = pixels.data[pixelIndex + 2];
      transformedImageData.data[targetPixelIndex + 3] = pixels.data[pixelIndex + 3];
    }
  }
  return transformedImageData;
}