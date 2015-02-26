'use strict';

angular.module('twitter').
    controller('ProfileController',
    function ($scope, AuthenticationService, $stateParams, TweetService, $state, $rootScope) {
        $scope.userId = $stateParams.userId;
        $scope.userName = $stateParams.username;
        $scope.isProfileEditable = false;
        $scope.user = null;
        $scope.currentUser = AuthenticationService.getCurrentUser();
        $scope.tweets = [];

        $scope.init = function() {

            if ($scope.userId != undefined && $scope.userId != null) {
                AuthenticationService.getUserWithId($scope.userId, $scope.currentUser.id).then(
                    handleUser,
                    function () {
                        $state.go('404');
                    });
            }
            else {//if ($scope.userName != undefined && $scope.userName != null) {
                AuthenticationService.getWithLogin($scope.userName, $scope.currentUser.id).then(
                    handleUser,
                    function () {
                        $state.go('404');
                    }
                );
            }

            function handleUser (user) {
                console.log('User to display: ', user);
                $scope.user = user;
                $scope.isProfileEditable = ($scope.currentUser.id == user.id);

                //User tweets retrieving
                TweetService.profileTweetFeed(user.id, $scope.currentUser.id).then(
                    function (tweets){
                        $scope.tweets = tweets;
                        console.log('profile tweets', tweets);
                    },
                    function (errorMessage) {
                        console.error(errorMessage);
                    }
                );
            }
        };
        $scope.init();

        $scope.$watch('user.cleanName', function() {
            if ($scope.isProfileEditable) {
                var localCurrentUser = AuthenticationService.getCurrentUser();
                localCurrentUser.cleanName = $scope.user.cleanName;
                AuthenticationService.updateUser($scope.user.cleanName, null);
                console.log('Updated');
            }
        });

        $scope.$watch('user.description', function() {
            if ($scope.isProfileEditable) {
                var localCurrentUser = AuthenticationService.getCurrentUser();
                localCurrentUser.description = $scope.user.description;
                AuthenticationService.updateUser(null, $scope.user.description);
                console.log('Updated');
            }
        });

        $scope.updateProfilePicture = function() {
            console.log("Attempt to update profile picture");
            var image = document.getElementById("candidateProfilePicture");
            AuthenticationService.updateProfilePicture(image.files[0]).then(function() {
                console.log("Upload succeeded");
            },
            function(error) {
                console.error("Error while uploading photo:", error);
            });
        };

        $scope.subscribe = function() {
            AuthenticationService.subscribeToUser($scope.user.id);
            $scope.user.isCurrentUserFollowing = !$scope.user.isCurrentUserFollowing;
        };

        $scope.unsubscribe = function() {
            AuthenticationService.unsubscribeFromUser($scope.user.id);
            $scope.user.isCurrentUserFollowing = !$scope.user.isCurrentUserFollowing;
        };

        $rootScope.$on('postedTweet', function (event, tweet) {
            $scope.tweets.unshift(tweet);
        });
    });