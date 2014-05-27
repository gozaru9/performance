var profilesCtrl = angular.module('profilesCtrl',['UesrServices', 'ProjectServices','ModalService']);

profilesCtrl.controller('ProfilesCtrl', ['$scope', 'User', 'Utility', 'Modal' ,
    function($scope, User, Utility, Modal) {
    
    $scope.initialize = function() {
        
        $scope.tabStatus = {profile: true};
        $scope.radarChartData = [];
        User.getResource('skill').get({}, function(data) {
            
            if (data.status) {
                //レーダーチャート用にデータを整形する
                var targetList = data.items.skillList;
                var categoryNum = data.items.skillList.length;
                for (var cIndex=0; cIndex < categoryNum; cIndex++)
                {
                    var labelList = [];
                    var datalList = [];
                    var skillNum = targetList[cIndex].skills.length;
                    for (var sIndex=0; sIndex < skillNum; sIndex++)
                    {
                        labelList.push(targetList[cIndex].skills[sIndex].name);
                        datalList.push(targetList[cIndex].skills[sIndex].numberOfYear);
                    }
                    var setData = [];
                    setData.push(datalList);
                    $scope.radarChartData.push({label:labelList, data:setData});
                }

            } else {
                
                Utility.errorSticky(data.message);
            }
        });
        
    };
    
}]);

profilesCtrl.controller('ProfilesSkillsCtrl', ['$scope', 'User', 'Utility', 'Modal' ,
    function($scope, User, Utility, Modal) {
    
    $scope.initialize = function() {
        
        $scope.tabStatus = {skills: true};
        $scope.skillList = [];
        User.getResource('skill').get({}, function(data) {
            
            if (data.status) {
                
                $scope.skillList = data.items.skillList;
                
            } else {
                
                Utility.errorSticky(data.message);
            }
        });
    };
    
    $scope.isDisabled = function(parent, child) {
        
        $scope.skillList[parent].skills[child].numberOfYear = 0;
    };

    $scope.submit = function() {
        
        var submitInfo = User.createSkillSubmitInfo($scope.skillList);
        var resource = User.getResource('skill');
        var user = new resource(
            {
                skill: submitInfo.skillData
                , skillNameList: submitInfo.skillNameList
            });
        user.$save(function(data) {
            
            if (data.status) {
                
                Utility.success(data.message);

            } else {
                
                Utility.errorSticky(data.message);
            }
        });
    };
    
}]);

profilesCtrl.controller('ProfilesResumeCtrl', ['$scope', 'User', 'Project','Utility', 'Modal' ,
    function($scope, User, Project, Utility, Modal) {
    
    $scope.initialize = function() {
        
        $scope.tabStatus = {resume: true};
        $scope.projectList = [];
        Project.getResource('mine').get({}, function(data) {
            
        });
    };
    
}]);

profilesCtrl.controller('ProfilesCertificatesCtrl', ['$scope', 'User', 'Utility', 'Modal' ,
    function($scope, User, Utility, Modal) {
    
    $scope.initialize = function() {
        
        $scope.tabStatus = {certificates: true};
    };
    
}]);
