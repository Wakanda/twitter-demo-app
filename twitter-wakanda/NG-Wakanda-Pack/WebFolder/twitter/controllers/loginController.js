/**
 * Created by msavy on 23/02/15.
 */
'use strict';

angular.module('twitter').
    controller('LoginController',
    function ($scope, AuthenticationService) {

        //AuthenticationService.register('mathieu', 'piko');
        AuthenticationService.login('mathieu', 'piko').then(
            function (user) {
                console.log(user)
            },
            function (errorMessage) {
                console.error(errorMessage);
            });
    });