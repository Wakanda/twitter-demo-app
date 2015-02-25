'use strict';

angular.module('twitter').
    controller('ProfileController',
    function ($scope, AuthenticationService) {
        $scope.user = {};

        $scope.init = function() {
            $scope.user = angular.copy(AuthenticationService.getCurrentUser());
            console.log("User: ", $scope.user);
        };
        $scope.init();

        $scope.$watch('user.cleanName', function() {
            var localCurrentUser = AuthenticationService.getCurrentUser();
            localCurrentUser.cleanName = $scope.user.cleanName;
        });

        $scope.$watch('user.description', function() {
            var localCurrentUser = AuthenticationService.getCurrentUser();
            localCurrentUser.description = $scope.user.description;
        });
    });