var projectsCtrl = angular.module('projectsCtrl',['ProjectServices', 'ModalService', 'DatepickerServices']);
projectsCtrl.controller('ProjectsCtrl', ['$scope', 'Project', 'Utility', 'Modal', 'Datepicker' ,
    function($scope, Project, Utility, Modal, Datepicker) {
    
    var resource = Project.getResource();
    $scope.projectsList = [];
    
    $scope.data = {name:'', description:'', begin:'', end:''};

    $scope.initialize = function() {
        Datepicker.init($scope);
        resource.get({}, function(data){
            
            if (data.status) {
                
                $scope.projectsList = data.itemList;
                //変更された場合等に別のコントローラーとデータを共有させる
                //$rootScope.$broadcast('categoryListBroadcast', data.itemList);
                
            } else {
                
                Utility.errorSticky('データの取得に失敗しました');
            }
        });
    };
    
    $scope.create = function() {

        var projects = new resource($scope.data);
        projects.$save(function(data) {
            
            if (data.status) {
                
                $scope.data = {};
                $scope.projectsList.push(data.item);
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
                initValue1:$scope.projectsList[index].name,
                initValue2:$scope.projectsList[index].description,
            };
        $scope.modalInstance = Modal.open($scope, "partials/modal/updateTwoItemModal.html");
    };

    $scope.update = function() {
        
        //データの更新を行う
        var projects = new resource(
            {
                _id:$scope.updateid, 
                name: $scope.modalParam.initValue1, 
                description: $scope.modalParam.initValue2
            });
        projects.$save(function(data) {
            
            if (data.status) {
                
                $scope.projectsList[$scope.targetindex] = data.item;
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

                $scope.projectsList.splice(index, 1);
                Utility.success('削除しました');
                
            } else {
                
                Utility.errorSticky('削除に失敗しました');
            }
        });
    };
}]);
