var app = angular.module('myApp', ['ngResource', 'ngRoute', 'ui.bootstrap', 
    'usersCtrl', 'usersListCtrl','skillsCtrl', 'organizationsCtrl', 'postsCtrl', 'tagsCtrl', 'ranksCtrl', 'loginCtrl',
    'projectsCtrl','teamsCtrl', 'profilesCtrl']
    ).config(function ($routeProvider) {
        // ルーティング設定
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/profile', {
                templateUrl: 'views/myprofile.html',
                reloadOnSearch: false, //ページ内リンクを可能にする
                controller: 'ProfilesCtrl'
            })
            .when('/member', {
                templateUrl: 'views/member/member.html',
                controller: 'UsersListCtrl'
            })
            .when('/member/mgt', {
                templateUrl: 'views/member/management.html',
                controller: 'UsersCtrl'
            })
            .when('/member/mgt/:id', {
                templateUrl: 'views/member/management.html',
                controller: 'UsersCtrl'
            })
            //master
            .when('/master/skills', {
                templateUrl: 'views/master/skills.html',
                controller: 'SkillCategoryCtrl'
            })
            .when('/master/organization', {
                templateUrl: 'views/master/organization.html',
                controller: 'OrganizationsCtrl'
            })
            .when('/master/posts', {
                templateUrl: 'views/master/posts.html',
                controller: 'PostsCtrl'
            })
            .when('/master/tags', {
                templateUrl: 'views/master/tags.html',
                controller: 'TagsCtrl'
            })
            .when('/master/rank', {
                templateUrl: 'views/master/rank.html',
                controller: 'RanksCtrl'
            })
            //project
            .when('/project', {
                templateUrl: 'views/project/project.html',
                controller: 'ProjectsCtrl'
            })
            .when('/project/mgt', {
                templateUrl: 'views/project/team.html',
                controller: 'ProjectsCtrl'
            })
            .when('/project/team', {
                templateUrl: 'views/project/team.html',
                controller: 'TeamsCtrl'
            })
            .when('/project/team/:id', {
                templateUrl: 'views/project/team.html',
                controller: 'TeamsCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });