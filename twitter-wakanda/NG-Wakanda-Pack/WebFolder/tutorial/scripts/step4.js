angular.module('step4', ['wakanda'])

.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});

function Controller($scope, $wakanda) {

    // Create a proxy of the server model
    $wakanda.init().then(function oninit(ds) {
 
        // once ready use the datastore on the $scope
        // feed the angular scope 
        // with the stored data of the Employee DataClass
        $scope.employees = ds.Employee.$find();
    });

}