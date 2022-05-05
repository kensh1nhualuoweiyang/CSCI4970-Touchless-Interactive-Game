var transFunct = require('../TransformFunctions');
var assert = require('assert');

describe('upsideDown function', function()
{
    it('Testing Normal upsideDown function', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixelCopyIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        let pixelsCopy = new Array(pixels.length);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.copyArray(pixels, pixelsCopy, videoWidth, videoHeight);
        transFunct.upsideDown(pixels, videoWidth, videoHeight);

        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * (videoHeight - y - 1) + x * 4;
                pixelCopyIndex = 4 * videoWidth * y + 4 * x;
                assert.equal(pixelsCopy[pixelCopyIndex], pixels[pixelIndex]);
            }
        } 
    });
});

describe('pixelate function', function()
{
    it('pixelate with value = 2', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixelCopyIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        let pixelsCopy = new Array(pixels.length);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.copyArray(pixels, pixelsCopy, videoWidth, videoHeight);
        transFunct.pixelate(pixels, videoWidth, videoHeight, 2);

        assert.equal(pixels[0], 2);
        assert.equal(pixels[4], 2);
        assert.equal(pixels[8], 4);

        assert.equal(pixels[12], 2);
        assert.equal(pixels[16], 2);
        assert.equal(pixels[20], 4);

        assert.equal(pixels[24], 7);
        assert.equal(pixels[28], 7);
        assert.equal(pixels[32], 8);
    });

    it('pixelate with value = 3', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixelCopyIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        let pixelsCopy = new Array(pixels.length);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.copyArray(pixels, pixelsCopy, videoWidth, videoHeight);
        transFunct.pixelate(pixels, videoWidth, videoHeight, 3);

        assert.equal(pixels[0], 4);
        assert.equal(pixels[4], 4);
        assert.equal(pixels[8], 4);

        assert.equal(pixels[12], 4);
        assert.equal(pixels[16], 4);
        assert.equal(pixels[20], 4);

        assert.equal(pixels[24], 4);
        assert.equal(pixels[28], 4);
        assert.equal(pixels[32], 4);
    });
});

describe('greyScale function', function()
{
    it('normal greyScale function', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        let pixelsCopy = new Array(pixels.length);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.copyArray(pixels, pixelsCopy, videoWidth, videoHeight);
        transFunct.greyScale(pixels, videoWidth, videoHeight);

        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                for(let i = 0; i < 3; i++)
                {
                    pixelIndex = 4 * videoWidth * y + 4 * x;
                    assert.equal(pixels[pixelIndex + i], pixelsCopy[pixelIndex]);
                }
            }
        }
    });
});

describe('mirror function', function()
{
    it('normal mirror function', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.mirror(pixels, videoWidth, videoHeight);

        assert.equal(pixels[0], 0);
        assert.equal(pixels[4], 1);
        assert.equal(pixels[8], 0);

        assert.equal(pixels[12], 3);
        assert.equal(pixels[16], 4);
        assert.equal(pixels[20], 3);

        assert.equal(pixels[24], 6);
        assert.equal(pixels[28], 7);
        assert.equal(pixels[32], 6);
    });
});

describe('drawRectangle function', function()
{
    it('drawRectangle with x = 0, y = 0, width = 2, height = 1', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.drawRectangle(pixels, videoWidth, videoHeight, 2, 1, 0, 0);

        //first two pixels should be black
        assert.equal(pixels[0], 0);
        assert.equal(pixels[1], 0);
        assert.equal(pixels[2], 0);

        assert.equal(pixels[4], 0);
        assert.equal(pixels[5], 0);
        assert.equal(pixels[6], 0);

        //Rest of the pixels should be unchanged
        assert.equal(pixels[8], 2);
        assert.equal(pixels[12], 3);
        assert.equal(pixels[16], 4);
        assert.equal(pixels[20], 5);
        assert.equal(pixels[24], 6);
        assert.equal(pixels[28], 7);
        assert.equal(pixels[32], 8);
    });

    it('drawRectangle with x = 0, y = 0, width = 1, height = 2', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.drawRectangle(pixels, videoWidth, videoHeight, 1, 2, 0, 0);

        //first and fourth pixels should be black
        assert.equal(pixels[0], 0);
        assert.equal(pixels[1], 0);
        assert.equal(pixels[2], 0);

        assert.equal(pixels[12], 0);
        assert.equal(pixels[13], 0);
        assert.equal(pixels[14], 0);

        //Rest of the pixels should be unchanged
        assert.equal(pixels[4], 1);
        assert.equal(pixels[8], 2);
        assert.equal(pixels[16], 4);
        assert.equal(pixels[20], 5);
        assert.equal(pixels[24], 6);
        assert.equal(pixels[28], 7);
        assert.equal(pixels[32], 8);
    });

    it('drawRectangle with x = 1, y = 1, width = 2, height = 2', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.drawRectangle(pixels, videoWidth, videoHeight, 2, 2, 1, 1);

        //fifth, sixth, eighth, and ninth pixels should be black
        assert.equal(pixels[16], 0);
        assert.equal(pixels[17], 0);
        assert.equal(pixels[18], 0);

        assert.equal(pixels[20], 0);
        assert.equal(pixels[21], 0);
        assert.equal(pixels[22], 0);

        assert.equal(pixels[28], 0);
        assert.equal(pixels[29], 0);
        assert.equal(pixels[30], 0);

        assert.equal(pixels[32], 0);
        assert.equal(pixels[33], 0);
        assert.equal(pixels[34], 0);

        //Rest of the pixels should be unchanged
        assert.equal(pixels[0], 0);
        assert.equal(pixels[4], 1);
        assert.equal(pixels[8], 2);
        assert.equal(pixels[12], 3);
        assert.equal(pixels[24], 6);
    });
});

describe('flipImage function', function()
{
    it('normal flipImage function', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixelCopyIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        let pixelsCopy = new Array(pixels.length);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.copyArray(pixels, pixelsCopy, videoWidth, videoHeight);
        //Call flipImage on the array
        transFunct.flipImage(pixels, videoWidth, videoHeight);

        //Now the pixels should be flipped
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + (videoWidth - x - 1) * 4;
                pixelCopyIndex = 4 * videoWidth * y + 4 * x;
                assert.equal(pixelsCopy[pixelCopyIndex], pixels[pixelIndex]);
            }
        }
    });
});

describe('increaseColor function', function()
{
    it('increaseColor with red = 1, green = 0, blue = 0', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.increaseColor(pixels, videoWidth, videoWidth, 1, 0, 0);

        //The red value for each pixel should be increased by 1
        assert.equal(pixels[0], 1);
        assert.equal(pixels[4], 2);
        assert.equal(pixels[8], 3);
        assert.equal(pixels[12], 4);
        assert.equal(pixels[16], 5);
        assert.equal(pixels[20], 6);
        assert.equal(pixels[24], 7);
        assert.equal(pixels[28], 8);
        assert.equal(pixels[32], 9);
    });

    it('increaseColor with red = 0, green = 1, blue = 0', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.increaseColor(pixels, videoWidth, videoWidth, 0, 1, 0);

        //The green value for each pixel should be increased by 1 (they all should be 1)
        assert.equal(pixels[1], 1);
        assert.equal(pixels[5], 1);
        assert.equal(pixels[9], 1);
        assert.equal(pixels[13], 1);
        assert.equal(pixels[17], 1);
        assert.equal(pixels[21], 1);
        assert.equal(pixels[25], 1);
        assert.equal(pixels[29], 1);
        assert.equal(pixels[33], 1);
    });

    it('increaseColor with red = 0, green = 0, blue = 1', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        transFunct.increaseColor(pixels, videoWidth, videoWidth, 0, 0, 1);

        //The blue value for each pixel should be increased by 1 (they all should be 1)
        assert.equal(pixels[2], 1);
        assert.equal(pixels[6], 1);
        assert.equal(pixels[10], 1);
        assert.equal(pixels[14], 1);
        assert.equal(pixels[18], 1);
        assert.equal(pixels[22], 1);
        assert.equal(pixels[26], 1);
        assert.equal(pixels[30], 1);
        assert.equal(pixels[34], 1);
    });
});

describe('copyArray function', function()
{
    it('normal copyArray function', function()
    {
        let videoWidth = 3;
        let videoHeight = 3;
        let pixelIndex;
        let pixels = new Array(videoWidth * videoHeight * 4);
        //Populating a 3x3 array of pixels with the red values starting at 0 and increasing by 1
        for(let y = 0; y < videoHeight; y++)
        {
            for(let x = 0; x < videoWidth; x++)
            {
                pixelIndex = 4 * videoWidth * y + 4 * x;
                pixels[pixelIndex] = videoWidth * y + x;
            }
        }
        let pixelsCopy = new Array(pixels.length);
        transFunct.copyArray(pixels, pixelsCopy, videoWidth, videoHeight);

        //The red values of each pixel of the copied array should be the same as the original
        assert.equal(pixelsCopy[0], 0);
        assert.equal(pixelsCopy[4], 1);
        assert.equal(pixelsCopy[8], 2);
        assert.equal(pixelsCopy[12], 3);
        assert.equal(pixelsCopy[16], 4);
        assert.equal(pixelsCopy[20], 5);
        assert.equal(pixelsCopy[24], 6);
        assert.equal(pixelsCopy[28], 7);
        assert.equal(pixelsCopy[32], 8);
    });
});
