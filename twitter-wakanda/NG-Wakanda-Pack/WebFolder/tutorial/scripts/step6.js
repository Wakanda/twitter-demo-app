angular.module('step6', ['wakanda']);

function Controller($scope, $wakanda) {

    // Create a proxy of the server model
    $wakanda.init().then(function oninit(ds) {

        $scope.employees = ds.Employee.$find();

    });

}
