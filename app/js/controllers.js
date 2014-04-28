'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
    function ($scope, Phone) {
        $scope.phones = Phone.query();
        $scope.orderProp = 'age';
    }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
    function ($scope, $routeParams, Phone) {
        $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function (phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
    }]);

phonecatControllers.controller('MainCtrl', ['$scope', '$routeParams', 'DataSource',
    function ($scope, $routeParams, DataSource) {
        console.log("hello world!");

        var pomFile = "../../poms/storage-2014.05.pom";
        var effectivePomFile = "../../poms/effective/storage-2014.05.pom";

        var xmlTransform = function (data) {
            console.log("transform data");
            var x2js = new X2JS();
            var json = x2js.xml_str2json(data);
            //console.log(data);
            return json.project.dependencies.dependency;
        };

        var replaceText = function(str)
        {
            var str1 = String(str);
            return str1.replace(/\n/g,"<br/>");
        }

        var setDependencyList = function (data) {
            $scope.dependencyList = data;
        };
        var setOriginalPom = function (data) {
//            $scope.originalPom = prettyPrintOne(replaceText(vkbeautify.xml(data, 2)), '', false);
            $scope.originalPom = vkbeautify.xml(data, 2);
//            $scope.originalPom = data;
        };
        var setEffectivePom = function (data) {
//            $scope.originalPom = prettyPrintOne(replaceText(vkbeautify.xml(data, 2)), '', false);
            $scope.effectivePom =  prettyPrintOne(vkbeautify.xml(data, 2));
            console.log($scope.effectivePom);
//            $scope.originalPom = data;
        };

        DataSource.applyTransformation(effectivePomFile, setDependencyList, xmlTransform);
        DataSource.applyTransformation(pomFile, setOriginalPom, null);
        DataSource.applyTransformation(effectivePomFile, setEffectivePom, null);
    }
]);
