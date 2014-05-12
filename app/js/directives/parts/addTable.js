//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
var myApp = angular.module('myApp');
myApp.directive('addTable', function(){
    return {
        restrict:"E",
        replace: true,
        template : '<div id="colorSelector" class="color-selector" ><div style="background-color: #fff"></div></div>',
        link: function(scope, element, attr) {
            element.ColorPicker({
                color: '#0000ff',
                onShow: function (colpkr) {
                    $(colpkr).fadeIn(500);
                    return false;
                },
                onHide: function (colpkr) {
                    $(colpkr).fadeOut(500);
                    return false;
                },
                onChange: function (hsb, hex, rgb) {
                    $('#colorSelector div').css('backgroundColor', '#' + hex);
                    scope.color = hex;
                },
            });
        },
    };
});