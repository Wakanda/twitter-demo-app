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

        this.updateUser = function (cleanName, description) {
            $wakanda.init().then(
                function (ds) {
                    var user = $localStorage.user;
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
            var defered = $q.defer();
            $wakanda.init().then(
                function (ds) {
                    var query = ds.User.find("ID == :1", {
                        onSuccess: function(event) {
                            var user = event.entity;

                            var cleanUser = {
                                id: userId,
                                login: user.login.getValue(),
                                email: user.email.getValue(),
                                cleanName: user.cleanName.getValue(),
                                description: user.description.getValue()
                            };
                            console.log('User asked is: ', cleanUser);
                            defered.resolve(cleanUser);
                        }, params:[parseInt(userId)]});
                }, function(error) {
                    console.log('Error: ', error);
                    defered.reject(error);
                }
            );
            return defered.promise;
        };

        this.updateProfilePicture = function(file) {
            console.log("File: ", file);
            var defered = $q.defer();
            $wakanda.init().then(
                function (ds) {
                    var query = ds.User.find("ID == :1", {
                        onSuccess: function(event) {
                            var user = event.entity;
                            console.log("Current pp: ", user);
                            user.profilePicture.$upload(file).then(function() {
                                console.log("Upload success");
                            }, function(error) {
                                console.log("Upload failure: ", error);
                            });
                            defered.resolve();
                        }, params:[$localStorage.user.id]});
                }, function(error) {
                    console.log('Error: ', error);
                    defered.reject(error);
                }
            );
            return defered.promise;
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