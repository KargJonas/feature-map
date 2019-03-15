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

// Multiplies two two-dimensional arrays.
// Each (y; x) point on one array is multiplied
// the corresponding point on the other array.
// Finally, the sum of all points products is
// calculated
function matrixMultiply(matrix1, matrix2) {
  let sum = 0;

  // Validating the cast parameters
  // => is it possible to multiply those matrices?
  // if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
  //   throw new Error("Invalid matrix multiplication.");
  // }

  // The Math
  for (let y = 0; y < matrix1.length; y++) {
    for (let x = 0; x < matrix1[0].length; x++) {
      sum += matrix1[y][x] * matrix2[y][x];
    }
  }

  return sum;
}

// Applies a filter to a two-dimensional array
function applyFilter(input, filter) {
  const featureMap = [];

  const width = input[0].length;
  const height = input.length;

  for (let y = 1; y < height - 1; y++) {
    featureMap.push([]);

    for (let x = 1; x < width - 1; x++) {
      const product = matrixMultiply(
        getPatch(input, x, y, 3),
        filter
      );

      featureMap[y - 1][x - 1] = product;
    }
  }

  return featureMap;
}

// Converts a two-dimensional array to a one-dimensional one
function deCast(matrix) {
  let array = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      array.push(matrix[y][x]);
    }
  }

  return array;
}

// Adjusts all values in a matrix to a space between 0 and 1
function normalize(matrix) {
  const result = [];

  const width = matrix[0].length;
  const height = matrix.length;
  const deCastedArray = deCast(matrix);

  const largest = Math.max.apply(Math, deCastedArray);
  const smallest = Math.min.apply(Math, deCastedArray);

  const factor = largest - smallest;

  for (let y = 0; y < height; y++) {
    result.push([]);

    for (let x = 0; x < width; x++) {
      result[y][x] = (matrix[y][x] - smallest) / factor;
    }
  }

  return result;
}