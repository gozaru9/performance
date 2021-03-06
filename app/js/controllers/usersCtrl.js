var usersCtrl = angular.module('usersCtrl',['UesrServices','OrganizationServices', 'PostTypeServices', 'RankServices','DatepickerServices']);
/**
 * ユーザー登録/更新画面(1/3)のコントローラー
 */
usersCtrl.controller('UsersCtrl', ['$scope', '$routeParams', '$location', 'User', 'SharedUserModel', 'Organization', 'PostsType', 'Rank','Utility', 'Datepicker',
    function($scope, $routeParams, $location, User, SharedUserModel, Organization, PostsType, Rank, Utility, Datepicker) {

    //ユーザー情報
    $scope.data = 
        {
            firstName: '',
            lastName: '',
            firstNameKana: '',
            lastNameKana: '',
            mailAddress: '',
            password: '',
            passwordConfirm: '',
            birthYear: '',
            birthMonth: '',
            birthDay: '',
            sex: '',
            telFront: '',
            telCenter: '',
            telBack: '',
            zipFront: '',
            zipBack: '',
            prefectures: '',
            city: '',
            address: '',
            employeeNumber: '',
            employeeType: '',
            organizations:'',
            posts:'',
            ranks:'',
            entryDate: new Date(),
        };
    $scope.subtext = '';
    
    //更新画面描画時に初期データを設定する
    function setUser(user) {
        
        $scope.data.firstName = user.firstName;
        $scope.data.lastName = user.lastName;
        $scope.data.firstNameKana = user.firstNameKana;
        $scope.data.lastNameKana = user.lastNameKana;
        $scope.data.mailAddress = user.mailAddress;
        var birth = user.birth.split('-');
        $scope.data.birthYear = birth[0];
        $scope.data.birthMonth = birth[1];
        $scope.data.birthDay = birth[2];
        $scope.data.sex = String(user.sex);
        var tel = user.telNo.split('-');
        $scope.data.telFront = tel[0];
        $scope.data.telCenter = tel[1];
        $scope.data.telBack = tel[2];
        var zip = user.zip.split('-');
        $scope.data.zipFront = zip[0];
        $scope.data.zipBack = zip[1];
        $scope.data.prefectures = user.prefectures;
        $scope.data.city = user.city;
        $scope.data.address = user.address;
        $scope.data.employeeNumber = user.employeeNumber;
        $scope.data.employeeType = String(user.employeeType);
        $scope.data.organizations = user.organizations[0]._id;
        $scope.data.posts = user.posts[0]._id;
        $scope.data.ranks = user.ranks._id;
        $scope.data.entryDate = new Date(user.entryDate);
    }
    
    //初期化処理
    $scope.initialize = function() {
        
        var minYear = Utility.subtractYear(Utility.today(), 70).format('YYYY');
        var maxYear = Utility.today('YYYY');
        $scope.minDate = new Date(Utility.subtractYear(Utility.today(), 70).format('YYYY-MM-DD'));
        Datepicker.init($scope);
        $scope.yearList = Utility.createYearList(minYear , maxYear);
        $scope.monthList = Utility.createMonthList();
        $scope.dayList = Utility.createDayList(Utility.dayInMonth());
        $scope.prefecturesList = User.getPrefectures();
        Organization.getResource().get({}, function(data) {
            if (data.status) {
                
                $scope.organizationList = data.itemList;
            }
        });
        PostsType.getResource().get({}, function(data) {
            if (data.status) {
                $scope.postList = data.itemList;
            }
        });
        Rank.getResource().get({}, function(data) {
            if (data.status) {
                $scope.rankList = data.itemList;
            }
        });

        $scope.isCreate = true;
        $scope.subtext = '新規ユーザーを作成します';
        if ($routeParams.id !== void 0) {
            $scope.isCreate = false;
            $scope.subtext = 'ユーザー情報を更新します';
            User.getResource().get({id: $routeParams.id}, function(data) {
                
                if (data.status) {
                    
                    setUser(data.item);
                } else {
                    
                    Utility.errorSticky(data.message);
                }
            });
        }
    };

    //年齢をviewへバインドする
    var setAge = function(birth) {
        
        if ('' === birth) {
            $scope.data.age = '';
        } else {
            
            $scope.data.age = Utility.diffYear(Utility.today(), birth);
        }
    };

    //年または月が変更された場合にセレクトボックスを再生成し年齢を設定する
    $scope.createOptions = function() {
        
        var birth = User.createBirth($scope.data.birthYear, 
                        $scope.data.birthMonth, $scope.data.birthDay);
        if ($scope.data.birthYear !== '' && $scope.data.birthMonth !== '') {
            
            var target = $scope.data.birthYear + '-' + $scope.data.birthMonth + '-01';
            $scope.dayList = Utility.createDayList(Utility.dayInMonth(target));
        }
        
        setAge(birth);
    };
    
    //年齢を計算
    $scope.getAge = function() {
        
        var target = User.createBirth($scope.data.birthYear, 
                        $scope.data.birthMonth, $scope.data.birthDay);
        setAge(target);
    };
    
    //データを登録/更新する
    $scope.submit = function() {
        
        var completeMessage = '登録しました';
        if (!$scope.isCreate) {
            
            completeMessage = '更新しました';
            $scope.data.id = $routeParams.id;
        }
        
        var resource = User.getResource();
        var user = new resource($scope.data);
        user.$save(function(data) {
            
            if (data.status) {
                
                $scope.data = {};
                Utility.success(completeMessage);
                SharedUserModel._id = data.item._id;
                $location.path('/member/mgt/skill');

            } else {
                
                Utility.errorSticky(data.message);
            }
        });
    };
    
    //削除する
    $scope.remove = function() {
        console.log('remove');
    };
}]);
/**
 * ユーザー登録画面(2/3)のコントローラー
 */
usersCtrl.controller('UsersSetSkillCtrl', ['$scope', '$location', 'User', 'SharedUserModel','Skill', 'Utility',
    function($scope, $location, User, SharedUserModel, Skill, Utility) {
        
    $scope.announce = true;

    $scope.initialize = function() {
        $scope.tabStatus = {skills: true};
        $scope.skillList = [];
        User.getResource('skill').get({id: SharedUserModel._id}, function(data) {

            if (data.status) {
                
                $scope.skillList = data.items.skillList;

            } else {
                
                Utility.errorSticky(data.message);
            }
        });
    };
    
    $scope.isDisabled = function(parent, child) {
        
        $scope.skillList[parent].skills[child].numberOfYear = 0;
    };

    $scope.submit = function() {
        
        var submitInfo = User.createSkillSubmitInfo($scope.skillList);
        var resource = User.getResource('skill');
        var user = new resource(
            {
                _id: SharedUserModel._id 
                , skill: submitInfo.skillData
                , skillNameList: submitInfo.skillNameList
            });
        user.$save(function(data) {
            
            if (data.status) {
                
                Utility.success(data.message);

            } else {
                
                Utility.errorSticky(data.message);
            }
        });
    };
    
    $scope.finish = function() {
        $location.path('/member/mgt');
    };
}]);
