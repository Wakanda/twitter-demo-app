/**
 * Created by msavy on 26/02/15.
 */
angular.module('twitter')
    .directive('tweetFeed', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/directive/tweet-feed.html',
            controller: 'TweetFeedDirectiveController',
            scope: {
                tweets: '='
            }
        };
    })
    .controller('TweetFeedDirectiveController',
    function ($scope, $modal, TweetService, AuthenticationService, $rootScope) {

        $scope.currentUser = AuthenticationService.getCurrentUser();

        $scope.performRetweet = function (tweet) {
            if (!tweet.hasBeenRt) {
                TweetService.retweet(tweet, $scope.currentUser).then(
                    function (rt) {
                        tweet.hasBeenRt = true;
                        tweet.nbRetweet++;
                    }
                );
            }
        };

        $scope.replyToTweet = function (tweet) {
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

            modalInstance.result.then(
                function (tweet) {
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