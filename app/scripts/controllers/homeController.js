'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('Hoodie')
  .controller('HomeController', function($scope,$location,$window,$ionicSlideBoxDelegate,$ionicPopup,$ionicScrollDelegate,$rootScope,$timeout,$http, requests) {
    $scope.emptySearsh = false;

    $scope.$on('$viewContentLoaded',function(){
      $scope.home = true;
      $scope.noPostNotification = false;
      $rootScope.speedDial.isOpen = false;
      $scope.showReplies = false;
      $rootScope.homeIcon=true;
      $rootScope.searchIcon=true;
      $scope.refresher = false;
      $scope.loadingSpinner = true;
      $scope.moveData = 0;
      $rootScope.inviteIcon=false;
      $rootScope.showSend=false;
      $rootScope.showEdit=false;
      $rootScope.pageName='Home';
      $rootScope.query='';
      $rootScope.speedDial.showSpeedDial = true;
      $rootScope.speedDial.icon = 'add';
      $rootScope.speedDial.label = 'menu';
      $rootScope.hideEditSubButtons = true;
      $scope.setActiveTab();
      $scope.getNews();
      $rootScope.speedDial.method = function(){
        $location.path('/newpost');
        $rootScope.selectedTab = $scope.tabActiveSlide;
        $rootScope.activeTab = 0;
      };
    });

    $scope.setActiveTab = function () {
      if($rootScope.activeTab){
        $scope.tabActiveSlide = $rootScope.activeTab;
      }else {
        $scope.tabActiveSlide = 0;
      }
    };

    $scope.backButton = function () {
      $timeout(function() {
        var el = document.getElementById('back-btn');
        angular.element(el).triggerHandler('click');
      }, 0);

    };

    $scope.getNews = function () {
      $scope.areaNews = [];
      $scope.buildingNews = [];
      requests.news(window.localStorage.getItem('loginToken'),function(result){
        $scope.checkNewsGroup(result);
        $scope.getAllPostArea($rootScope.users.groups[0].id);
        $scope.getAllPostBuild($rootScope.users.groups[1].id);
        $scope.refresher = false;
        if(!$scope.$$phase){
          $scope.$apply();
        }
      },function(error){
        console.log(error);
      });
    };

    $scope.checkNewsGroup = function (result) {
      for (var i = 0; i < result.length; i++) {
        for (var j = 0; j < result[i].groups.length; j++) {
          if (result[i].groups[j] === $rootScope.users.groups[0].id ) {
            $scope.areaNews.push(result[i]);
          }
          if(result[i].groups[j] === $rootScope.users.groups[1].id){
            $scope.buildingNews.push(result[i]);
          }
        }
      }
    };

    $scope.autoFocus = function(){
      $timeout(function(){
        angular.element(document.querySelector('#search')).focus();
      },50);
    };

    $scope.openLink = function (event) {
      if(event.target.nodeName === 'A'){
        event.preventDefault();
        event.stopPropagation();
        window.open(event.target.href,'_system');
      }
    };

    $scope.getPost = function(id,type){
     if(type === undefined){
       $rootScope.activeTab = 0;
       $rootScope.lastOpenedNews = id;
       $location.path('/news');
     }else {
       $rootScope.activeTab = 0;
       $rootScope.lastOpenedPost = id;
       $location.path('/post');
     }
    };

    $scope.addReply = function (id){
      $rootScope.activeTab = 0;
      $rootScope.lastOpenedPost = id;
      $location.path('/reply');
    };

    $scope.changeActiveTab = function (index) {
      $ionicSlideBoxDelegate.enableSlide(true);
      if(index){
        $ionicSlideBoxDelegate.next();
        $scope.tabActiveSlide = 1;
      }else {
        $ionicSlideBoxDelegate.previous();
        $scope.tabActiveSlide = 0;
      }
      if(!$scope.$$phase){
        $scope.$apply();
      }
    };

    $scope.changeTab = function(){
      $ionicScrollDelegate.scrollTop(true);
      $scope.tabActiveSlide = $ionicSlideBoxDelegate.currentIndex();
      $timeout( function() {
        $ionicScrollDelegate.resize();
      }, 10);
    };

    $scope.getAllPostArea = function(group){
      var postsRequestParameters = {
        groupIds: group,
        lastPost : 100,
        count : 100,
        token : window.localStorage.getItem('loginToken')
      };
      requests.posts(postsRequestParameters,
        function(result){
          $scope.area = result.concat($scope.areaNews);

          if($scope.area.length === 0  && $scope.areaNews.length === 0 ){
            $scope.noPostNotification = true;
          } else{
            $scope.noPostNotification = false;
          }
          $scope.emptySearsh = true;
          $scope.loadingSpinner = false;
          if(!$scope.$$phase){
            $scope.$apply();
          }
        },
        function(error){
          $rootScope.showCustomToast();
          console.log(error);
      });

    };

    $scope.getAllPostBuild = function (group) {
      var postsRequestParameters = {
        groupIds: group,
        lastPost : 100,
        count : 100,
        token : window.localStorage.getItem('loginToken')
      };
      requests.posts(postsRequestParameters,
        function(result){
          $scope.building = result.concat($scope.buildingNews);
          $scope.emptySearsh = true;
          $scope.loadingSpinner = false;

          if($scope.building.length === 0  && $scope.buildingNews.length === 0 ){
            $scope.noPostNotification = true;
          }
          else{
            $scope.noPostNotification = false;
          }
          if(!$scope.$$phase){
            $scope.$apply();
          }
        },
        function(error){
          $rootScope.showCustomToast();
          console.log(error);
        });
    };

    $scope.like = function(post,id){
      var likeUnlikePostRequestParameters = {
        id : id,
        token : window.localStorage.getItem('loginToken')
      };
      if(!post.likedByUser){
        post.likes++;
        post.likedByUser = true;
        likeUnlikePostRequestParameters.requestMethods = 'POST';
        requests.likeUnlikePost(likeUnlikePostRequestParameters, function (result) {
          console.log(result);
        }, function (error) {
          console.log(error);
          $rootScope.showCustomToast();
        });
      }else{
        post.likes--;
        post.likedByUser = false;
        likeUnlikePostRequestParameters.requestMethods = 'DELETE';
        requests.likeUnlikePost(likeUnlikePostRequestParameters, function (result) {
          console.log(result);
        }, function (error) {
          console.log(error);
        });
      }
    };

    $scope.slideBoxOnDrag = function () {
      $ionicSlideBoxDelegate.enableSlide(true);
    };

    $scope.firstOnDragRight = function () {
      $ionicSlideBoxDelegate.enableSlide(false);
    };

    $scope.lastOnDragLeft = function () {
      $ionicSlideBoxDelegate.enableSlide(false);
    };

    $scope.onSwipeLeft = function(event){
      event.stopPropagation();
      $ionicSlideBoxDelegate.enableSlide(false);
    };

    $scope.expandPicture = function (index,pictures) {
      $rootScope.speedDial.showSpeedDial = false;
      $rootScope.expandpictures = pictures;
      $rootScope.activeExpandPicture = index;
      $rootScope.expandAlert = $ionicPopup.alert({
        templateUrl: 'templates/partial/expand-picture.html',
        cssClass: 'expand-picture'
      });
    };

    $scope.getScrollPosition = function () {
      $scope.moveData = $ionicScrollDelegate.getScrollPosition().top;
    };

    $scope.ionRefresher = function () {
      if($scope.moveData == 0){
        $scope.refresher = true;
        $scope.getNews();
      }
    };

  });
