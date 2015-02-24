angular.module('Contact', ['wakanda'])

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

function Controller($scope, $wakanda) {
    
    SCOPE = $scope;

    $scope.panels = ['Groups', 'Contacts', 'Contact infos', 'Edit Contact'];
    $scope.panel = 0;    

    $scope.back = function back() {
        $scope.panel -= 1;
    };

    $scope.next = function next() {
        $scope.panel += 1;
    };

	$wakanda.init('Group,Contact').then(function oninit(ds) {


        $scope.groups = ds.Group.$find();
        
        $scope.createGroup = function createGroup() {
            var group, name;
            var name = prompt("Choose the name of your new group");
            if (name) {
                group = ds.Group.$create({name: name});
                group.$save().then(function (event) {
                    $scope.groups.push(group);
                });
            }
        };

        // Select an entity from a row
        $scope.setCurrent = function setCurrent(name, value) {
            $scope[name] = value;
            $scope.next();
        };

        $scope.$watch('group', function (group) {
            if (!group) {
                $scope.contacts = ds.Contact.$find();
            } else {
                //$scope.contacts = group.contacts;
                group.contacts.$fetch();
            }
        });
        
        $scope.$watchCollection('contacts[0]', function (contact) {
            if ($scope.panel < 3) {
                $scope.contact = null;
            }
        });
        
        $scope.$watch('contact', function (contact) {
            if (!contact) return;
            contact.groupName = contact.$_entity.groupName.value; // TMP HACK
            //contact.group.$fetch();
        });
        
        $scope.saveContact = function saveContact() {
            $scope.contact.$save();
            // if new, add to list
            var contacts = $scope.group.contacts;
            if (contacts.indexOf($scope.contact) === -1) {
                contacts.push($scope.contact);
            }
            $scope.back();
        };
        
        $scope.addContact = function addContact(contact) {
            $scope.contact = ds.Contact.$create({group: $scope.group});
            $scope.panel = 3;
        };

	});
}