var util = require('util');

module.exports = function (restClient) {
    var module = {};

    module.list = function (sku) {
        var endpointUrl = util.format('/stockItems/%s', encodeURIComponent(sku));
        return restClient.get(endpointUrl);
    };

    // MSI
    module.getSalableQty = function (sku, stockId) {
        var endpointUrl = util.format(
            '/inventory/get-product-salable-quantity/%s/%d',
            encodeURIComponent(sku),
            encodeURIComponent(stockId)
        );
        return restClient.get(endpointUrl);
    };

    // MSI
    module.isSalable = function (sku, stockId) {
        var endpointUrl = util.format(
            '/inventory/is-product-salable/%s/%d',
            encodeURIComponent(sku),
            encodeURIComponent(stockId)
        );
        return restClient.get(endpointUrl);
    };

    module.getProductStockItem = function (skus = '', token) {
        skus = skus.split(',').map(sku => encodeURIComponent(sku)).join(',');
        const endpointUrl = util.format('/inventory/source-items?searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B0%5D%5Bfield%5D=sku&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B0%5D%5Bvalue%5D=%s&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B0%5D%5BconditionType%5D=in', skus);
        return restClient.get(endpointUrl, token);
    };

    return module;
}
