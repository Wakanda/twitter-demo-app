angular.module('step1', ['wakanda']);

function Controller($scope, $wakanda) {

    $scope.loaded = !!$wakanda ? 'loaded' : 'not loaded';

}
