'use strict';

angular.module('twitter').
    controller('ProfileController',
    function ($scope, AuthenticationService) {
        $scope.init = function() {
            $scope.user = AuthenticationService.getCurrentUser();
            console.log("User: ", $scope.user);
        };
        $scope.init();
    });