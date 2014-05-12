//------------------------------------------------------------------------------
// color picker update directive
// モーダル画面で使用するためのカラーピッカーディレクティブ
// 主に更新用のモーダル画面で使用されることを想定したものになる
// JQUERY PLUGIN COLOR PICKERを使用したものになるため利用する画面では
// 読み込んでおくこと http://www.eyecon.ro/colorpicker/
//------------------------------------------------------------------------------
var myApp = angular.module('myApp');
myApp.directive('colorUpdateDirective', function(){
    return {
        restrict:"AE",
        replace: true,
        template : '<div id="colorSelectorUpdate" class="color-selector" ><div style="background-color: #fff"></div></div>',
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
                    $('#colorSelectorUpdate div').css('backgroundColor', '#' + hex);
                    scope.modalParam.updateColor = hex;
                },
            });
            //modal画面は固有パラメータをmodalParamで受け渡ししている
            $('#colorSelectorUpdate div').css('backgroundColor', '#'+scope.modalParam.updateColor);
        },
    };
});