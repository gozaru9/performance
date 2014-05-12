var myApp = angular.module('myApp',['AuthServices']);
myApp.controller('LoginCtrl', ['$scope', 'Auth', 'Utility',
    function($scope, Auth, Utility, Modal) {
    
    $scope.data = {mailAddress:'', password:'', remember:false};
    $scope.submit = function() {
        
        Auth.login($scope.data);
    };
    
}]);
