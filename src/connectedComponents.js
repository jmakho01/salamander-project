function bfs(image, visited, startX, startY) {
  const queue = [[startX, startY]];

  let xTotal = 0;
  let yTotal = 0;
  let size = 0;

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (visited[y][x]) continue;

    visited[y][x] = true;

    xTotal += x;
    yTotal += y;
    size++;

    const moves = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dx, dy] of moves) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        ny >= 0 &&
        ny < image.length &&
        nx >= 0 &&
        nx < image[0].length &&
        image[ny][nx] === 1 &&
        !visited[ny][nx]
      ) {
        queue.push([nx, ny]);
      }
    }
  }

  return {
    size,
    centroid: {
      x: Math.floor(xTotal / size),
      y: Math.floor(yTotal / size),
    },
  };
}

export function findLargestGroupCentroid(image) {
  const height = image.length;
  const width = image[0].length;

  const visited = Array.from(
    { length: height },
    () => Array(width).fill(false)
  );

  let largestGroup = null;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (image[y][x] === 1 && !visited[y][x]) {
        const group = bfs(image, visited, x, y);

        if (!largestGroup || group.size > largestGroup.size) {
          largestGroup = group;
        }
      }
    }
  }

  return largestGroup?.centroid ?? null;
}