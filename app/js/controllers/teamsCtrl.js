var teamsCtrl = angular.module('teamsCtrl',['TeamServices', 'UesrServices', 'ModalService']);
teamsCtrl.controller('TeamsCtrl', ['$scope', '$routeParams', 'Team', 'User', 'Utility', 'Modal' ,
    function($scope, $routeParams, Team, User, Utility, Modal) {
    
    var resource = Team.getResource();
    //更新対象のチームID
    var _updateid = '';
    //チームリストに格納されている更新対象のインデックス
    var _updateIndex = null;
    
    //入力情報保持オブジェクト
    $scope.data = {};
    //ユーザー検索エリア表示有無
    $scope.isCollapsed = false;
    //登録画面かの判定
    $scope.isCreate = true;
    //チーム一覧表示有無
    $scope.isOpenList = false;
    
    //ユーザー検索後のコールバック
    function searchComplete(data) {
        
        if (data.status) {
            
            $scope.userList = data.itemList;

        } else {
            
            Utility.errorSticky(data.mesage);
        }
    }
    //登録/更新後のコールバック
    function complete(data) {
        
        if (data.status) {
            //populateされていないためオブジェクトに詰め替える
            data.item.project = 
            {
                _id: data.item.project, 
                name: getProjectName(data.item.project)
            };
            var member = [];
            for (var i = 0; i < $scope.selectedMemberList.length; i++) {
                
                member.push(
                    {
                        _id: $scope.selectedMemberList[i]._id,
                        firstName: $scope.selectedMemberList[i].firstName, 
                        lastName: $scope.selectedMemberList[i].lastName                            
                    });
            }
            data.item.member = member;
            
            if ($scope.isCreate) {
                
                $scope.teamsList.push(data.item);
                
            } else {
                
                $scope.teamsList[_updateIndex] = data.item;
                //登録画面に戻す
                $scope.isCreate = true;
            }
            
            $scope.data = {};
            $scope.keywords = null;
            $scope.userList = [];
            $scope.selectedMemberList = [];

            Utility.success(data.messages);

        } else {
            
            Utility.errorSticky(data.messages);
        }
    }
    
    //idに合致するプロジェクト名を取得する
    function getProjectName(id) {
        for (var index = 0; index < $scope.projectList.length; index++) {
            if (id === $scope.projectList[index]._id) {
                return $scope.projectList[index].name;
            }
        }
    }
    
    //初期化
    $scope.initialize = function() {
        
        $scope.selectedMemberList = [];
        
        resource.get({}, function(data){
            
            if (data.status) {
                
                $scope.teamsList = data.itemLists.teams;
                $scope.projectList = data.itemLists.projects;
                
                //プロジェクト一覧でチームを作成するボタンを押下した場合
                if ($routeParams.id !== void 0) {
                    $scope.data.project = $routeParams.id;
                }

            } else {
                
                Utility.errorSticky(data.messages);
            }
        });
    };
    
    //keyupイベントによりキーワードエリアに入力された内容で検索をする
    $scope.search = function() {
        
        if ('' === $scope.keywords) {
            
            User.getResource().get({}, searchComplete);

        } else {
            
            User.getResource('keyword').get({q: $scope.keywords}, searchComplete);
        }
    };
    
    //メンバーを追加するボタン押下時の処理
    $scope.addMember = function(addIndex) {
        
        var target = $scope.userList[addIndex];
        var item = {_id: target._id, firstName: target.firstName, lastName: target.lastName};
        var nowNum = $scope.selectedMemberList.length;
        var exsists = false;
        for(var index=0; index < nowNum; index++) {
            
            if ($scope.selectedMemberList[index]._id === item._id) {
                exsists = true;
                break;
            }
        }
        if (!exsists) {
            
            $scope.selectedMemberList.push(item);
        }
        //複数選択できるように改修されるかもしれないのでlengthで取得しておく
        $scope.selectedNumber = $scope.selectedMemberList.length;
        $scope.isSelected = $scope.selectedMemberList.length !== 0;
    };
    
    //メンバーを削除する処理
    $scope.removeMember = function(index) {
        
        $scope.selectedMemberList.splice(index, 1);
        var num = $scope.selectedMemberList.length;
        $scope.isSelected = num !== 0;
        $scope.selectedNumber = num;
    };
    
    //ユーザー画像押下時に詳細情報ポップアップを行う処理
    $scope.popupView = function(id, index) {
        
        //modal用のデータを生成
        $scope.modalParam = $scope.userList[index];
        $scope.modalInstance = Modal.open($scope, "partials/modal/viewUserModal.html");
    };
    
    //登録するボタン押下時の処理
    $scope.create = function() {

        var createInfo = $scope.data;
        createInfo.member = [];
        for (var i = 0; i < $scope.selectedMemberList.length; i++) {
            createInfo.member.push($scope.selectedMemberList[i]._id);
        }
        var teams = new resource(createInfo);
        teams.$save(complete);
    };
    
    //更新対象の値を設定し画面を更新用に変更する
    $scope.modeUpdate = function(index) {
        
        var target = $scope.teamsList[index];
        $scope.data.project = target.project._id;
        $scope.data.name = target.name;
        $scope.data.description = target.description;
        $scope.isSelected = target.member.length !== 0;
        $scope.selectedMemberList = target.member;
        $scope.isCreate = false;
        _updateid = $scope.teamsList[index]._id;
        _updateIndex = index;
    };
    
    //更新を行う
    $scope.update = function() {
        
        var updateInfo = $scope.data;
        updateInfo._id = _updateid;
        updateInfo.member = [];
        for (var i = 0; i < $scope.selectedMemberList.length; i++) {
            updateInfo.member.push($scope.selectedMemberList[i]._id);
        }
        var teams = new resource(updateInfo);
        //データの更新を行う
        teams.$save(complete);
    };

    $scope.delete = function(id, index) {
        
        resource.remove({_id:id}, function(data){
            
            if (data.status) {

                $scope.teamsList.splice(index, 1);
                Utility.success('削除しました');
                
            } else {
                
                Utility.errorSticky(data.messages);
            }
        });
    };
}]);
