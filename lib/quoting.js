function escapeString(str) {
  str = str.replace(/\\/g, "\\\\");
  str = str.replace(/"/g, '\\"');
  str = str.replace(/\n/g, "\\n");
  return str;
}

export { escapeString };

function string(str) {
  return '"' + escapeString(str) + '"';
}

export { string };

export function repeat(chars, times) {
  var str = "";
  while (times--) {
    str += chars;
  }
  return str;
}
