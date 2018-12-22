import loadAssertions from 'tests/support/integration-assertions';

function loadTests() {
  const testKeys = Object.keys(requirejs._eak_seen).filter(a => a.endsWith('-test'));

  testKeys.forEach(key => require(key));
}

function startTestem() {
  if (window.Testem) {
    window.Testem.hookIntoTestFramework();
  }
}

loadAssertions();
loadTests();
startTestem();
