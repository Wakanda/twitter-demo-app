/**
 * Created by msavy on 23/02/15.
 */

'use strict';

angular.module('twitter').
    service('AuthenticationService',
    function ($wakanda, $q, $localStorage, $rootScope) {
        this.isLoggedIn = function () {
            return $localStorage.user !== undefined && $localStorage.user !== null;
        };

        this.register = function (login, password, email, description) {
            var defered = $q.defer();

            $wakanda.init().then(
                function (ds) {

                    var cleanUser = ds.User.register({
                        login: login,
                        password: password,
                        email: email,
                        description: description,
                        cleanName: login
                    });

                    if (!cleanUser.error) {
                        console.log('New user saved', cleanUser);
                        saveUserInLocalStorage(cleanUser);
                        defered.resolve(cleanUser);
                    }
                    else {
                        console.error('Error while saving user', cleanUser.message);
                        defered.reject(cleanUser.message);
                    }

                },
                function () {
                    console.error('Error while loading datastore');
                });

            return defered.promise;
        };

        this.login = function (login, password) {
            var defered = $q.defer();
            $wakanda.init().then(
                function (ds) {

                    var user = ds.User.performLogin(login, password);
                    if (!user.error) {
                        saveUserInLocalStorage(user);
                        defered.resolve(user);
                    }
                    else
                        defered.reject(user.message);
                },
                function () {
                    console.error('Error while loading datastore');
                });
            return defered.promise;
        };

        this.logout = function () {
            $wakanda.init().then(
                function (ds) {
                    ds.User.performLogout();
                }
            );
            deleteUserInLocalStorage();
        };

        this.getCurrentUser = function () {
            return $localStorage.user;
        };

        function deleteUserInLocalStorage() {
            delete $localStorage.user;
        }

        function saveUserInLocalStorage(user) {
            $localStorage.user = user;
        }
    }
);