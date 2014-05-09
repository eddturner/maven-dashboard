'use strict';

/* Directives */
var directivesModule = angular.module('PomDisplay', []);


directivesModule.directive('pomGraph', function ($timeout, DataSource) {
    console.log("pom graph 0");
    var linkFn;
    console.log("pom graph 1");
    linkFn = function (scope, element, attrs) {
        scope.$watch('currentPomName', function () {
            var updateGraph = $timeout(function () {

                console.log("pom graph 2");
                var pomFile = "../../poms/effective/" + scope.currentPomName;
                var pomGraphFile = pomFile + ".graphml";

                var xmlTransform = function (data) {
                    console.log("transform data");
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                    // console.log(">> ");
                    // console.log(data);
                    return json.graphml.graph;
                };

                DataSource.applyTransformation(pomGraphFile, function (data) {
                    console.log(">> ");
                    console.log(data);
                    var g = new dagreD3.Digraph();
                    data.node.forEach(function (node) {
                        var nodeId = node._id;
//                        console.log(nodeId);
//                        console.log(node);
                        var text = node.data.ShapeNode.NodeLabel.__text;
                        if(text.indexOf('uk.ac.ebi.uniprot') > -1) {
                            g.addNode(nodeId, { label: node.data.ShapeNode.NodeLabel.__text, style : "fill: #c5e5c0" });
                        }
                        else {
                            g.addNode(nodeId, { label: node.data.ShapeNode.NodeLabel.__text});
                        }
                    });
                    data.edge.forEach(function (edge) {
//                        console.log("edge");
//                        console.log(edge);
//                         g.addEdge(null, edge._source, edge._target,{ label: edge.data.PolyLineEdge.EdgeLabel.__text});
                         g.addEdge(null, edge._source, edge._target);
                    });

                    var renderer = new dagreD3.Renderer();
                    var oldDrawNodes = renderer.drawNodes();
                    renderer.drawNodes(function (graph, root) {
                        var svgNodes = oldDrawNodes(graph, root);
                        svgNodes.attr("id", function (u) {
                            return "node-" + u;
                        });
                        svgNodes.select("rect").attr("style", function (u) {
                            return g.node(u).style;
                        });
                        return svgNodes;
                    });
                    console.log(d3.select("svg g"));
                    var layout = dagreD3.layout()
                        .nodeSep(20)
                        .rankDir("LR");
                    var layout = renderer.layout(layout).run(g, d3.select("svg g"));
                    console.log(layout.graph().width + " / " + layout.graph().height);
                    d3.select("svg")
                        .attr("width", layout.graph().width + 40)
                        .attr("height", layout.graph().height + 40);
                }, xmlTransform);
            });
        }, true);
        console.log("pom graph 3");
    };

    return {
        restrict: 'A',
        scope: { currentPomName: '=' },
        link: linkFn
    }
}).directive('pomView', function ($timeout, $compile, DataSource) {
    var linkFn;
    linkFn = function (scope, element, attrs) {
        scope.$watch('currentPomName', function () {
//            $timeout(function () {
            var pomFile = "";
            console.log("currentpom in directive");
            console.log(scope.currentPomName);
            if (attrs.pom === "effective") {
                pomFile = "../../poms/effective/" + scope.currentPomName;
            }
            else if (attrs.pom === "original") {
                pomFile = "../../poms/" + scope.currentPomName;
            }
            console.log("pomFile in directive = " + pomFile);

            DataSource.applyTransformation(pomFile, function (data) {
                var spaced = vkbeautify.xml(data, 2);
                spaced = spaced.replace(/\&/g, '&amp;').
                    replace(/\</g, '&lt;').
                    replace(/\>/g, '&gt;').
                    replace(/"/g, '&quot;');

                var newContents = angular.element(prettyPrintOne(spaced));
                element.html(newContents);
                // console.log("replacing element: ");
                // console.log(element);
                // console.log("with: ");
                // console.log(newContents);
            });
        }, true)
    };

    return {
        restrict: 'EA',
        scope: { currentPomName: '=' },
        link: linkFn
    }
});