'use strict';

angular.module('twitter').
    controller('ProfileController',
    function ($scope, AuthenticationService, $stateParams) {
        $scope.userId = $stateParams.userId;

        $scope.isProfileEditable = false;
        $scope.user = {};


        $scope.init = function() {
            if (AuthenticationService.getCurrentUser().id == $scope.userId) {
                $scope.isProfileEditable = true;
                $scope.user = angular.copy(AuthenticationService.getCurrentUser());
            }
            else {
                $scope.isProfileEditable = false;
                AuthenticationService.getUserWithId($scope.userId).then(function(user) {
                    $scope.user = user;
                    console.log("User profile retrieved: " + $scope.user);
                },
                function(error) {
                    console.error('Error: ', error);
                });
            }
        };
        $scope.init();

        $scope.$watch('user.cleanName', function() {
            /*
            console.log('CleanName updated');
            var localCurrentUser = AuthenticationService.getCurrentUser();
            localCurrentUser.cleanName = $scope.user.cleanName;
            AuthenticationService.updateUser($scope.user.cleanName, null);
            */
        });

        $scope.$watch('user.description', function() {
            /*
            var localCurrentUser = AuthenticationService.getCurrentUser();
            localCurrentUser.description = $scope.user.description;
            AuthenticationService.updateUser(null, $scope.user.description);
            */
        });
    });