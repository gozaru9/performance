var myApp = angular.module('myApp');
/**
 * 2つの値が合致しているかをチェックする
 * @authorn niikawa
 */
myApp.directive('match', ["$parse", function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) 
        {
            scope.$watch(function() 
            {
                var target = $parse(attrs.match)(scope);
                return !ctrl.$modelValue || target === ctrl.$modelValue;
            }, 
            function(currentValue) {
                
                if (!currentValue)
                {
                    element.addClass("error");
                }
                else
                {
                    element.removeClass("error");
                }
                
                ctrl.$setValidity('mismatch', currentValue);
            });
        }
  };
}]);
