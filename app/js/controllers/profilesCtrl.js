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
        $scope.skillCheckList = [];
        $scope.skillSetList = [];
        User.getResource('skill').get({}, function(data) {
            
            if (data.status) {
                
                console.log(data.items.skillList);
                $scope.skillList = data.items.skillList;
                
            } else {
                
                Utility.errorSticky(data.message);
            }
            
        });
        
    };
    
    $scope.submit = function() {
        
        console.log($scope.skillCheckList);
        console.log($scope.skillSetList);
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
