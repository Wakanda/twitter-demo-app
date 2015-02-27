/**
 * Created by msavy on 24/02/15.
 */
angular.module('twitter').
    controller('NavBarController',
    function ($scope, AuthenticationService, $state, $rootScope, TweetService) {

        $scope.tweetText = '';
        $scope.searchQuery = '';
        $scope.currentUser = AuthenticationService.getCurrentUser();

        $scope.$watch(function () {
            return AuthenticationService.getCurrentUser()
        }, function (newVal, oldVal) {
            $scope.currentUser = newVal
        });

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

        $scope.search = function () {
            if ($scope.searchQuery && $scope.searchQuery.length > 0) {
                $state.go('search', {query: $scope.searchQuery});
                $scope.searchQuery = '';
            }
        };
    });