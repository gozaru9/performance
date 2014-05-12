var organizationsCtrl = angular.module('organizationsCtrl',['OrganizationServices', 'ModalService']);
organizationsCtrl.controller('OrganizationsCtrl', ['$scope', 'Organization', 'Utility', 'Modal' ,
    function($scope, Organization, Utility, Modal) {
    
    var resource = Organization.getResource();
    $scope.organizationList = [];
    $scope.getAll = function() {
        
        resource.get({}, function(data){
            
            if (data.status) {
                
                $scope.organizationList = data.itemList;
                //変更された場合等に別のコントローラーとデータを共有させる
                //$rootScope.$broadcast('categoryListBroadcast', data.itemList);
                
            } else {
                
                Utility.errorSticky('データの取得に失敗しました');
            }
        });
    };
    
    $scope.create = function(name) {

        var organization = new resource({name:name});
        organization.$save(function(data) {
            
            $scope.categoryName = '';
            if (data.status) {
                
                $scope.organizationList.push(data.item);
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
                header:'組織名を変更します', 
                initValue:$scope.organizationList[index].name
            };
        $scope.modalInstance = Modal.open($scope, "partials/modal/updateSimpleModal.html");
    };

    $scope.update = function(name) {
        
        //データの更新を行う
        var organization = new resource({_id:$scope.updateid, name:name});
        organization.$save(function(data) {
            
            if (data.status) {
                
                $scope.organizationList[$scope.targetindex].name = name;
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

                $scope.organizationList.splice(index, 1);
                Utility.success('削除しました');
                
            } else {
                
                Utility.errorSticky('削除に失敗しました');
            }
        });
    };
}]);
