var myApp = angular.module('myApp');
myApp.directive('fileupload', function(){
    return {
        //http://gahhahhaa.hatenablog.com/entry/2014/03/10/002955
        restrict:"A",
        scope:{add: '&', done: '&', progress: '&'},
        link: function(scope, element, attr) {

            var options = {datType: 'json'};
            
            if (scope.add) {
                options.add = function(e, data) {
                    
                    if (e.isDefaultPrevented()) {
                        return false;
                    }
                    var filesCopy = [];
                    angular.forEach(data.files, function (file) {
                        filesCopy.push(file);
                    });
                    console.log(filesCopy);
                };
            }
            if (scope.done) {
                options.done = function(e, data) {
                    
                    console.log('done');
                    scope.$apply(function() {
                        scope.done({e: e, data: data});
                    });
                };
            }
            if (scope.progress) {
                options.progress = function(e, data) {
                    
                    console.log('progress');
                    scope.progress({e: e, data: data});
                };
            }
            
            element.fileupload(options);
        }
    };
});