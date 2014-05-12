var crypto = require('crypto');
var Core = require('./coreModel');
var mongoose = require('mongoose');
var moment = require('moment');

/**
 * user modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "users"
 */
var collection = 'users';

/**
 * User Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class userModel
 * @constructor
 * @extends Core
 */
var userModel = function userModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(userModel, Core);

/**
 * ユーザーを保持するコレクション.
 * 
 * @property userSchema
 * @type {Object}
 */
var usersSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: {type: String},
  updateBy: {type: String},
  employeeNumber:{type: Number},
  employeeType:{type: Number}, //1:社員2:契約社員3:アルバイト,9:退職者
  organizations:[{ type: mongoose.Schema.Types.ObjectId, ref: 'organizations' }],
  posts:[{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
  ranks:{ type: mongoose.Schema.Types.ObjectId, ref: 'ranks' },
  userImagePath:{type: String},
  firstName: {type: String},
  lastName: {type: String},
  firstNameKana: {type: String},
  lastNameKana: {type: String},
  mailAddress: {type: String},
  password: String,
  birth: {type: String},
  age: {type: Number},
  sex: {type: Number},
  telNo: {type: String},
  zip: {type: String},
  prefectures: {type: String},
  city: {type: String},
  address: {type: String},
  entryDate: {type: Date, default: Date.now},
  LeavingDate: {type: Date},
  keywords: {type: String},
  tags:[{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' , default: null}],
  teams:[{ type: mongoose.Schema.Types.ObjectId, ref: 'teams', default: null }]
  //後で追加する
  //
  //role
  
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, usersSchema);

// middleware
// save処理の前にフックをかけれる。RailsでいうFilterみたいな機能
usersSchema.pre('save', function (next) {
    
    next();
});

/**
 * ログイン
 * 
 * @method login
 * @author niikawa
 * @param {String} mailAddress
 * @param {String} password
 * @param {Function} callback
 */
userModel.prototype.login = function(mailAddress, password, callback) {
    
    var User = this.db.model(collection);
    var pw = crypto.createHash('md5').update(password).digest("hex");
    
    User.find( {$and: [{mailAddress: mailAddress}, {password: pw}] }, callback);
};

/**
 * ユーザーを取得する(ページング用)
 * 
 * @method getUser
 * @author niikawa
 * @param {Number} skip
 * @param {Number} limit
 * @param {Object} conditon
 * @param {Funtion} callback
 */
userModel.prototype.getUser = function(skip, limit, condition, callback) {
    
    var User = this.db.model(collection);
    User.find().sort({'created': 1}).populate('organizations').populate('posts').skip(skip).limit(limit).exec(callback);
    
//    Chat.find({ "users._id" : { $in:[id] } },null, {sort:{'created': 1}},callback).populate('messages', null, null, { sort: { 'created': 1 } });
    
    
};

/**
 * IDに合致したユーザーを取得する
 * 
 * @method getById
 * @author niikawa
 * @param {String} id
 * @param {Funtion} callback
 */
userModel.prototype.getById = function(id, callback) {
    
    var User = this.db.model(collection);
    User.findOne({_id: id}).populate('organizations').populate('posts').populate('ranks').exec(callback);
};


/**
 * キーワードを含むユーザーを取得する.
 * 
 * @method searchByKeywords
 * @author niikawa
 * @param {String} query
 * @param {Funtion} callback
 */
userModel.prototype.searchByKeywords = function(query, callback) {
    
    var User = this.db.model(collection);
    
    var qList = query.split(' ');
    var qNum = qList.length;
    var q = {};
    if (qNum > 1) {
        
        q = {$and: []};
        for (var index=0; index < qNum; index++) {
            
            if ('' !== qList[index]) {
                
                q.$and.push({keywords: new RegExp(qList[index], 'i')});
            }
        }

    } else {
        
        q = {keywords: new RegExp(query, 'i')};
    }
    User.find(q).sort({'created': 1}).populate('organizations').populate('posts').populate('ranks').exec(callback);
};


/**
 * 条件に一致するユーザーを取得する.
 * 
 * @method getUserByCondition
 * @author niikawa
 * @param {Object} condition
 * @param {Number} skip
 * @param {Number} limit
 * @param {Funtion} callback
 */
userModel.prototype.getUserByCondition = function(condition, skip, limit, callback) {
    
};

/**
 * 同一の社員番号またはメールアドレスを持つユーザーが存在するかチェックする
 * 
 * @method isSameUser
 * @author niikawa
 * @param {String} id ユーザーiD
 * @param {Object} data
 * @param {Funtion} callback
 */
userModel.prototype.isSameUser = function(data, callback) {
    
    var User = this.db.model(collection);
    User.findOne( { $or:[{'employeeNumber': data.employeeNumber} , {'mailAddress': data.mailAddress} ]}, function(err, item){
        
        var result = {isSame:false, type: 0};
        if (null !== item) {
            result.isSame = true;
            result.type = (item.employeeNumber === data.employeeNumber) ? 1 : 2;
        }
        callback(result);
    });
};

/**
 * ユーザーを作成する
 * 
 * @method save
 * @author niikawa
 * @param {String} id ユーザーiD
 * @param {Object} data
 * @param {Funtion} callback
 */
userModel.prototype.save = function(id, data, callback) {
    
    var User = new myModel(data);
    
    User.creatBy = id;
    User.updateBy = id;
    User.password = crypto.createHash('md5').update(data.password).digest("hex");
    User.birth = data.birthYear + '-' + data.birthMonth + '-' + data.birthDay;
    User.telNo = data.telFront + '-' + data.telCenter + '-' + data.telBack;
    User.zip = data.zipFront + '-' + data.zipBack;
    
    //かなを全角文字に変換しないとダメ
    
    //キーワードを生成
    User.keywords = 
        data.lastName
        +data.firstName
        +data.lastNameKana
        +data.firstNameKana
        +data.mailAddress
        +data.employeeNumber
        ;
    
    User.save(callback);
};

/**
 * ユーザーを更新する
 * 
 * @method update
 * @author niikawa
 * @param {object} data data.userid + collection member
 * @param {Funtion} callback
 */
userModel.prototype.update = function(data, callback) {
    
};

/**
 * ユーザーの種別を変更する
 * 
 * @method updateType
 * @author niikawa
 * @param {Object} data data.userId data.targetId data.employeeType
 * @param {Funtion} callback
 */
userModel.prototype.updateType = function(data, callback) {
    
};

/**
 * パスワードが一致するか判定する
 * 
 * @method passwordMatch
 * @author niikawa
 * @param {String} id
 * @param {String} password
 * @param {Funtion} callback
 */
userModel.prototype.passwordMatch = function(id, password, callback) {
    
    var p = crypto.createHash('md5').update(password).digest("hex");
    var User = this.db.model(collection);
    User.findOne( {$and: [{_id: id}, {password: p}] } , function(err, item) {
        callback(null === item);
    });
};

/**
 * パスワードを変更する
 * 
 * @method updatePassword
 * @author niikawa
 * @param {Object} data data.userId data.targetId data.password
 * @param {Funtion} callback
 */
userModel.prototype.updatePassword = function(data, callback) {
    
};
module.exports = userModel;