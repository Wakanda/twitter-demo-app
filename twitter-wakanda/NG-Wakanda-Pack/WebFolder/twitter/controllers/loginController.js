/**
 * Created by msavy on 23/02/15.
 */
'use strict';

angular.module('twitter').
    controller('LoginController',
    function ($scope, AuthenticationService) {
        AuthenticationService.register('mathieu', 'piko');
    });