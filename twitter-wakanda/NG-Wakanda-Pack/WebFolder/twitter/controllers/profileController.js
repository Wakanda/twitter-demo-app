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
            console.log('CleanName updated');
            var localCurrentUser = AuthenticationService.getCurrentUser();
            localCurrentUser.cleanName = $scope.user.cleanName;
            AuthenticationService.updateUser($scope.user.cleanName, null);
        });

        $scope.$watch('user.description', function() {
            var localCurrentUser = AuthenticationService.getCurrentUser();
            localCurrentUser.description = $scope.user.description;
            AuthenticationService.updateUser(null, $scope.user.description);
        });
    });