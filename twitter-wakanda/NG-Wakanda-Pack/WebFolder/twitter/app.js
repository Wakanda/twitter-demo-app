var app = angular.module('twitter', [
    'wakanda',
    'ui.router',
    'ui.bootstrap'
]);

app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'HomeController',
                resolve: {},
                authenticate: true
            });
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginController',
                resolve: {},
                authenticate: false
            });
    }]);

app.run(function ($rootScope, $state, AuthenticationService) {

    $rootScope.$on("$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !AuthenticationService.isLoggedIn()) {
                $state.go("login");
                event.preventDefault();
            }
        });

    $rootScope.loggedIn = AuthenticationService.isLoggedIn();
});