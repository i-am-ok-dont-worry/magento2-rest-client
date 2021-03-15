var util = require('util');
var SearchCriteria = require('magento-searchcriteria-builder');

module.exports = function (restClient) {
  var module = {};

  module.getItems = function (tags) {
    var query = new SearchCriteria();
    query.applyFilter('keyword', tags, 'in');
    var endpointUrl = util.format('/kmk-media-gallery?%s', query.build());
    return restClient.get(endpointUrl);
  }
  
  return module;
}
