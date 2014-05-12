var projectServices = angular.module("ProjectServices", ["ngResource"]);
projectServices.factory("Project", ['$resource',
    function($resource) {
        
        var getResource = function() {
            
            return $resource('api/project/:id', {'id': '@_id'});
        };
        return {getResource: getResource};
    }
]);