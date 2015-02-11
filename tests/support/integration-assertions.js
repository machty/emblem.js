import Emblem from '../emblem'

QUnit.assert.compilesTo = function( emblem, handlebars, message ) {
  var output = Emblem.compile(emblem);
  QUnit.push(output == handlebars, output, handlebars, message);
};
