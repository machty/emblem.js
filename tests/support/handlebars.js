var Handlebars;

if (typeof window === "undefined") {
  Handlebars = require('handlebars');
} else {
  Handlebars = window.Handlebars;
}

export default Handlebars;
