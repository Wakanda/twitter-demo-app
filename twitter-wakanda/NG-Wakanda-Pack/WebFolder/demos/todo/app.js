'use strict';

angular.module('todo', ['wakanda']);

function Todo($scope, $wakanda) {
  $wakanda.init('Item').then(function (ds) {

      $scope.items = ds.Item.$find({});
        
      $scope.add = function() {
        var item = ds.Item.$create({text: $scope.newText, done: false});
        $scope.items.push(item);
        $scope.newText = '';
        item.$save();
      };

      $scope.remaining = function() {
        return $scope.items.reduce(function(count, item) {
          return item.done ? count : count + 1;
        }, 0);
      };

      $scope.archive = function() {
        $scope.items = $scope.items.filter(function(item) {
          if (item.done) {
            item.$remove();
            return false;
          }
          return true;
        });
      };

  });
}
