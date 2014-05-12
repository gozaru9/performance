var authServices = angular.module("AuthServices", ["ngResource"]);
authServices.factory("Auth", ['$resource', '$http', '$location', 'Utility',
    function($resource, $http, $location, Utility) {
        
        var getResource = function(){
            
            return $resource('api/auth');
        };
        var login = function(data) {
            
            $http.post('api/login', {mailAddress: data.mailAddress, password: data.password
            }).success(function(data){
                
                console.log('su');
                location.herf = '/';
//                $location.path('/');

            }).error(function(data) {
                
                Utility.errorSticky(data);
            });
        };
        return {
                getResource: getResource,
                login: login,
            };
    }
]);
