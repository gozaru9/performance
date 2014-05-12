var tagServices = angular.module("TagServices", ["ngResource"]);
tagServices.factory("Tag", ['$resource',
    function($resource) {
        
        var getResource = function() {
            
            return $resource('api/tag/:id', {'id': '@_id'});
        };
        return {getResource: getResource};
    }
]);