module.exports = function (restClient) {
    var module = {};

    module.list = function () {
        return restClient.get('/directory/countries');
    }

    module.getCountryInfo = function (countryId) {
        return restClient.get('/directory/countries/' + countryId || '');
    }

    return module;
}
