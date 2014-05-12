var skillServices = angular.module("SkillServices", ["ngResource"]);
skillServices.factory("Skill", ['$resource',
    function($resource){
        return $resource('api/skill/:id', {'id': '@_id'});
    }
]);
skillServices.factory("SkillCategory", ['$resource',
    function($resource){
        return $resource('api/skillCategory/:id',{'id': '@_id'});
    }
]);