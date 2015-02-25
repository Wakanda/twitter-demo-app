/**
 * Created by msavy on 23/02/15.
 */

'use strict';

angular.module('twitter').
    controller('HomeController',
    function ($scope, TweetService) {
        $scope.toto = 'Bonjour !';

        //TweetService.post("hello there !");
        var data = TweetService.userHomeFeed().then(function (data) {
            console.log('user home feed success', data);
        });
    });