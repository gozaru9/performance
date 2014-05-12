var usersListCtrl = angular.module('usersListCtrl',['UesrServices', 'ModalService']);
usersListCtrl.controller('UsersListCtrl', ['$scope', 'User', 'Utility', 'Modal' ,
    function($scope, User, Utility, Modal) {
    
    var resource = User.getResource();
    $scope.sort = '';
    
    //サーバーサイドの処理が完了した後に実行する処理
    function requertComplete(data) {
        
        if (data.status) {
            
            $scope.userList = data.itemList;

        } else {
            
            Utility.errorSticky(data.mesage);
        }
    }
    
    //初期処理
    $scope.initialize = function() {
        
        $scope.userList = [];
        $scope.keywords = '';
        
        User.getResource().get({}, requertComplete);
    };
    
    //keyupイベントによりキーワードエリアに入力された内容で検索をする
    $scope.search = function() {
        
        if ('' === $scope.keywords) {
            
            User.getResource().get({}, requertComplete);

        } else {
            
            User.getResource('keyword').get({q: $scope.keywords}, requertComplete);
            
        }
    };
    
    $scope.popupView = function(id, index) {

        //modal用のデータを生成
        $scope.modalParam = $scope.userList[index];
        $scope.modalInstance = Modal.open($scope, "partials/modal/viewUserModal.html");
    };
    
    //削除
    $scope.delete = function(id, index) {
        
        resource.remove({_id:id}, function(data){
            
            if (data.status) {

                $scope.userList.splice(index, 1);
                Utility.success('削除しました');
                
            } else {
                
                Utility.errorSticky('削除に失敗しました');
            }
        });
    };
}]);
