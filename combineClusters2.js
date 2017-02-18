combineClusters = function (map1, map2, dx, dy) {
  var height1 = map1.length
  var width1 = map1[0].length
  var height2 = map2.length
  var width2 = map2[0].length

  var dx1 = Math.max(0, -dx)
  var dy1 = Math.max(0, -dy)
  var dx2 = Math.max(0, dx)
  var dy2 = Math.max(0, dy)
  /*
  console.log("dx1 " + dx1)
  console.log("dy1 " + dy1)
  console.log("dx2 " + dx2)
  console.log("dy2 " + dy2)
  */
  var newWidth = Math.max(width1 + dx1, width2 + dx2)
  var newHeight = Math.max(height1 + dy1, height2 + dy2)
  var newMap = []
  /*
  console.log("newWidth " + newWidth)
  console.log("newHeight " + newHeight)
  */
  for(y =0; y < newHeight; y++){
    newMap.push([]);
    for(x = 0; x < newWidth; x++){
      var val1 = 0;
      var val2 = 0;
      if ((x - dx1) >= 0 && (x - dx1) < width1 && (y - dy1) >= 0 && (y - dy1) < height1) {
        val1 = map1[y - dy1][x - dx1];
      }
      if ((x - dx2) >= 0 && (x - dx2) < width2 && (y - dy2) >= 0 && (y - dy2) < height2) {
        val2 = map2[y - dy2][x - dx2];
      }
      newMap[y].push(Math.max(val1, val2));
    }
  }

  return newMap;
}

console.log(
  combineClusters(
    [[1,1]],
    [[1,1]],
    2,
    -1
  )
)

console.log(
  combineClusters(
    [[1,1]],
    [[1,1]],
    -2,
    1
  )
)

console.log(
  combineClusters(
    [[1]],
    [[0,0,1],[0,0,1],[1,1,1]],
    -1,
    -1
  )
)
