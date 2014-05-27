var async = require('async');
var userModel = require('../model/userModel');
var User = new userModel();
var logger = require('../util/logger');
var messages = require('../config/messages.js');
var skillModel = require('../model/skillModel');
var Skill = new skillModel();

/**
 * ユーザーを取得する 
 * 
 * @author niikawa
 */
exports.getUser = function(req, res){
    
    var skip = 0;
    var limit = 20;
    var condition = null;
    
    User.getUser(skip , limit, condition, function(err, itemList){
        
        var execute = true;
        var message = '';
        if (err) {
            
            logger.appError(err);
            message = messages.COM_ERR_001;
            execute = false;
        }
        //ページング用データの生成が必要
        
        res.json({status: execute, message:message, itemList: itemList});
    });
};

/**
 * 指定されたキーワードでユーザーを検索する
 * 
 * @author niikawa
 */
exports.query = function(req, res) {
    
    var execute = true;
    if (void 0 === req.params.q) {
        
        logger.appError('user.js query parameter is not found');
        res.json({status: !execute, message:messages.COM_ERR_001, itemList: [], count: 0});
        
    } else {
        
        User.searchByKeywords(req.params.q, function(err, itemList) {
            
            var message = '';
            if (err) {
                
                logger.appError(err);
                message = messages.COM_ERR_001;
                execute = false;
            }
            
            res.json({status: execute, message:message, itemList: itemList, count: 0});
            
        });
    }
};

/**
 * IDに合致したユーザーを取得する 
 * 
 * @author niikawa
 */
exports.getById = function(req, res) {

    var execute = true;
    if (void 0 === req.params.id) {
        
            logger.appError('user.js getByEmpNo parameter is not found');
            res.json({status: !execute, message:messages.COM_ERR_001, item: {}});
        
    } else {
        
        User.getById(req.params.id, function(err, item) {
            
            var message = '';
            if (err) {
                
                logger.appError(err);
                message = messages.COM_ERR_001;
                execute = false;
            }
            
            if (null === item) {
                
                message = messages.UER_ERR_003;
                execute = false;
            }
            
            res.json({status: execute, message:message, item: item});
        });
    }
};

/**
 * ユーザーを作成する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.create = function(req, res){
    
    User.isSameUser(req.body, function(item) {
        
        var execute = true;
        var message = '';
        if (item.isSame) {
            
            if (1 === item.type) {
                
                message = messages.UER_ERR_001;
                
            } else if (2 === item.type) {
                
                message = messages.UER_ERR_002;
            }
            
            res.json({status: !execute, message: message});
            
        } else {
            
            var data = req.body;
            data.skills = {};
            data.tags = {};
            User.save(req.session._id, data, function(err, item) {
                
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_002;
                    execute = false;
                }
                res.json({status: execute, message:message, item: item});
                
            });
        }
    });
};

/**
 * ユーザーを更新する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.update = function(req, res) {
    
    User.isSameUser(req.body, function(item) {
        
        var execute = true;
        var message = '';
        if (item.isSame) {
            
            if (1 === item.type) {
                
                message = messages.UER_ERR_001;
                
            } else if (2 === item.type) {
                
                message = messages.UER_ERR_002;
            }
            
            res.json({status: !execute, message: message});
            
        } else {
            
            User.update(req.session._id, req.body, function(err, item) {
                
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_003;
                    execute = false;
                }
                res.json({status: execute, message:message, item: item});
                
            });
        }
    });
};

/**
 * ユーザーを削除する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.delete = function(req, res){
  res.json({title: 'delete'});
};

/**
 * ユーザーのスキルを取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getSkill = function(req, res) {
    
    async.parallel(
        [function(callback) {
            //items[0]
            Skill.getSkillsBeloginToCategory(callback);
        },
        function(callback) {
            //items[1]
            var targetId = req.query.id === void 0 ? req.session._id: req.query.id;
            User.getById(targetId, callback);
        }],
        function(err, items) {
            
            var execute = true;
            var message = '';
            if (err) {
                execute = false;
                message = messages.COM_ERR_001;
                logger.appError(err);
            }
            
            //スキルのマッピングを行う
            var user = items[1];
            var skillList = items[0];
            
            for (var parent=0; parent < skillList.length; parent++)
            {
                var categoyId = skillList[parent].category._id;
                //該当するスキルカテゴリを持たない場合
                if (user.skills[categoyId] === void 0 || user.skills[categoyId].length === 0) {
                        
                    for (var i=0; i < skillList[parent].skills.length; i++)
                    {                        
                        skillList[parent].skills[i].checked = false;
                        skillList[parent].skills[i].numberOfYear = 0;
                    }
                    
                } else {
                    
                    //ユーザーが該当スキルを持っているか判定し画面描画の表示制御用の要素を追加する
                    var settingSkill = user.skills[categoyId];
                    for (var j=0; j < skillList[parent].skills.length; j++)
                    {
                        var skillId = skillList[parent].skills[j]._id;
                        if (settingSkill[skillId]) {
                            
                            skillList[parent].skills[j].checked = true;
                            skillList[parent].skills[j].numberOfYear = settingSkill[skillId];

                        } else {
                            
                            skillList[parent].skills[j].checked = false;
                            skillList[parent].skills[j].numberOfYear = 0;
                        }
                    }
                }
            }
            var returnObj = {user: user, skillList: skillList};
            res.json({status: execute, message: message, items: returnObj});
        }
    );
};

/**
 * ユーザーのスキルをセットする
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.setSkill = function(req, res) {
    
    User.setSkill(req.session._id, req.body, function(err, item){
        
        var execute = true;
        var message = messages.COM_INFO_002;
        if (err) {
            execute = false;
            message = messages.COM_ERR_003;
            logger.appError(err);
        }
        res.json({status: execute, message: message, items: item});
    });
};
