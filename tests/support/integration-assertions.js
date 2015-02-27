/*global QUnit*/

import { w } from '../support/utils';
import Emblem from '../../emblem';

export function compilesTo( emblem, handlebars, message ) {
  var output = Emblem.compile(emblem);
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
