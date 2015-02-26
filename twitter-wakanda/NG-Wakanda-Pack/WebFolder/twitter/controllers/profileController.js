'use strict';

angular.module('twitter').
    controller('ProfileController',
    function ($scope, AuthenticationService, $stateParams, TweetService, $modal, $state) {
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
                    function (error) {
                        $state.go('404');
                    });
            }
            else {//if ($scope.userName != undefined && $scope.userName != null) {
                AuthenticationService.getWithLogin($scope.userName, $scope.currentUser.id).then(
                    handleUser,
                    function (error) {
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