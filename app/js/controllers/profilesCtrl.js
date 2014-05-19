var profilesCtrl = angular.module('profilesCtrl',['UesrServices', 'ModalService']);

profilesCtrl.controller('ProfilesCtrl', ['$scope', 'User', 'Utility', 'Modal' ,
    function($scope, User, Utility, Modal) {
    
    $scope.initialize = function() {
        
        $scope.tabStatus = {profile: true};
    };
    
}]);

profilesCtrl.controller('ProfilesSkillsCtrl', ['$scope', 'User', 'Utility', 'Modal' ,
    function($scope, User, Utility, Modal) {
    
    $scope.initialize = function() {
        
        $scope.tabStatus = {skills: true};
        $scope.skillList = [];
        User.getResource('skill').get({}, function(data) {
            
            if (data.status) {
                
                console.log(data.items.skillList);
                $scope.skillList = data.items.skillList;
                
            } else {
                
                Utility.errorSticky(data.message);
            }
            
        });
        
    };
    
    $scope.isDisabled = function(parent, child) {
        
        $scope.skillList[parent].skills[child].disabled = !$scope.skillList[parent].skills[child].disabled;
        $scope.skillList[parent].skills[child].numberOfYear = 0;
    };
    
    
    $scope.submit = function() {
        
        console.log($scope.skillList);
    };
    
}]);

profilesCtrl.controller('ProfilesResumeCtrl', ['$scope', 'User', 'Utility', 'Modal' ,
    function($scope, User, Utility, Modal) {
    
    $scope.initialize = function() {
        
        $scope.tabStatus = {resume: true};
    };
    
}]);

profilesCtrl.controller('ProfilesCertificatesCtrl', ['$scope', 'User', 'Utility', 'Modal' ,
    function($scope, User, Utility, Modal) {
    
    $scope.initialize = function() {
        
        $scope.tabStatus = {certificates: true};
    };
    
}]);
