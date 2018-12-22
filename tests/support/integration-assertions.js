/*global QUnit*/

import { w } from '../support/utils';
import { compile } from 'emblem';

const defaultOptions = {
  legacyAttributeQuoting: false
};

export default function loadAssertions() {
  QUnit.assert.compilesTo = function (emblem, handlebars, message, emblemOptions) {
    const options = emblemOptions || defaultOptions;
    const output = compile(emblem, options);

    if (!message) {
      const maxLenth = 40;
      let messageEmblem = emblem.replace(/\n/g, "\\n");

      if (messageEmblem.length > maxLenth) {
        messageEmblem = messageEmblem.slice(0, maxLenth) + '...';
      }
      message = w(
        'compilesTo assertion failed:',
        '\tEmblem:   "' + messageEmblem + '"',
        '\tExpected: "' + handlebars + '"',
        '\tActual:   "' + output + '"'
      )
    }

    this.pushResult({
      result: output === handlebars,
      expected: output,
      actual: handlebars,
      message
    });
  };

  QUnit.assert.compilerThrows = function (emblem, message) {
    QUnit.assert.throws(function () {
      compile(emblem);
    }, message);
  }
}
