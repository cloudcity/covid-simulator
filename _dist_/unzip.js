export default function unzip(arr) {
  var elements = arr.length;
  var len = arr[0].length;
  var final = [];

  for (var i = 0; i < len; i++) {
    var temp = [];
    for (var j = 0; j < elements; j++) {
      temp.push(arr[j][i]);
    }
    final.push(temp);
  }

  return final;
};
