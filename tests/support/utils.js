export function w() {
  var values = [];
  for (var i=0, l=arguments.length; i<l; i++) {
    values.push(arguments[i]);
  }
  return values.join('\n');
}
