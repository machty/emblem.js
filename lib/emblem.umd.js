import Emblem from './emblem';

/* global define:true module:true window: true */
if (typeof define === 'function' && define['amd']) {
  define(function() { return Emblem; });
} else if (typeof module !== 'undefined' && module['exports']) {
  module['exports'] = Emblem;
} else if (typeof this !== 'undefined') {
  this['Emblem'] = Emblem;
}

