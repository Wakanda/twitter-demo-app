/**
 * Created by msavy on 23/02/15.
 */

'use strict';

angular.module('twitter').
    controller('HomeController',
    function ($scope, TweetService, $rootScope, AuthenticationService, $modal) {
        $scope.tweets = [];
        $scope.currentUser = AuthenticationService.getCurrentUser();

        TweetService.userHomeFeed().then(function (data) {
            $scope.tweets = data;
        });

        $rootScope.$on('postedTweet', function (event, tweet) {
            $scope.tweets.unshift(tweet);
        });

        $scope.replyToTweet = function(tweet) {
            console.log("TW: ", tweet);
            var modalInstance = $modal.open({
                templateUrl: 'views/modal/modal-reply.html',
                controller: 'ModalTweetReplyController',
                size: 'lg',
                resolve: {
                    tweet: function () {
                        return tweet;
                    }
                }
            });

            modalInstance.result.then(function (tweet) {
                TweetService.post(tweet.text).then(
                    function (tweet) {
                        $rootScope.$broadcast('postedTweet', tweet);
                    },
                    function (data) {
                        console.error('tweet post', data);
                    });
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
});