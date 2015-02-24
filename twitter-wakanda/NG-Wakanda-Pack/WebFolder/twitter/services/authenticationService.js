/**
 * Created by msavy on 23/02/15.
 */

'use strict';

angular.module('twitter').
    service('AuthenticationService',
    function ($wakanda, $q) {
        this.isLoggedIn = function () {
            return false;
        };

        this.register = function (login, password) {
            $wakanda.init().then(
                function (ds) {

                    var user = ds.User.$create({
                        login: login,
                        password: password
                    });

                    user.$save().then(
                        function (data) {
                            console.log('New user saved', data, user);
                        },
                        function (data) {
                            console.error('Error while saving user', data);
                        }
                    );
                },
                function () {
                    console.error('Error while loading datastore');
                });
        };

        this.login = function (login, password) {
            var defered = $q.defer();
            $wakanda.init().then(
                function (ds) {

                    var user = ds.User.performLogin(login, password);
                    if (!user.error)
                        defered.resolve(user);
                    else
                        defered.reject(user.message);
                },
                function () {
                    console.error('Error while loading datastore');
                });
            return defered.promise;
        };
    }
);