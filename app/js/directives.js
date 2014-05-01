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

                var mainNodeText = "storage";
                g.addNode(mainNodeText, { label: mainNodeText, style: "fill: #8ece86" });
                scope.dependencies.forEach(function(dep) {
                    if(dep.groupId === 'uk.ac.ebi.uniprot') {
                        var depNodeId = dep.artifactId + ":" + dep.version;
                        g.addNode(depNodeId, { label: dep.artifactId + ":" + dep.version});
                        g.addEdge(null, mainNodeText, depNodeId);
                    }
                });

                var renderer = new dagreD3.Renderer();
                var oldDrawNodes = renderer.drawNodes();
                renderer.drawNodes(function (graph, root) {
                    var svgNodes = oldDrawNodes(graph, root);
                    svgNodes.attr("id", function (u) {
                        return "node-" + u;
                    });
                    svgNodes.select("rect").attr("style", function(u) { return g.node(u).style; });
                    return svgNodes;
                });
                console.log(d3.select("svg g"));
                var layout = dagreD3.layout()
                    .nodeSep(30)
                    .rankDir("LR");
                var layout = renderer.layout(layout).run(g, d3.select("svg g"));
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
        scope.$watch('currentPomName', function () {
        var pomFile = "";
        console.log("currentpom in directive");
        console.log(currentPomName);
        if (attrs.pom === "effective") {
            pomFile = "../../poms/effective/"+scope.currentPomName;
        }
        else if (attrs.pom === "original") {
            pomFile = "../../poms/"+scope.currentPomName;
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
    })};

    return {
        restrict: 'E',
        scope: { currentPomName: '=' },
        link: linkFn
    }
});