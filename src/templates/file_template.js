var urlChanged = function(url) {
  return function () {
    return browser.getCurrentUrl().then(function(actualUrl) {
      return url != actualUrl;
    });
  };
};

describe('test suite for %NAME%', function() {
  %0A%09browser.ignoreSynchronization = true;
  %0A%09%TESTTEMPLATE%
});