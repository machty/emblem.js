var Emblem;

this.Emblem = {};

Emblem = this.Emblem;

Emblem.VERSION = "0.3.12";

module.exports = Emblem;

if (typeof window !== "undefined" && window !== null) {
  window.Emblem = Emblem;
}

global.Emblem = Emblem;

require('./parser');

require('./compiler');

require('./preprocessor');

require('./emberties');
