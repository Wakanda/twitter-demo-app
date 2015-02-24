/**
 * Created by msavy on 23/02/15.
 */

'use strict';

angular.module('twitter').
    service('AuthenticationService',
    function ($wakanda, $q, $localStorage) {
        this.isLoggedIn = function () {
            return $localStorage.user !== undefined && $localStorage.user !== null;
        };

        this.register = function (login, password, email, description) {
            var defered = $q.defer();

            $wakanda.init().then(
                function (ds) {

                    var user = ds.User.$create({
                        login: login,
                        password: password,
                        email: email,
                        description: description,
                        cleanName: login
                    });

                    user.$save().then(
                        function (data) {
                            console.log('New user saved', data, user);
                            saveUserInLocalStorage(user);
                            defered.resolve(user); //FIXME - we need user id and setting currentUser in session wakanda side
                        },
                        function (data) {
                            console.error('Error while saving user', data);
                            defered.reject(data);
                        }
                    );
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
            $rootScope.loggedIn = false;
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