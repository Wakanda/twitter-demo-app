/**
 * Created by msavy on 23/02/15.
 */

'use strict';

angular.module('twitter').
    service('AuthenticationService',
    function ($wakanda) {
        this.isLoggedIn = function () {
            return false;
        };

        this.register = function (login, password) {
            $wakanda.init().then(
                function (ds) {
                    // use the datastore
                    console.log('Datastore loaded', ds);

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
    }
);