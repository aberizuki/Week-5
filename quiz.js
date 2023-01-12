function stringShortener(str) {
  index = 0;

  // looping input data
  for (var i = 0; i < str.length; i++) {
    // untuk mengecek apakah str[i] sudah ada sebelumnya
    var j;
    for (j = 0; j < i; j++) {
      if (str[i] == str[j]) {
        break;
      }
    }

    // jika tidak ada maka akan dimasukkan ke hasil
    if (j == i) {
      str[index++] = str[i];
    }
  }
  //untuk memotong output yang akan dikeluarkan berdasarkan value string dan index
  return str.join("").slice(str, index);
}

var str = "aaabccddd".split("");
console.log(stringShortener(str));
