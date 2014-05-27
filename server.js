var http = require('http');
var path = require('path');
var express = require('express');

/*
 * DB
 */
//
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
var db = mongoose.connect(configDB.url);

//
var app = express();
app.set('views', path.join(__dirname, 'app/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('port', process.env.PORT || 3000);
app.set('secretKey', configDB.secret);
app.set('cookieSessionKey', 'sid');
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.bodyParser());
app.use(express.bodyParser({uploadDir:'./app/userImage'}));
app.use(express.methodOverride());
app.use(express.cookieParser(app.get('secretKey')));
app.use(express.static(path.resolve(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'app')));

/*
 * セッション管理
 */
var Session = express.session.Session;
var MongoStore = require('connect-mongo')(express);
var sessionStore = new MongoStore({
        mongoose_connection : db.connections[0],
        clear_interval: 60 * 60// Interval in seconds to clear expired sessions. 60 * 60 = 1 hour
});
app.use(express.session({
    //cookieにexpressのsessionIDを保存する際のキーを設定
    key : app.get('cookieSessionKey'),
    secret: configDB.secret,
    store: sessionStore,
    cookie: {
        httpOnly: false,
        // 60 * 60 * 1000 = 3600000 msec = 1 hour
        //maxAge: new Date(Date.now() + 60 * 60 * 1000),
    }
}));
//全てのリクエストを処理する前にログイン済みかのチェックを行う
/*
app.use(function(req, res, next){
    console.log('login check');
        console.log(req.session);
    if (req.session.isLogin) {
        console.log('next');
        next();
    } else {
        console.log('404');
//        res.render('./login', {});
//        res.status(404).send('Not found app use');
          next();
    }
});
*/
app.use(app.router);
/*
app.all('/', function(req, res, next) {
    console.log('app all /');
    next();
});
app.all('/*', function(req, res, next) {
    console.log('app all /*');
    if (req.session.isLogin) {
        
        next();
    } else {
        res.status(404).send('Not found');
//        res.render('./login', {});
//        res.redirect('/login');
    }
});
*/
/*
 *ルーティングの定義
 */
var routes = require('./routes');
app.get('/', routes.index);
app.get('/login', routes.login);
//app.get('/logout', routes.logout);

/*
 * API
 */
//-----------------------------------------------------------------------------
//login
//-----------------------------------------------------------------------------
var auth = require('./api/login');
app.post('/api/login', auth.login);
app.post('/api/isLogin', auth.isLogin);

//-----------------------------------------------------------------------------
//member
//-----------------------------------------------------------------------------
var users = require('./api/users');
app.get('/api/users/keywords/:q', users.query);
app.get('/api/users/skills', users.getSkill);
app.post('/api/users/skills', users.setSkill);
app.get('/api/users/:id', users.getById);
app.get('/api/users', users.getUser);
app.post('/api/users', users.create);
app.post('/api/users/:id', users.update);
app.delete('/api/users?:id', users.delete);

//-----------------------------------------------------------------------------
//Master
//-----------------------------------------------------------------------------
var skill = require('./api/skill');
//skill category
app.get('/api/skillCategory', skill.getCategoryAll);
app.post('/api/skillCategory', skill.createCategory);
app.post('/api/skillCategory/:id', skill.updateCategory);
app.delete('/api/skillCategory?:id', skill.deleteCategory);
//skill
app.get('/api/skill?:id', skill.getByCategoryId);
app.get('/api/skill/belongto', skill.getSkillsBeloginToCategory);
app.post('/api/skill', skill.skillCreate);
app.post('/api/skill/:id', skill.skillUpdate);
app.delete('/api/skill?:id', skill.skillDelete);
//organization
var organization = require('./api/organization');
//app.get('/api/organization?:id', organization.getByCategoryId);
app.get('/api/organization', organization.getOrganizationAll);
app.post('/api/organization', organization.createOrganization);
app.post('/api/organization/:id', organization.updateOrganization);
app.delete('/api/organization?:id', organization.deleteOrganization);
//posts
var posts = require('./api/post');
//app.get('/api/organization?:id', organization.getByCategoryId);
app.get('/api/posts', posts.getPostAll);
app.post('/api/posts', posts.createPost);
app.post('/api/posts/:id', posts.updatePost);
app.delete('/api/posts?:id', posts.deletePost);
//tag
var tag = require('./api/tag');
app.get('/api/tag', tag.getTagAll);
app.post('/api/tag', tag.createTag);
app.post('/api/tag/:id', tag.updateTag);
app.delete('/api/tag?:id', tag.deleteTag);
//rank
var rank = require('./api/rank');
app.get('/api/rank', rank.getRankAll);
app.post('/api/rank', rank.createRank);
app.post('/api/rank/:id', rank.updateRank);
app.delete('/api/rank?:id', rank.deleteRank);
//-----------------------------------------------------------------------------
// project
//-----------------------------------------------------------------------------
var projects = require('./api/project');
app.get('/api/project', projects.getProjectAll);
app.post('/api/project', projects.createProject);
app.post('/api/project/:id', projects.updateProject);
app.delete('/api/project?:id', projects.deleteProject);
//-----------------------------------------------------------------------------
// team
//-----------------------------------------------------------------------------
var teams = require('./api/team');
app.get('/api/team', teams.getTeamAll);
app.post('/api/team', teams.createTeam);
app.post('/api/team/:id', teams.updateTeam);
app.delete('/api/team?:id', teams.deleteTeam);


var server = http.createServer(app);
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("performance mgt server listening at", addr.address + ":" + addr.port);
});
//catchされなかった例外の処理設定。
process.on('uncaughtException', function (err) {
    console.log('uncaughtException => ' + err);
});