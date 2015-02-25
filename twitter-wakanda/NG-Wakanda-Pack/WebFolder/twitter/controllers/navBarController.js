/**
 * Created by msavy on 24/02/15.
 */
angular.module('twitter').
    controller('NavBarController',
    function ($scope, AuthenticationService, $state, $rootScope, TweetService) {

        $scope.tweetText = '';

        $scope.postTweet = function () {
            if ($scope.tweetText.length > 0) {
                TweetService.post($scope.tweetText).then(
                    function (tweet) {
                        $scope.tweetText = "";
                        $rootScope.$broadcast('postedTweet', tweet);
                    },
                    function (data) {
                        console.error('tweet post', data);
                    });
            }
        };

        $scope.performLogout = function () {
            AuthenticationService.logout();
            $rootScope.loggedIn = false;
            $state.go('login');
        };
    });