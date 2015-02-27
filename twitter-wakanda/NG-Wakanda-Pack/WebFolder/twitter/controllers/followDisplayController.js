'use strict';

angular.module('twitter').
    controller('FollowDisplayController',
    function ($scope, $rootScope, AuthenticationService, $stateParams) {

        $scope.userId = $stateParams.userId;
        $scope.type = $stateParams.type; // Value is either 'followers' or 'following'

        $scope.users = [];

        $scope.retrieveUsers = function() {
            if ($scope.type == "followers") {
                AuthenticationService.followersForUserId(parseInt($scope.userId))
                    .then(function(users) {
                        console.log("Retrieved users: ", users);
                        $scope.users = users;
                    },
                    function(error) {
                        console.error("Error: ", error);
                    }
                );
            }
            else if ($scope.type == "following") {
                AuthenticationService.followingForUserId(parseInt($scope.userId))
                    .then(function(users) {
                        console.log("Retrieved users: ", users);
                        $scope.users = users;
                    },
                    function(error) {
                        console.error("Error: ", error);
                    }
                );
            }
        };
        $scope.retrieveUsers();
    });