'use strict';

/* Services */

var services = angular.module('phonecatServices', ['ngResource']);

services.factory('Phone', ['$resource',
    function ($resource) {
        return $resource('phones/:phoneId.json', {}, {
            query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
        });
    }]);

/* get the xml datasource */
services.factory('DataSource', ['$http', function ($http) {
    return {
        applyTransformation: function (file, callback, transform) {
            $http.get(
                file,
                {transformResponse: transform}
            ).
                success(function (data, status) {
                    console.log("Request succeeded");
                    console.log(">>>> "+data);
                    if( callback != null)
                        callback(data);
                }).
                error(function (data, status) {
                    console.log("Request failed " + status);
                });
        }
    };
}]);
