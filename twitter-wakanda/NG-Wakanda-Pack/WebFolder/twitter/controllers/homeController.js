/**
 * Created by msavy on 23/02/15.
 */

'use strict';

angular.module('twitter').
    controller('HomeController',
    function ($scope, TweetService, $rootScope, AuthenticationService) {
        $scope.tweets = [];
        $scope.currentUser = AuthenticationService.getCurrentUser();

        TweetService.userHomeFeed().then(function (data) {
            console.log('user home feed success', data);
            $scope.tweets = data;
        });

        $rootScope.$on('postedTweet', function (event, tweet) {
            $scope.tweets.unshift(tweet);
        });
    });