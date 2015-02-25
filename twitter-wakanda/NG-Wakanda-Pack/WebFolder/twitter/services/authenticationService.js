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
                            var cleanUser = {
                                id: user.ID,
                                login: user.login,
                                email: user.email,
                                cleanName: user.cleanName,
                                description: user.description
                            };

                            ds.User.registerInSession(user);
                            saveUserInLocalStorage(cleanUser);
                            defered.resolve(cleanUser);
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

        this.updateUser = function (cleanName, description) {
            $wakanda.init().then(
                function (ds) {
                    var user = $localStorage.user;
                    console.log('User active: ', user);
                    ds.User.performProfileUpdate(user, null, null, description, cleanName);
                }
            );
        };

        this.logout = function () {
            $wakanda.init().then(
                function (ds) {
                    ds.User.performLogout();
                }
            );
            deleteUserInLocalStorage();
        };

        this.getUserWithId = function(userId) {
            console.log('UserId: ' + userId);
            $wakanda.init().then(
                function (ds) {
                    var user = ds.User.$findOne(3);
                    console.log('User: ', user);

                    var cleanUser = {
                        id: user.ID,
                        login: user.login,
                        email: user.email,
                        cleanName: user.cleanName,
                        description: user.description
                    };
                    console.log('User asked is: ', cleanUser);
                    return cleanUser;
                }, function(error) {
                    console.log('Error: ', error);
                }
            );
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