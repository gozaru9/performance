var datepickerServices = angular.module("DatepickerServices", []);
datepickerServices.service("Datepicker", [
    function() {
        
        var init = function($scope) {
          
            $scope.showWeeks = true;
            $scope.minDate = ( $scope.minDate ) ? null : new Date();
            $scope.dateOptions = {
            'year-format': "'yyyy'",
            'starting-day': 1
            };
            $scope.format = 'yyyy/MM/dd';    
            
        };
        
        var open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            return true;
        };
        
        var clear = function () {
            return null;
        };
        
        var disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };
        
        return {init:init, open: open, clear: clear, disabled: disabled};
    }]
);