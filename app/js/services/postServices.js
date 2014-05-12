var postTypeServices = angular.module("PostTypeServices", ["ngResource"]);
postTypeServices.factory("PostsType", ['$resource',
    function($resource) {
        
        var getResource = function() {
            
            return $resource('api/posts/:id', {'id': '@_id'});
        };
        return {getResource: getResource};
    }
]);