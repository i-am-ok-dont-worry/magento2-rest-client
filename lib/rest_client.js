'use strict';

const OAuth = require('oauth-1.0a');
const request = require('request');
const humps = require('humps');
const sprintf = require('util').format;

const logger = require('./log');

module.exports.RestClient = function (options) {
    const instance = {};

    const servelrUrl = options.url;
    const apiVersion = options.version;
    const storeCode = options.storeCode || 'all';
    const oauth = OAuth({
        consumer: {
            public: options.consumerKey,
            secret: options.consumerSecret
        },
        signature_method: 'HMAC-SHA1'
    });
    const token = {
        public: options.accessToken,
        secret: options.accessTokenSecret
    };

    function apiCall(request_data, request_token = '', customHeaders = {}) {
        /* eslint no-undef: off*/
        return new Promise(function (resolve, reject) {
            request({
                url: request_data.url,
                method: request_data.method,
                headers: {
                    ...(request_token
                        ? { 'Authorization': 'Bearer ' + request_token }
                        : oauth.toHeader(oauth.authorize(request_data, token))
                    ),
                    ...customHeaders
                },
                json: true,
                body: request_data.body,
            }, function (error, response, body) {
                if (error) {
                    logger.error('Error occurred: ' + error);
                    reject(error);
                    return;
                } else if (!httpCallSucceeded(response)) {
                    let errorMessage = `[${response.statusCode}] - ` + request_data.url + ' - ' + response.statusMessage;

                    if (body && body.hasOwnProperty('message')) {
                        errorMessage = errorString(body.message, body.hasOwnProperty('parameters') ? body.parameters : {});
                    }

                    logger.error('API call failed: ' + `[${response.statusCode}] - ` + request_data.url + ' - ' + response.statusMessage + body && body.hasOwnProperty('message') ? errorString(body.message, body.hasOwnProperty('parameters') ? body.parameters : {}) : '');
                    reject({
                        errorMessage,
                        code: response.statusCode,
                        toString: () => {
                            return this.errorMessage
                        }
                    });
                }

                resolve(body);
            });
        });
    }

    instance.consumerToken = function (login_data) {
        return apiCall({
            url: createUrl('/integration/customer/token'),
            method: 'POST',
            body: login_data
        })
    };

    function httpCallSucceeded(response) {
        return response.statusCode >= 200 && response.statusCode < 300;
    }

    function errorString(message, parameters) {
        let output = message;
        if (parameters === null) {
            return output;
        }
        if (parameters instanceof Array) {
            for (const i = 0; i < parameters.length; i++) {
                const parameterPlaceholder = '%' + (i + 1).toString();
                output = message.replace(parameterPlaceholder, parameters[i]);
            }
        } else if (parameters instanceof Object) {
            for (const key in parameters) {
                const parameterPlaceholder = '%' + key;
                output = message.replace(parameterPlaceholder, parameters[key]);
            }
        }

        return output;
    }

    instance.get = function (resourceUrl, request_token = '') {
        const request_data = {
            url: createUrl(resourceUrl),
            method: 'GET'
        };
        return apiCall(request_data, request_token);
    };

    function createUrl(resourceUrl) {
        return servelrUrl + '/' + storeCode + '/' + apiVersion + resourceUrl;
    }

    instance.post = function (resourceUrl, data, request_token = '', customHeaders = {}) {
        const request_data = {
            url: createUrl(resourceUrl),
            method: 'POST',
            body: data
        };
        return apiCall(request_data, request_token, customHeaders);
    };

    instance.put = function (resourceUrl, data, request_token = '') {
        const request_data = {
            url: createUrl(resourceUrl),
            method: 'PUT',
            body: data
        };
        return apiCall(request_data, request_token);
    };

    instance.delete = function (resourceUrl, request_token = '', data) {
        const request_data = {
            url: createUrl(resourceUrl),
            method: 'DELETE',
            ...(data && { body: data })
        };
        return apiCall(request_data, request_token);
    };

    return instance;
}
