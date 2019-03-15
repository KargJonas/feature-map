const filter = cast([
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
], 3, 3);

loadImageData("dog.jpg")
  .then(data => {
    const patch = getPatch(data, 1, 1, 3);

    console.log(patch);
    console.log(data);
  })