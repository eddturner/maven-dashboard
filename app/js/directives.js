'use strict';

/* Directives */
var directives = angular.module('SimpleDirective', []).directive('myDir', function(DataSource) {
    var linkFn;
  linkFn = function( scope, element, attrs ) {
angular.element( '#effective-pom' ).replaceWith( prettyPrintOne("<parent><groupId>uk.ac.ebi.uniprot</groupId><artifactId>ujdk-parent</artifactId><version>1.0</version><relativePath>../uniprot-ujdk-parent</relativePath></parent>" ));
  }

  return {
    restrict: 'E',
    link: linkFn
  }
  });