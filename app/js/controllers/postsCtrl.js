var postsCtrl = angular.module('postsCtrl',['PostTypeServices', 'ModalService']);
postsCtrl.controller('PostsCtrl', ['$scope', 'PostsType', 'Utility', 'Modal' ,
    function($scope, PostsType, Utility, Modal) {
    
    var resource = PostsType.getResource();
    $scope.postsList = [];

    $scope.initialize = function() {
        
        resource.get({}, function(data){
            
            if (data.status) {
                
                $scope.postsList = data.itemList;
                //変更された場合等に別のコントローラーとデータを共有させる
                //$rootScope.$broadcast('categoryListBroadcast', data.itemList);
                
            } else {
                
                Utility.errorSticky('データの取得に失敗しました');
            }
        });
    };
    
    $scope.create = function(name, description) {

        var posts = new resource({name:name, description: description});
        posts.$save(function(data) {
            
            $scope.postName = '';
            $scope.description = '';
            if (data.status) {
                
                $scope.postsList.push(data.item);
                Utility.success('登録しました');

            } else {
                
                Utility.errorSticky(data.messages);
            }
        });
    };
    
    $scope.popupView = function(id, index) {
        $scope.updateid = id;
        $scope.targetindex = index;
        //modal用のデータを生成
        $scope.modalParam = 
            {
                header:'役職名を変更します', 
                initValue1:$scope.postsList[index].name,
                initValue2:$scope.postsList[index].description,
            };
        $scope.modalInstance = Modal.open($scope, "partials/modal/updateTwoItemModal.html");
    };

    $scope.update = function() {
        
        //データの更新を行う
        var posts = new resource(
            {
                _id:$scope.updateid, 
                name: $scope.modalParam.initValue1, 
                description: $scope.modalParam.initValue2
            });
        posts.$save(function(data) {
            
            if (data.status) {
                
                $scope.postsList[$scope.targetindex] = data.item;
                Utility.success('更新しました');
                
                //モーダルを閉じる
                $scope.modalInstance.close();

            } else {

                Utility.errorSticky(data.messages);
            }
        });
    };

    $scope.delete = function(id, index) {
        
        resource.remove({_id:id}, function(data){
            
            if (data.status) {

                $scope.postsList.splice(index, 1);
                Utility.success('削除しました');
                
            } else {
                
                Utility.errorSticky('削除に失敗しました');
            }
        });
    };
}]);
