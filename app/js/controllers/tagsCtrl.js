var tagsCtrl = angular.module('tagsCtrl',['TagServices', 'ModalService']);
tagsCtrl.controller('TagsCtrl', ['$scope', 'Tag', 'Utility', 'Modal' ,
    function($scope, Tag, Utility, Modal) {
    
    var resource = Tag.getResource();
    $scope.tagsList = [];

    $scope.initialize = function() {
        
        resource.get({}, function(data){
            
            if (data.status) {
                
                $scope.tagsList = data.itemList;
                //変更された場合等に別のコントローラーとデータを共有させる
                //$rootScope.$broadcast('categoryListBroadcast', data.itemList);
                
            } else {
                
                Utility.errorSticky('データの取得に失敗しました');
            }
        });
    };
    
    $scope.create = function(name, description) {
        var tags = new resource({name:name, description: description, color: $scope.color});
        tags.$save(function(data) {
            
            $scope.postName = '';
            $scope.description = '';
            if (data.status) {
                
                $scope.tagsList.push(data.item);
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
                header:'タグを変更します', 
                initValue1:$scope.tagsList[index].name,
                initValue2:$scope.tagsList[index].description,
                updateColor:$scope.tagsList[index].color,
            };
        $scope.modalInstance = Modal.open($scope, "partials/modal/updateColorItemModal.html");
    };

    $scope.update = function() {
        
        var data = 
            {
                _id: $scope.updateid, 
                name: $scope.modalParam.initValue1,
                description: $scope.modalParam.initValue2,
                color: $scope.modalParam.updateColor
            };
        
        //データの更新を行う
        var tags = new resource(data);
        tags.$save(function(data) {
            
            $scope.tagName = '';
            $scope.description = '';
            if (data.status) {
                
                $scope.tagsList[$scope.targetindex] = data.item;
                Utility.success('更新しました');
                
                //モーダルを閉じる
                $scope.modalInstance.close();

            } else {

                Utility.errorSticky(data.message);
            }
        });
    };

    $scope.delete = function(id, index) {
        
        resource.remove({_id:id}, function(data){
            
            if (data.status) {

                $scope.tagsList.splice(index, 1);
                Utility.success('削除しました');
                
            } else {
                
                Utility.errorSticky('削除に失敗しました');
            }
        });
    };
}]);
