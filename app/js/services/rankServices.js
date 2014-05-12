var rankServices = angular.module("RankServices", ["ngResource"]);
rankServices.factory("Rank", ['$resource',
    function($resource) {
        
        var getResource = function() {
            
            return $resource('api/rank/:id', {'id': '@_id'});
        };
        return {getResource: getResource};
    }
]);