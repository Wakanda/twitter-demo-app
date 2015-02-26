'use strict';

angular.module('twitter').
    service('TweetService',
    function ($wakanda, $q, AuthenticationService) {

        this.post = function (text) {
            var defered = $q.defer();

            $wakanda.init().then(function (ds) {
                var user = AuthenticationService.getCurrentUser();
                var tweet = ds.Tweet.post(text, user);
                defered.resolve(tweet);
            });

            return defered.promise;
        };

        this.userHomeFeed = function () {
            var defered = $q.defer();

            $wakanda.init().then(function (ds) {
                    var user = AuthenticationService.getCurrentUser();
                    var tweets = ds.Tweet.homeTweetFeed(user);
                    defered.resolve(tweets);
                },
                function () {
                    defered.reject();
                });

            return defered.promise;
        };

        this.profileTweetFeed = function (userId) {
            var defered = $q.defer();

            $wakanda.init().then(function (ds) {
                userId = parseInt(userId);
                var tweets = ds.Tweet.profileTweetFeed(userId);

                if (tweets.error)
                    defered.reject(tweets.message);
                else
                    defered.resolve(tweets);
            });

            return defered.promise;
        };
    }
);