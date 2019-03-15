// const filter = cast([
//   1, 0, 1,
//   0, 1, 0,
//   1, 0, 1,
// ], 3, 3);

const filter = cast([
  0, 0, 1,
  0, 0, 1,
  1, 1, 1,
], 3, 3);

loadImageData("dog.jpg")
  .then(data => {
    const newPixelData = normalize(applyFilter(data, filter), 255);
    // const newPixelData = data;

    const cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");

    for (let y = 0; y < newPixelData.length; y++) {
      for (let x = 0; x < newPixelData[0].length; x++) {
        const brightness = newPixelData[y][x] * 255;

        ctx.fillStyle = `rgb(${ brightness }, ${ brightness }, ${ brightness })`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  });