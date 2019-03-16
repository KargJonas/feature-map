const image = "dog.jpg";

loadImageData(image)
  .then(data => {
    draw(applyNet(data));
  });

document.getElementById("input").src = image;

function draw(data) {
  const cnv = document.getElementById("cnv");
  const ctx = cnv.getContext("2d");

  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
      const brightness = data[y][x] * 255;

      ctx.fillStyle = `rgb(${ brightness }, ${ brightness }, ${ brightness })`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}