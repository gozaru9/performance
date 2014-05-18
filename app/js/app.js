var app = angular.module('myApp', ['ngResource', 'ngRoute', 'ngCookies','ui.bootstrap',
    'usersCtrl', 'usersListCtrl','skillsCtrl', 'organizationsCtrl', 'postsCtrl', 'tagsCtrl', 'ranksCtrl', 'loginCtrl',
    'projectsCtrl','teamsCtrl', 'profilesCtrl']);
    
app.config(function ($routeProvider) {

    var autoCheck = function($http, $q, $window, $cookies) {
        
        var deferred = $q.defer();
        
        $http.post('api/isLogin', {remembertkn: $cookies.remembertkn}
        
        ).success(function(data) {
            
            deferred.resolve(true);
            
        }).error(function(data) {
            
            $window.location.href = "https://"+location.host+"/login";
        });

        return deferred.promise;
    };

    // ルーティング設定
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            resolve: {isLogin: autoCheck}
        })
/*        .when('/profile', {
            templateUrl: 'views/myprofile.html',
            reloadOnSearch: false, //ページ内リンクを可能にする
            controller: 'ProfilesCtrl',
            resolve: {isLogin: autoCheck}
        })
*/
        .when('/profile/360', {
            templateUrl: 'views/profile/360.html',
            reloadOnSearch: false, //ページ内リンクを可能にする
            controller: 'ProfilesCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/profile/skills', {
            templateUrl: 'views/profile/skills.html',
            reloadOnSearch: false, //ページ内リンクを可能にする
            controller: 'ProfilesSkillsCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/profile/certificates', {
            templateUrl: 'views/profile/certificates.html',
            reloadOnSearch: false, //ページ内リンクを可能にする
            controller: 'ProfilesCertificatesCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/profile/resume', {
            templateUrl: 'views/profile/resume.html',
            reloadOnSearch: false, //ページ内リンクを可能にする
            controller: 'ProfilesResumeCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/member', {
            templateUrl: 'views/member/member.html',
            controller: 'UsersListCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/member/mgt', {
            templateUrl: 'views/member/management.html',
            controller: 'UsersCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/member/mgt/:id', {
            templateUrl: 'views/member/management.html',
            controller: 'UsersCtrl',
            resolve: {isLogin: autoCheck}
        })
        //master
        .when('/master/skills', {
            templateUrl: 'views/master/skills.html',
            controller: 'SkillCategoryCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/master/organization', {
            templateUrl: 'views/master/organization.html',
            controller: 'OrganizationsCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/master/posts', {
            templateUrl: 'views/master/posts.html',
            controller: 'PostsCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/master/tags', {
            templateUrl: 'views/master/tags.html',
            controller: 'TagsCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/master/rank', {
            templateUrl: 'views/master/rank.html',
            controller: 'RanksCtrl',
            resolve: {isLogin: autoCheck}
        })
        //project
        .when('/project', {
            templateUrl: 'views/project/project.html',
            controller: 'ProjectsCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/project/mgt', {
            templateUrl: 'views/project/team.html',
            controller: 'ProjectsCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/project/team', {
            templateUrl: 'views/project/team.html',
            controller: 'TeamsCtrl',
            resolve: {isLogin: autoCheck}
        })
        .when('/project/team/:id', {
            templateUrl: 'views/project/team.html',
            controller: 'TeamsCtrl',
            resolve: {isLogin: autoCheck}
        })
        .otherwise({
            redirectTo: '/'
        });
    });