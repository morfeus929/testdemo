'use strict';

/**
 * @ngdoc overview
 * @name Hoodie
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */

angular.module('Hoodie', ['ionic', 'ngCordova','ngSanitize', 'ngMessages' ,'ngResource', 'ngRoute', 'ngMaterial', 'ui.router', 'angular-carousel'])

  .run(function ($ionicPlatform,$rootScope,$mdSidenav,$log,$mdDialog,$location,$http,$ionicSlideBoxDelegate,$mdToast,$ionicPopup,requests) {
    var history = [];
    $rootScope.showNewPostBackdrop = false;
    $rootScope.users = {};
    $rootScope.pageName='_';
    $rootScope.showSearch = false;
    $rootScope.showNavigation=true;
    $rootScope.showNavBar=true;
    $rootScope.toggleRight = buildToggler('left');
    $rootScope.homeIcon=true;
    $rootScope.showEdit=false;
    $rootScope.showSend=false;
    $rootScope.speedDial={isOpen: false};
    $rootScope.query='';
    $ionicPlatform.ready(function() {
      if (navigator.splashscreen) {
        setTimeout(function() {
          navigator.splashscreen.hide();
        }, 100);
      }
      StatusBar.overlaysWebView(false);
      StatusBar.backgroundColorByHexString('#009688');
      window.open = cordova.InAppBrowser.open;

    });

    $ionicPlatform.registerBackButtonAction(function() {
      var prevUrl = history[history.length - 2];
      if ($location.path() === '/landing' || $location.path() === 'landing') {
        navigator.app.exitApp();
      }
      if($location.path() === '/invite' || $location.path() === 'invite'){
        if(angular.element(document).find('md-dialog').length > 0) {
          $mdDialog.cancel();
        }else {
          if(prevUrl !== '/landing') {
            $location.path(prevUrl);
            if (!$rootScope.$$phase) {
              $rootScope.$apply();
            }
          }
        }
      }
      else {
        if(prevUrl !== '/landing') {
          $location.path(prevUrl);
          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }
        }

      }
    },100);

    $rootScope.showCustomToast = function() {
      $mdToast.show({
        hideDelay   : 3000,
        position    : 'bottom left',
        controller  : 'toastController',
        templateUrl : 'templates/partial/toast.html'
      });
    };

    $rootScope.activateSearch=function(query){
      $rootScope.query=query;
    };

    $rootScope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug('close LEFT is done');
        });
    };

    $rootScope.closeModal = function(){
      $rootScope.expandAlert.close();
      if($location.path() === '/home' || $location.path() === '/post'){
        $rootScope.speedDial.showSpeedDial = true;
      }
    };

    $rootScope.$watch('speedDial.isOpen', function(isOpen) {
      if (isOpen) {
        $rootScope.showNewPostBackdrop = true;
      } else {
        $rootScope.showNewPostBackdrop = false;
      }
    });

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug('toggle ' + navID + ' is done');
          });
      };
    }

    $rootScope.changeLocation = function (page) {
      $rootScope.activeTab = 0;
      $location.path(page);
      $rootScope.close();
    };

    $rootScope.logOut = function(){
      function onSuccess(){
        console.log('logout true');
      }
      function onError(){
        console.log('logout false');
      }
      facebookConnectPlugin.logout(onSuccess,onError);
      requests.logout(window.localStorage.getItem('loginToken'),function(result){
        console.log(result);
        window.localStorage.setItem('loginToken','');
        delete  $rootScope.userPictures;
        delete  $rootScope.users;
        console.log($rootScope);
        $location.path('/landing');
      },function(error){
        $rootScope.showCustomToast();
        console.log(error);
      });
    };

    $rootScope.contactUs = function(){
      function onSuccess(result){
        console.log(result);
      }
      function onError(error){
        console.log(error);
      }
      window.plugins.socialsharing.shareViaEmail(
        '',
        'New message',
        ['heyneighbor@hoodieapp.com'],
        null,
        [],
        onSuccess,
        onError
      );


    };

    $rootScope.$on('$routeChangeSuccess', function() {
      history.push($location.$$path);
    });

    $rootScope.back = function() {
      var prevUrl = history.length > 1 ? history.splice(-2)[0] : '/';
      $location.path(prevUrl);
      if(!$rootScope.$$phase){
        $rootScope.$apply();
      }
    };

  })

  .config(function ($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'templates/views/home.html',
      controller: 'HomeController'
    }).when('/neighbors', {
      templateUrl: 'templates/views/neighbors.html',
      controller: 'NeighborsController'
    }).when('/invite', {
      templateUrl: 'templates/views/invite.html',
      controller: 'InviteController'
    }).when('/post', {
      templateUrl: 'templates/views/post.html',
      controller: 'PostController'
    }).when('/news', {
      templateUrl: 'templates/views/news.html',
      controller: 'NewsController'
    }).when('/landing', {
      templateUrl: 'templates/views/landing.html',
      controller: 'LandingController'
    }).when('/profile', {
      templateUrl: 'templates/views/profile.html',
      controller: 'ProfileController'
    }).when('/newpost', {
      templateUrl: 'templates/views/newpost.html',
      controller: 'newPostController'
    }).when('/reply', {
      templateUrl: 'templates/views/reply.html',
      controller: 'replyController'
    }).when('/edit-profile', {
      templateUrl: 'templates/views/edit-profile.html',
      controller: 'EditProfileController'
    }).when('/specific-profile', {
      templateUrl: 'templates/views/specific-profile.html',
       controller: 'SpecificProfileController'
    }).otherwise({
      redirectTo: '/landing'
    });

  })

  .config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('amazingPaletteName', {
      '50': 'ffffff',
      '100': 'e0f2f1',
      '200': '0097f6',
      '300': 'e57373',
      '400': 'ef5350',
      '500': '009688',
      '600': 'e53935',
      '700': 'd32f2f',
      '800': 'c62828',
      '900': 'b71c1c',
      'A100': 'ff8a80',
      'A200': 'ff5252',
      'A400': 'ff1744',
      'A700': '000000',
      'contrastDefaultColor': 'light',

      'contrastDarkColors': ['50', '100',
        '200', '300', '400', 'A100'],
      'contrastLightColors': undefined
    });
  $mdThemingProvider.theme('default')
    .primaryPalette('amazingPaletteName',{
      'default':'500',
      'hue-1': '50',
      'hue-2': '200',
      'hue-3': 'A100'
    })
    .accentPalette('blue',{
      'default': '500'

    })
    .warnPalette('pink', {
      'default': '500'
    });
});
