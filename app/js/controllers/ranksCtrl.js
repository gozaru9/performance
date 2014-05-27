var ranksCtrl = angular.module('ranksCtrl',['RankServices', 'ModalService']);
ranksCtrl.controller('RanksCtrl', ['$scope', 'Rank', 'Utility', 'Modal' ,
    function($scope, Rank, Utility, Modal) {
    
    var resource = Rank.getResource();
    $scope.ranksList = [];

    $scope.initialize = function() {
        
        resource.get({}, function(data){
            
            if (data.status) {
                
                $scope.ranksList = data.itemList;
                //変更された場合等に別のコントローラーとデータを共有させる
                //$rootScope.$broadcast('categoryListBroadcast', data.itemList);
                
            } else {
                
                Utility.errorSticky('データの取得に失敗しました');
            }
        });
    };
    
    $scope.create = function() {

        var ranks = new resource({name:$scope.rankName, description: $scope.description});
        ranks.$save(function(data) {
            
            $scope.rankName = '';
            $scope.description = '';
            if (data.status) {
                
                $scope.ranksList.push(data.item);
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
                header:'ランクを変更します', 
                initValue1:$scope.ranksList[index].name,
                initValue2:$scope.ranksList[index].description,
            };
        $scope.modalInstance = Modal.open($scope, "partials/modal/updateTwoItemModal.html");
    };

    $scope.update = function() {
        
        //データの更新を行う
        var ranks = new resource(
            {
                _id:$scope.updateid, 
                name: $scope.modalParam.initValue1, 
                description: $scope.modalParam.initValue2
            });
        ranks.$save(function(data) {
            
            if (data.status) {
                
                $scope.ranksList[$scope.targetindex] = data.item;
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

                $scope.ranksList.splice(index, 1);
                Utility.success('削除しました');
                
            } else {
                
                Utility.errorSticky('削除に失敗しました');
            }
        });
    };
}]);
