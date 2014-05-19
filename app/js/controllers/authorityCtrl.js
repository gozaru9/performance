var authorityCtrl = angular.module('authorityCtrl',['AuthServices']);
authorityCtrl.controller('AuthorityCtrl', ['$scope', 'Auth', 'Utility',
    function($scope, Auth, Utility, Modal) {
    
    $scope.initialize = function() {
        
        $scope.isCollapsed = false;
        $scope.data = {};
    };
    
    $scope.submit = function() {
        
        //Auth.login($scope.data);
    };
    
}]);
