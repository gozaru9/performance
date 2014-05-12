var skillsCtrl = angular.module('skillsCtrl',['SkillServices', 'ModalService']);
skillsCtrl.controller('SkillCategoryCtrl', ['$rootScope','$scope', 'SkillCategory', 'Utility', 'Modal' ,
    function($rootScope, $scope, SkillCategory, Utility, Modal) {
    
    $scope.skillCategory = SkillCategory;
    $scope.categoryList = [];
    //スキルカテゴリを取得 ng-initで設定
    $scope.getAll = function() {
        $scope.skillCategory.get({}, function(data){
            
            if (data.status) {
                
                $scope.categoryList = data.itemList;
                //変更された場合等に別のコントローラーとデータを共有させる
                $rootScope.$broadcast('categoryListBroadcast', data.itemList);
                
            } else {
                
                Utility.errorSticky('データの取得に失敗しました');
            }
        });
    };
    
    $scope.create = function(categoryName) {
        
        var category = new SkillCategory({name:categoryName});
        category.$save(function(data) {
            
            $scope.categoryName = '';
            if (data.status) {
                
                $scope.categoryList.push(data.item);
                Utility.success('登録しました');

            } else {
                
                Utility.errorSticky('登録に失敗しました');
                
            }
        });
    };
    
    $scope.popupView = function(id, index) {
        
        $scope.updateid = id;
        $scope.targetindex = index;
        //modal用のデータを生成
        $scope.modalParam = 
            {
                header:'カテゴリ名を変更します', 
                initValue:$scope.categoryList[index].name
            };
        $scope.modalInstance = Modal.open($scope, "partials/modal/updateSimpleModal.html");
    };

    $scope.update = function(name) {
        
        //データの更新を行う
        var category = new SkillCategory({_id:$scope.updateid, name:name});
        category.$save(function(data) {
            
            if (data.status) {
                
                $scope.categoryList[$scope.targetindex].name = name;
                Utility.success('更新しました');
                
                //モーダルを閉じる
                $scope.modalInstance.close();

            } else {

                Utility.errorSticky(data.messages);
            }
        });
    };

    $scope.delete = function(id, index) {
        
        $scope.skillCategory.remove({_id:id}, function(data){
            
            if (data.status) {

                $scope.categoryList.splice(index, 1);
                Utility.success('削除しました');
                
            } else {
                
                Utility.errorSticky('削除に失敗しました');
            }
        });
    };
}]);
skillsCtrl.controller('SkillsCtrl', ['$scope', 'Skill', 'Utility', 'Modal', 
    function($scope, Skill, Utility, Modal) {

    $scope.skill = Skill;
    
    //スキルカテゴリのセレクトボックス用データ
    $scope.categoryList = [];
    $scope.selectCategory = null;
    //イベントを受け取りスキルカテゴリの内容を変更する
    $scope.$on('categoryListBroadcast', function(event,data) {
        $scope.categoryList = data;
    });
    
    //スキル情報のリスト
    $scope.skillList = [];
    
    //選択されたスキルカテゴリに対応したスキル情報を取得する 
    //ng-changeに設定
    $scope.getSkill = function() {
        
        $scope.skill.get({_id:$scope.selectCategory}, function(data){
            
            if (data.status) {
                
                $scope.skillList = data.itemList;

            } else {
                
                Utility.errorSticky('取得に失敗しました');
            }
        });
    };

    $scope.create = function(skillName) {
        
        var skill = new Skill({category:$scope.selectCategory, name:skillName});
        skill.$save(function(data) {
            
            $scope.skillName = '';
            if (data.status) {
                
                $scope.skillList.push(data.item);

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
                header:'スキル名を変更します', 
                initValue:$scope.skillList[index].name
            };
        $scope.modalInstance = Modal.open($scope, "partials/modal/updateSimpleModal.html");
    };

    $scope.update = function(name) {

        //データの更新を行う
        var skill = new Skill({_id:$scope.updateid, name:name});
        skill.$save(function(data) {
            
            if (data.status) {
                
                $scope.skillList[$scope.targetindex].name = name;
                Utility.success('更新しました');
                
                //モーダルを閉じる
                $scope.modalInstance.close();

            } else {

                Utility.errorSticky(data.messages);
            }
        });
    };

    $scope.delete = function(id, index) {
        
        $scope.skill.remove({_id:id}, function(data){
            
            if (data.status) {
                
                $scope.skillList.splice(index, 1);
                Utility.success('削除しました');
                
            } else {
                
                Utility.errorSticky('削除に失敗しました');
            }
        });
    };
}]);