'use strict';

/* Directives */
var directivesModule = angular.module('PomDisplay', []);


directivesModule.directive('pomGraph', function ($timeout, DataSource) {
    console.log("pom graph 0");
    var linkFn;
    console.log("pom graph 1");
    linkFn = function (scope, element, attrs) {
        scope.$watch('dependencies', function () {
            var updateGraph = $timeout(function () {

                console.log("pom graph 2");
                var pomFile = "";
                if (attrs.pom === "effective") {
                    pomFile = "../../poms/effective/storage-2014.05.pom";
                }
                else if (attrs.pom === "original") {
                    pomFile = "../../poms/storage-2014.05.pom";
                }

                var g = new dagreD3.Digraph();

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
                console.log(d3.select("svg g"));
                var layout = renderer.run(g, d3.select("svg g"));
                console.log("depList");
                console.log(scope.dependencies);
            });
        });
        console.log("pom graph 3");
    };

    return {
        restrict: 'A',
        scope: { dependencies: '=' },
        link: linkFn
    }
}).directive('pomView', function (DataSource) {
    var linkFn;
    linkFn = function (scope, element, attrs) {
        var pomFile = "";
        if (attrs.pom === "effective") {
            pomFile = "../../poms/effective/storage-2014.05.pom";
        }
        else if (attrs.pom === "original") {
            pomFile = "../../poms/storage-2014.05.pom";
        }

        DataSource.applyTransformation(pomFile, function (data) {
            var spaced = vkbeautify.xml(data, 2);
            spaced = spaced.replace(/\&/g, '&amp;').
                replace(/\</g, '&lt;').
                replace(/\>/g, '&gt;').
                replace(/"/g, '&quot;');

            var pomView = angular.element('<pre class="prettyprint">');
            pomView.append(prettyPrintOne(spaced));
            pomView.append('</pre>');
            element.replaceWith(pomView);
        }, null);
    };

    return {
        restrict: 'E',
        link: linkFn
    }
});