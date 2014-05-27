var skillServices = angular.module("SkillServices", ["ngResource"]);
skillServices.factory("Skill", ['$resource',
    function($resource){
        
        var getResource = function(type) {
            
            if (type === 'belong') {
                
                return $resource('api/skill/belongto');
            } else {
                
                return $resource('api/skill/:id', {'id': '@_id'});
            }
        };
        
        return {getResource: getResource};
    }
]);
skillServices.factory("SkillCategory", ['$resource',
    function($resource){
        
        var getResource = function(type) {
            
            return $resource('api/skillCategory/:id', {'id': '@_id'});
        };
        
        return {getResource: getResource};
    }
]);