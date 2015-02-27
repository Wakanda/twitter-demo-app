/**
 * Created by msavy on 27/02/15.
 */
'use strict';

angular.module('twitter').
    controller('SearchController',
    function ($scope, $stateParams) {
        $scope.queryString = $stateParams.query;
    });