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
                console.log("It's me: ", $scope.user);
            }
            else {
                $scope.isProfileEditable = false;
                AuthenticationService.getUserWithId($scope.userId).then(function(user) {
                    console.log('User to display: ', user);
                    $scope.user = user;
                },
                function(error) {
                    console.error('Error: ', error);
                });
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
    });