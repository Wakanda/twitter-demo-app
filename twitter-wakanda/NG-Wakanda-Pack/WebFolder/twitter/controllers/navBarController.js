/**
 * Created by msavy on 24/02/15.
 */
angular.module('twitter').
    controller('NavBarController',
    function ($scope, AuthenticationService, $state, $rootScope) {

        $scope.performLogout = function () {
            AuthenticationService.logout();
            $rootScope.loggedIn = false;
            $state.go('login');
        };
    });