'use strict';

/* App Module */

//var phonecatApp = angular.module('phonecatApp', [
//  'ngRoute',
//  'phonecatAnimations',
//
//  'phonecatControllers',
//  'phonecatFilters',
//  'phonecatServices'
//]);
//
//phonecatApp.config(['$routeProvider',
//  function($routeProvider) {
//    $routeProvider.
//      when('/phones', {
//        templateUrl: 'partials/phone-list.html',
//        controller: 'PhoneListCtrl'
//      }).
//      when('/phones/:phoneId', {
//        templateUrl: 'partials/phone-detail.html',
//        controller: 'PhoneDetailCtrl'
//      }).
//      otherwise({
//        redirectTo: '/phones'
//      });
//  }]);

var app = angular.module('app', [
    'ngRoute',
    'phonecatAnimations',

    'PomDisplay',

    'phonecatControllers',
    'phonecatFilters',
    'phonecatServices',
    'ui.bootstrap'
]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/overview', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            }).
            when('/phones', {
                templateUrl: 'partials/phone-list.html',
                controller: 'PhoneListCtrl'
            }).
            when('/phones/:phoneId', {
                templateUrl: 'partials/phone-detail.html',
                controller: 'PhoneDetailCtrl'
            }).
            otherwise({
                redirectTo: '/overview'
//                redirectTo: '/phones'
            });
    }]);
