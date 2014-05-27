var projectServices = angular.module("ProjectServices", ["ngResource"]);
projectServices.factory("Project", ['$resource',
    function($resource) {
        
        var getResource = function(type) {
            
            if (type === 'mine') {
                
                return $resource('api/project/mypoject');
                
            } else {
                
                return $resource('api/project/:id', {'id': '@_id'});
            }
        };
        return {getResource: getResource};
    }
]);