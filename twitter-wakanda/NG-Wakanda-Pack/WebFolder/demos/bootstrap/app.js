angular.module('PlayAngular', ['wakanda'])

// Snippet from Vojta Jina: http://jsfiddle.net/vojtajina/U7Bz9/
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


function PlayController($scope, $wakanda) {
	$wakanda.init('Country,Company,Employee').then(function oninit(ds) {
	    playControllerReady($scope, ds);
	});
}


function playControllerReady($scope, ds) {
    
    var ready = false;

    $scope.allCountries = ds.Country.$find();
    
    $scope.countries = $scope.allCountries;

    $scope.$watchCollection('countries[0]', function (country) {
        $scope.country = country;
    });


    $scope.$watch('country', function (country) {
        if (!country) {
            return;
        }
        // copy to a dedicated collection to allow dedicated filter
        $scope.companies = country.companies;
        country.companies.$fetch();
    });


    $scope.$watchCollection('companies[0]', function (company) {
        $scope.company = company;
    });

/*
    $scope.$watch('company', function (company) {
        if (!company) {
            return;
        }
        // copy to a dedicated collection to allow dedicated filter
        $scope.employees = company.employees;
        company.employees.$fetch();
    });
*/
  
    // TMP HACK
    $scope.$watch('company', function (company) {
        if (!company) {
            return;
        }
        
        company.employees = ds.Employee.$find({filter: 'company.ID = ' + company.ID});
        $scope.employees = company.employees;
    });

    $scope.$watchCollection('employees[0]', function (employee) {
        $scope.employee = employee;
    });

    // Select an entity from a row
    $scope.setCurrent = function setCurrent(name, value) {
        $scope[name] = value;
    };
    
    // Filter a list
    $scope.setFilter = function setFilter(target, source, attr) {

        $scope[target] = source.$find(attr + ' = "' + source._filter + '*"');

    };
    
    // TMP HACK
    $scope.setFilter = function setFilter(collection, dataclass, attr, parent) {
        var value, filters, options;
        
        value = $scope[collection]._filter;
        
        filters = [];
        if (value) {
            filters.push(attr + ' = "' + value + '*"');
        }
        if (parent) {
            filters.push(parent + '.ID = ' + $scope[parent].ID);
        }

        options = filters.length ? {filter: filters.join(' AND ')} : {};
        $scope[collection] = ds[dataclass].$find(options);
        $scope[collection]._filter = value;
    };
    
    
}