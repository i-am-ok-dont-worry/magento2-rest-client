var util = require('util');

module.exports = function (restClient) {
  var module = {};

  module.get = function (tag) {
    var query = 'searchCriteria=&searchCriteria[filterGroups][0][filters][0][field]=keyword&' +
            'searchCriteria[filterGroups][0][filters][0][value]=' + tag + '&' +
            'searchCriteria[filterGroups][0][filters][0][condition_type]=eq';

    var endpointUrl = util.format('/kmk-media-gallery', query);
    return restClient.get(endpointUrl);
  }
  
  return module;
}
