/**
 * Created by msavy on 23/02/15.
 */
'use strict';

angular.module('twitter').
    controller('LoginController',
    function ($scope, AuthenticationService, $state) {

        $scope.login = {};
        $scope.newUser = {};
        $scope.loginError = null;
        $scope.registerError = null;

        $scope.performLogin = function () {
            if ($scope.login.username && $scope.login.password) {
                AuthenticationService.login($scope.login.username, $scope.login.password).then(
                    function (user) {
                        console.log(user);
                        $state.go('home');
                    },
                    function (errorMessage) {
                        $scope.loginError = errorMessage;
                    });
            }
            else {
                $scope.loginError = "Enter your username and password";
            }
        };

        $scope.cancelLogin = function () {
            $scope.login = {};
        };

        $scope.performRegister = function () {
            if ($scope.newUser.username && $scope.newUser.email &&
                $scope.newUser.passwordFirstCheck && $scope.newUser.passwordSecondCheck) {

                AuthenticationService.register($scope.newUser.username,
                    $scope.newUser.passwordFirstCheck, $scope.newUser.email, $scope.newUser.description)
                    .then(function (user) {
                        $state.go('home');
                    },
                    function (errorMessage) {
                        $scope.registerError = errorMessage;
                    });
            }
            else {
                $scope.registerError = "Please fill username, email and password fields";
            }
        };

        $scope.cancelRegister = function () {
            $scope.newUser = {};
        };

        //AuthenticationService.register('mathieu', 'piko');
    }
)
;