arr = []

// direction vectors
dx = [1, 0, -1, 0];
dy = [0, 1, 0, -1];


function zeros(w, h) {
  var arr = [];
  for(var i=0;i<h;i++){
    arr.push([]);
    for(var j=0;j<w;j++){
      arr[i].push(0);
    }
  }
  return arr
}

// matrix dimensions
w = arr[0].length;
h = arr.length;

labels = zeros(w, h)

function dfs(x, y, current_label) {
  if (x < 0 || x == row_count) return; // out of bounds
  if (y < 0 || y == col_count) return; // out of bounds
  if (label[x][y] || !arr[x][y]) return; // already labeled or not marked with 1 in m

  // mark the current cell
  label[x][y] = current_label;

  // recursively mark the neighbors
  for (int direction = 0; direction < 4; ++direction)
    dfs(x + dx[direction], y + dy[direction], current_label);
}

void find_components() {
  int component = 0;
  for (int i = 0; i < row_count; ++i)
    for (int j = 0; j < col_count; ++j)
      if (!label[i][j] && m[i][j]) dfs(i, j, ++component);
}
