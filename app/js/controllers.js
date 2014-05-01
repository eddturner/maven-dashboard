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
        $scope.someNumber = '5';
        $scope.model = { dependencyList : 'helo'};

        // data should be text
        var escapeMarkup = function(data) {
            return data.replace(/\&/g, '&amp;').
                replace(/\</g, '&lt;').
                replace(/\>/g, '&gt;').
                replace(/"/g, '&quot;');
        };

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
            $scope.model = { dependencyList : data };
        };
        var setOriginalPom = function (data) {
//            $scope.originalPom = prettyPrintOne(replaceText(vkbeautify.xml(data, 2)), '', false);
            $scope.originalPom = angular.element(vkbeautify.xml(data, 2));
//            $scope.originalPom = data;
        };
        var setEffectivePom = function (data) {
//            $scope.originalPom = prettyPrintOne(replaceText(vkbeautify.xml(data, 2)), '', false);
            $scope.effectivePom =  prettyPrintOne(vkbeautify.xml(data, 2));
            console.log($scope.effectivePom);
//            $scope.originalPom = data;
        };

        var updatePomGraph = function () {
            var g = new dagreD3.Digraph();
//        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//        console.log(svg);
//        svg.append(g);
//        svg.append('</svg>');

        var states = [ "CLOSED", "LISTEN", "SYN RCVD", "SYN SENT",
            "ESTAB", "FINWAIT-1", "CLOSE WAIT", "FINWAIT-2",
            "CLOSING", "LAST-ACK", "TIME WAIT" ];
        states.forEach(function (state) {
            g.addNode(state, { label: state });
        });
        g.addEdge(null, "CLOSED", "LISTEN", { label: "open" });
        g.addEdge(null, "LISTEN", "SYN RCVD", { label: "rcv SYN" });
        g.addEdge(null, "LISTEN", "SYN SENT", { label: "send" });
        g.addEdge(null, "LISTEN", "CLOSED", { label: "close" });
        g.addEdge(null, "SYN RCVD", "FINWAIT-1", { label: "close" });
        g.addEdge(null, "SYN RCVD", "ESTAB", { label: "rcv ACK of SYN" });
        g.addEdge(null, "SYN SENT", "SYN RCVD", { label: "rcv SYN" });
        g.addEdge(null, "SYN SENT", "ESTAB", { label: "rcv SYN, ACK" });
        g.addEdge(null, "SYN SENT", "CLOSED", { label: "close" });
        g.addEdge(null, "ESTAB", "FINWAIT-1", { label: "close" });
        g.addEdge(null, "ESTAB", "CLOSE WAIT", { label: "rcv FIN" });
        g.addEdge(null, "FINWAIT-1", "FINWAIT-2", { label: "rcv ACK of FIN" });
        g.addEdge(null, "FINWAIT-1", "CLOSING", { label: "rcv FIN" });
        g.addEdge(null, "CLOSE WAIT", "LAST-ACK", { label: "close" });
        g.addEdge(null, "FINWAIT-2", "TIME WAIT", { label: "rcv FIN" });
        g.addEdge(null, "CLOSING", "TIME WAIT", { label: "rcv ACK of FIN" });
        g.addEdge(null, "LAST-ACK", "CLOSED", { label: "rcv ACK of FIN" });
        g.addEdge(null, "TIME WAIT", "CLOSED", { label: "timeout=2MSL" });

        var renderer = new dagreD3.Renderer();
        var oldDrawNodes = renderer.drawNodes();
        renderer.drawNodes(function (graph, root) {
            var svgNodes = oldDrawNodes(graph, root);
            svgNodes.attr("id", function (u) {
                return "node-" + u;
            });
            return svgNodes;
        });
//        console.log(svg);
//
        console.log(d3.select("svg g"));
//        console.log(d3.select("svg g").getBBox());
       console.log("g");
//        console.log(g);
//        console.log();
//        console.log($compile(svg)(scope));
//
//        element.replaceWith(angular.element('<h1>hello world</h1>'));
        var layout = renderer.run(g, d3.select("svg g"));
    //     console.log(layout.graph());
    //     d3.select("svg")
    // .attr("width", layout.graph().width + 100 + 40)
    // .attr("height", layout.graph().height + 100 + 40);
        }

        DataSource.applyTransformation(effectivePomFile, setDependencyList, xmlTransform);
//        DataSource.applyTransformation(pomFile, setOriginalPom, null);
//        DataSource.applyTransformation(effectivePomFile, setEffectivePom, null);
    }
]);
