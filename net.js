const filter = cast([
  0, -1, 0,
  -1, 4, -1,
  0, -1, 0,
], 3, 3);

const filter2 = cast([
  -1, -1, -1,
  -1, 4, -1,
  -1, -1, -1,
], 3, 3);

const filter3 = cast([
  1, -2, 1,
  -2, 4, -2,
  1, -2, 1,
], 3, 3);

function applyNet(data) {
  return normalize(
    applyFilter(data, filter)
  );
}