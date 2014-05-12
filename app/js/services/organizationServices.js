var organizationServices = angular.module("OrganizationServices", ["ngResource"]);
organizationServices.factory("Organization", ['$resource',
    function($resource) {
        
        var getResource = function(){
            
            return $resource('api/organization/:id', {'id': '@_id'});
        };
        return {getResource: getResource};
    }
]);
