/**
 * Created by msavy on 27/02/15.
 */
'use strict';

angular.module('twitter').
    controller('SearchController',
    function ($scope, $stateParams, TweetService, AuthenticationService) {

        $scope.queryString = $stateParams.query;
        $scope.tweets = [];

        var currentUser = AuthenticationService.getCurrentUser();


        if ($scope.queryString && $scope.queryString.length > 0) {

            var queryString = $scope.queryString;

            if ($scope.queryString[0] == '#')
                queryString = queryString.slice(1);

             TweetService.search(queryString, currentUser.id).then(
                 function (tweets) {
                    $scope.tweets = tweets;
                 }
             );
        }
    });