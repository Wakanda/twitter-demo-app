angular.module('step5', ['wakanda']);

function Controller($scope, $wakanda) {

    // Create a proxy of the server model
    $wakanda.init().then(function oninit(ds) {
 
        // feed the angular scope with the stored data of the Country DataClass
        $scope.countries = ds.Country.$find();

    });

    // manage when a country is choosen
    $scope.$watch('country', function fetchRelatedCompanies(country) {
        if (!country) return;
        // get companies related to current country
        country.companies.$fetch();
    });

}