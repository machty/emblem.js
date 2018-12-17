/*global QUnit*/

import { w } from '../support/utils';
import { compile } from 'emblem';

var defaultOptions = {
  legacyAttributeQuoting: false
};

export function compilesTo(emblem, handlebars, message, emblemOptions) {
  var options = emblemOptions || defaultOptions;
  var output = compile(emblem, options);

  if (!message) {
    var maxLenth = 40;
    var messageEmblem = emblem.replace(/\n/g, "\\n");
    if (messageEmblem.length > maxLenth) {
      messageEmblem = messageEmblem.slice(0,maxLenth) + '...';
    }
    message = w(
      'compilesTo assertion failed:',
      '\tEmblem:   "' + messageEmblem + '"',
      '\tExpected: "' + handlebars + '"',
      '\tActual:   "' + output + '"'
    )
  }
  QUnit.push(output === handlebars, output, handlebars, message);
};
