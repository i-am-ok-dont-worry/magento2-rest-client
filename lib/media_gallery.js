var util = require('util');
var SearchCriteria = require('magento-searchcriteria-builder');

module.exports = function (restClient) {
  var module = {};

  module.get = function (tags) {
    var query = new SearchCriteria();
    query.applyFilter('keyword', tags, 'in');
    var endpointUrl = util.format('/kmk-media-gallery', query);
    return restClient.get(endpointUrl);
  }
  
  return module;
}
