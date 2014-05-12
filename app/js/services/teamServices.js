var teamServices = angular.module("TeamServices", ["ngResource"]);
teamServices.factory("Team", ['$resource',
    function($resource) {
        
        var getResource = function() {
            
            return $resource('api/team/:id', {'id': '@_id'});
        };
        return {getResource: getResource};
    }
]);