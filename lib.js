// Load an image as a two-dimensional array from a url/path.
// Each pixel is represented as a value from 0-1.
function loadImageData(imagePath) {
  // This context is used to extract pixel-data from a Image-element.
  const context = document
    .createElement("canvas")
    .getContext("2d");

  const ImageLoaded = new Promise((resolve) => {
    // Creating an Image-Element, which will be used to load
    // and draw an image to the context/canvas.
    const image = new Image();

    // Handling onload of the image
    image.onload = () => {
      context.drawImage(image, 0, 0);

      const width = image.width;
      const height = image.height;
      const rawImageData = Array.from(context.getImageData(0, 0, width, height).data);
      const pureImageData = [];

      while (rawImageData.length) {
        // Getting the red, green and blue contents of the current pixel
        const r = rawImageData.shift();
        const g = rawImageData.shift();
        const b = rawImageData.shift();

        // Removing the alpha channel
        rawImageData.shift();

        // Calculating average brightness of the current Pixel => grayscale
        const averageBrightness = (r + g + b) / 3;

        // This is done to adjust all values to a space between 0 and 1
        const adjustedBrightness = averageBrightness / 255;

        pureImageData.push(adjustedBrightness);
      }

      resolve(cast(pureImageData, width, height));
    };

    // Loading the image
    image.src = imagePath;
  });

  return ImageLoaded;
}

// Mapping each index in a input-array to a (y; x) point in
// a two-dimensional array
function cast(input, width, height) {
  const result = [];

  // Validating the cast parameters
  // => is it possible to cast to that shape ?
  if (width * height !== input.length) {
    throw "Invalid cast!";
  }

  for (let y = 0; y < height; y++) {
    result.push([]);

    for (let x = 0; x < width; x++) {
      result[y][x] = input[y * width + x];
    }
  }

  return result;
}

// Getting a section of a two-dimensional array => a patch
function getPatch(inputArray, positionX, positionY, patchSize) {
  const patch = [];

  for (let y = 0; y < 3; y++) {
    patch.push([]);

    for (let x = 0; x < 3; x++) {
      patch[y][x] = inputArray[positionY + y - 1][positionX + x - 1];
    }
  }

  return patch;
}