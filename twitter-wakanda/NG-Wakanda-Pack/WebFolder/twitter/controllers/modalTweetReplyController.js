angular.module('twitter').
    controller('ModalTweetReplyController',
    function($scope, $modalInstance, AuthenticationService, tweet) {
        $scope.originalTweet = tweet;
        $scope.reply = {};

        $scope.init = function() {
            console.log("Original: ", $scope.originalTweet);
            $scope.reply.text = "@" + $scope.originalTweet.author.login + " ";
        };
        $scope.init();

        $scope.ok = function() {
            $modalInstance.close($scope.reply)
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });