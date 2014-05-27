var uesrServices = angular.module("UesrServices", ["ngResource"]);
uesrServices.factory("User", ['$resource',
    function($resource) {
        
        var getResource = function(type) {
            
            if (type === 'keyword') {
                
                return $resource('api/users/keywords/:q', {'q': '@q'});
                
            } else if (type === 'skill') {
            
                return $resource('api/users/skills');
                
            } else {
                
                return $resource('api/users/:id', {'id': '@id'});
            }
        };
        
        var createBirth = function (year, month, day) {
            
            if ('' !== year && '' !== month && '' !== day ) {
                
                return year + '-' + month + '-' + day;
            }
            return '';
        };
        
        var getPrefectures = function() {
            
            return [
                {value:'01', text:'北海道'},{value:'02', text:'青森'}, {value:'03', text:'岩手'},
                {value:'04', text:'宮城'},{value:'05', text:'秋田'}, {value:'06', text:'山形'},
                {value:'07', text:'福島'},{value:'08', text:'茨城'}, {value:'09', text:'栃木'},
                {value:'10', text:'群馬'},{value:'11', text:'埼玉'}, {value:'12', text:'千葉'},
                {value:'13', text:'東京'},{value:'14', text:'神奈川'}, {value:'15', text:'新潟'},
                {value:'16', text:'富山'},{value:'17', text:'石川'}, {value:'18', text:'福井'},
                {value:'19', text:'山梨'},{value:'20', text:'長野'}, {value:'21', text:'岐阜'},
                {value:'22', text:'静岡'},{value:'23', text:'愛知'}, {value:'24', text:'三重'},
                {value:'25', text:'滋賀'},{value:'26', text:'京都'}, {value:'27', text:'大阪'},
                {value:'28', text:'兵庫'},{value:'29', text:'奈良'}, {value:'30', text:'和歌山'},
                {value:'31', text:'鳥取'},{value:'32', text:'島根'}, {value:'33', text:'岡山'},
                {value:'34', text:'広島'},{value:'35', text:'山口'}, {value:'36', text:'徳島'},
                {value:'37', text:'香川'},{value:'38', text:'愛媛'}, {value:'39', text:'高知'},
                {value:'40', text:'福岡'},{value:'41', text:'佐賀'}, {value:'42', text:'長崎'},
                {value:'43', text:'熊本'},{value:'44', text:'大分'}, {value:'45', text:'宮崎'},
                {value:'46', text:'鹿児島'},{value:'47', text:'沖縄'},
            ];
        };
        
        var createRadarChartData = function(targetList, userSkills) {

            var radarChartData = [];
            var categoryNum = targetList.length;
            for (var cIndex=0; cIndex < categoryNum; cIndex++)
            {
                var skillNum = targetList[cIndex].skills.length;
                //チャートのラベル部分を生成する
                var labelList = [];
                for (var sIndex=0; sIndex < skillNum; sIndex++)
                {
                    labelList.push(targetList[cIndex].skills[sIndex].name);
                }
                //該当する数値を設定する
                var usersNum = userSkills.length;
                var categoryId = targetList[cIndex].category._id;
                var setData = [];
                for (var uIndex = 0; uIndex < usersNum; uIndex++)
                {
                    var datalList = [];
                    if (userSkills[uIndex] === void 0
                    || userSkills[uIndex][categoryId] === void 0) {
                        
                        for (sIndex = 0; sIndex < skillNum; sIndex++) 
                        {
                            datalList.push(0);
                        }

                    } else {
                        
                        for (sIndex = 0; sIndex < skillNum; sIndex++) 
                        {
                            var targetSkillId = targetList[cIndex].skills[sIndex]._id;
                            var value = userSkills[uIndex][categoryId][targetSkillId];
                            datalList.push((value === void 0) ? 0 : value);
                        }
                    }
                    setData.push(datalList);
                }

                radarChartData.push({label:labelList, data:setData});
            }
            return radarChartData;
        };
        
        var createSkillSubmitInfo = function(skillList) {
                
            var skillData = {};
            var parent = skillList.length;
            var nameList = [];
            for (var cIndex=0; cIndex < parent; cIndex++)
            {
                var categoryId = skillList[cIndex].category._id;
                var skills = {};
                var child = skillList[cIndex].skills.length;
                for (var sIndex=0; sIndex < child; sIndex++)
                {
                    var item = skillList[cIndex].skills[sIndex];
                    if (item.checked && item.numberOfYear)
                    {
                        skills[item._id] = item.numberOfYear;
                        nameList.push(item.name);
                    }
                }
                skillData[categoryId] = skills;
            }
            return { skillData: skillData, skillNameList: nameList};
        };
        
        return {
                getResource: getResource, 
                createBirth: createBirth, 
                getPrefectures: getPrefectures,
                createRadarChartData: createRadarChartData,
                createSkillSubmitInfo: createSkillSubmitInfo,
            };
    }
]);
uesrServices.factory('SharedUserModel', function($scope){
    
    return {_id: '', name:''};
});

