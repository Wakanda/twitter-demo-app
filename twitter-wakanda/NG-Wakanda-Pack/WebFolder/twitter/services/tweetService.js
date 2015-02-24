'use strict';

angular.module('twitter').
    service('TweetService',
    function ($wakanda, $q, AuthenticationService) {

        this.post = function (text) {
            var defered = $q.defer();

            $wakanda.init().then(function (ds) {
                var user = AuthenticationService.getCurrentUser();
                var tweet = ds.Tweet.post(text, user);
                console.log(tweet);

            });

            return defered.promise;
        }
    }
);