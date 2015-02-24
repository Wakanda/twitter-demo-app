angular.module('step3', ['wakanda']);

function Controller($scope, $wakanda) {

    // Create a proxy of the server model
    $wakanda.init().then(function oninit(ds) {
 
        // once ready use the datastore on the $scope
        // feed the angular scope 
        // with the stored data of the Country DataClass
        $scope.countries = ds.Country.$find();
    });

}