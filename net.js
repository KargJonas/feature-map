const filter = cast([
  -3, .5, .5,
  .5, .5, .5,
  .5, .5, .5,
], 3, 3);

function applyNet(data) {
  return normalize(
    applyFilter(data, filter)
  );
}