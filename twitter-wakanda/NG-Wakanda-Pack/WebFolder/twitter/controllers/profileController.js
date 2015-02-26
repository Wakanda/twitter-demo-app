'use strict';

angular.module('twitter').
    controller('ProfileController',
    function ($scope, AuthenticationService, $stateParams, TweetService) {
        $scope.userId = $stateParams.userId;
        $scope.isProfileEditable = false;
        $scope.user = {};
        $scope.currentUser = AuthenticationService.getCurrentUser();
        $scope.tweets = [];

        $scope.init = function() {
            AuthenticationService.getUserWithId($scope.userId).then(function(user) {
                console.log('User to display: ', user);
                $scope.user = user;
                $scope.isProfileEditable = (AuthenticationService.getCurrentUser().id == user.id);
            },
            function(error) {
                console.error('Error: ', error);
            });

            //User tweets retrieving
            TweetService.profileTweetFeed($scope.userId, $scope.currentUser.id).then(
                function (tweets){
                    $scope.tweets = tweets;
                    console.log('profile tweets', tweets);
                },
                function (errorMessage) {
                    console.error(errorMessage);
                }
            );
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
    });