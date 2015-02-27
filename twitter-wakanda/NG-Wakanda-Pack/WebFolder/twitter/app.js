var app = angular.module('twitter', [
    'wakanda',
    'ui.router',
    'ui.bootstrap',
    'ngStorage',
    'xeditable',
    'ngRoute',
    'linkify'
]);

app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', { // This is the default Home when user isn't logged in yet
                url: '/',
                templateUrl: 'views/stream-loggedin.html',
                controller: 'HomeController',
                resolve: {},
                authenticate: true
            });
        $stateProvider
            .state('login', { // This is the Home displayed to registered and logged in users
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginController',
                resolve: {},
                authenticate: false
            });
        $stateProvider
            .state('profile', {
                url: '/profile/:userId',
                templateUrl: 'views/user-profile.html',
                controller: 'ProfileController',
                resolve: {},
                authenticate: true
            });
        $stateProvider
            .state('nprofile', {
                url: '/nprofile/:username',
                templateUrl: 'views/user-profile.html',
                controller: 'ProfileController',
                resolve: {},
                authenticate: true
            });
        $stateProvider
            .state('followers', {
                url: '/list/:type/:userId',
                templateUrl: 'views/user-list.html',
                controller: 'FollowDisplayController',
                resolve: {},
                authenticate: true
            });
        $stateProvider
            .state('following', {
                url: '/list/:type/:userId',
                templateUrl: 'views/user-list.html',
                controller: 'FollowDisplayController',
                resolve: {},
                authenticate: true
            });
        $stateProvider
            .state('404', {
                url: '/notfound',
                templateUrl: 'views/404.html',
                resolve: {},
                authenticate: false
            });
        $stateProvider
            .state('search', {
                url: '/search?query',
                templateUrl: 'views/search.html',
                controller: 'SearchController',
                resolve: {},
                authenticate: true
        });
    }]);

app.run(function ($rootScope, $state, AuthenticationService, editableOptions) {

    editableOptions.theme = 'bs3';

    $rootScope.$on("$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !AuthenticationService.isLoggedIn()) {
                $state.go("login");
                event.preventDefault();
            }
        });

    $rootScope.loggedIn = AuthenticationService.isLoggedIn();
});