'use strict';

/* Directives */
var directives = angular.module('SimpleDirective', []).directive('pomView', function (DataSource) {
    var linkFn;
    linkFn = function (scope, element, attrs) {

        var pomFile = "";
        if (attrs.pom === "effective") {
            pomFile = "../../poms/effective/storage-2014.05.pom";
        }
        else if( attrs.pom === "original") {
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
    }

    return {
        restrict: 'E',
        link: linkFn
    }
});