var profilesCtrl = angular.module('profilesCtrl',['UesrServices', 'ModalService']);
profilesCtrl.controller('ProfilesCtrl', ['$scope', 'User', 'Utility', 'Modal' ,
    function($scope, User, Utility, Modal) {
    
    var resource = User.getResource();
    $scope.profilesList = [];
    
    $scope.initialize = function() {
        
        resource.get({}, function(data){
            
            if (data.status) {
                
                $scope.profilesList = data.itemList;
                //変更された場合等に別のコントローラーとデータを共有させる
                //$rootScope.$broadcast('categoryListBroadcast', data.itemList);
                
            } else {
                
                Utility.errorSticky('データの取得に失敗しました');
            }
        });
    };
    
    $scope.create = function(name, description) {

        var profiles = new resource({name:name, description: description});
        profiles.$save(function(data) {
            
            $scope.teamName = '';
            $scope.description = '';
            if (data.status) {
                
                $scope.profilesList.push(data.item);
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
                header:'プロジェクトを変更します', 
                initValue1:$scope.profilesList[index].name,
                initValue2:$scope.profilesList[index].description,
            };
        $scope.modalInstance = Modal.open($scope, "partials/modal/updateTwoItemModal.html");
    };

    $scope.update = function() {
        
        //データの更新を行う
        var profiles = new resource(
            {
                _id:$scope.updateid, 
                name: $scope.modalParam.initValue1, 
                description: $scope.modalParam.initValue2
            });
        profiles.$save(function(data) {
            
            if (data.status) {
                
                $scope.profilesList[$scope.targetindex] = data.item;
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

                $scope.profilesList.splice(index, 1);
                Utility.success('削除しました');
                
            } else {
                
                Utility.errorSticky('削除に失敗しました');
            }
        });
    };
}]);
