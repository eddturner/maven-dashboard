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
        $scope.model = { dependencyList: [],
            pomList: [],
            pomListing: [],
            currentPomName: "",
            currentPomPath: "",
            graphBeingShown:false
        };

        console.log("hello world!");

        var pomDir = "../../poms/";
        var scriptDir = "../../scripts/";
        var pomFile = pomDir + "storage-2014.05.pom";
        var effectivePomFile = pomDir + "effective/storage-2014.05.pom";
        var pomListFile = scriptDir + "pomList.json";
        var pomListingFile = scriptDir + "pomListing.json";

        /*---------- functions -----------*/
        $scope.pomListOnClick = function (pomJSON) {
            $scope.model.currentPomName = pomJSON.name;
            $scope.model.currentPomPath = pomJSON.path;
            console.log("pomOnClick");
            console.log(pomJSON);
//            console.log("set $scope.model.currentPomName = " + $scope.model.currentPomName);
            $scope.updateViews();
        };

        $scope.setGraphBeingShown = function (isShown) {
            $scope.model.graphBeingShown = isShown;
            console.log("set $scope.model.graphBeingShown = " + $scope.model.graphBeingShown);
        };

        $scope.orderByRelease = function (pomName) {
            var matches = pomName.name.match(/.*([0-9]{4}\.[0-9]{2}.*)\.pom/);
            if (matches.length === 2) {
                return matches[1];
            }
            else {
                return pomName;
            }
        };

        var xmlTransform = function (data) {
            console.log("transform data");
            var x2js = new X2JS();
            var json = x2js.xml_str2json(data);
            console.log(data);
            return json.project.dependencies.dependency;
        };

        var setDependencyList = function (data) {
            console.log(">>");
            console.log(data);
            if (data.length > 0) {
//                $scope.model.currentPomName = data.poms[0].name;
            }
            $scope.model.dependencyList = data;
        };

        var setPomList = function (data) {
            $scope.model.pomList = angular.fromJson(data);
//            console.log($scope.model.pomList);
        };
        var setPomListing = function (data) {
            $scope.model.pomListing = angular.fromJson(data);
            console.log($scope.model.pomListing);
        }

        $scope.updateViews = function () {
            DataSource.applyTransformation($scope.model.currentPomPath+"-effective", setDependencyList, xmlTransform);
        };

        $scope.updateViews();
        DataSource.applyTransformation(pomListFile, setPomList, null);
        DataSource.applyTransformation(pomListingFile, setPomListing, null);

    }
]);
