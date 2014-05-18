var logger = require('../util/logger');
var userModel = require('../model/userModel');
var user = new userModel();

exports.index = function(req, res){
    
    res.render('index', {});
};



/**
 * リクエストを受け取り、ログインを行う.
 * 
 * @author niikawa
 * @method login
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.login = function(req, res){
    
    res.render('./login', {});
    
    /*
    user.login(req.body.mailAddress, req.body.password, 
    
        function(err, results) {
            if (err) {
                
            }
            
            if (results.length === 0) {
                res.redirect('/login');
                
            } else {
                
                req.session._id = results[0]._id;
                req.session.name = results[0].name;
                req.session.role = results[0].role;
                req.session.isLogin = true;
            }
        }
    );
    */
};

exports.logout = function(req, res) {
    
};