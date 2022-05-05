var flipImage = require('../TransformFunctions');
var assert = require('assert');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><body><div><canvas id = "canvas"></canvas></div></body>`);

describe('flipImage function', function()
{
    it('general use', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let newPixelIndex;
        let canvas = dom.window.document.createElement('canvas');
        let ctx = canvas.getContext("2d");
        let pixels = ctx.createImageData(videoWidth, videoHeight);
        let newPixels;
        for(x = 0; x < videoWidth; x++)
        {
            for(y = 0; y < videoHeight; y++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels.data[pixelIndex] = videoWidth * y + x;
            }
        }

        newPixels = flipImage(pixels);

        for(x = 0; x < videoWidth; x++)
        {
            for(y = 0; y < videoHeight; y++)
            {
                pixelIndex = 4 * videoWidth * y + (videoWidth - x - 1) * 4;
                newPixelIndex = 4 * videoWidth * y + 4 * x;
                assert.equal(newPixels.data[newPixelIndex], pixels.data[pixelIndex]);
            }
        }
    });
});