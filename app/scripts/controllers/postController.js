'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:PostsController
 * @description
 * # PostsController
 */
angular.module('Hoodie')
  .controller('PostController', function($rootScope,$scope,$http,$location,$ionicPopup,requests) {

    $scope.$on('$viewContentLoaded',function(){
      $scope.flagButton = false;
      $rootScope.pageName = 'Post';
      $rootScope.homeIcon=false;
      $rootScope.searchIcon=false;
      $rootScope.showEdit=false;
      $rootScope.inviteIcon=false;
      $rootScope.showSend=false;
      $rootScope.speedDial.showSpeedDial = true;
      $rootScope.hideEditSubButtons = true;
      $scope.getPostInfo();
      $rootScope.speedDial.method = function(){
        $rootScope.hideEditSubButtons = false;
        $location.path('/reply');
      };

    });

    $scope.getPostInfo = function(){
      var specificPostRequestParameters = {
        id : $rootScope.lastOpenedPost,
        token : window.localStorage.getItem('loginToken')
      };
      requests.specificPost(specificPostRequestParameters,function(result){
        $scope.posts = result;
          console.log(result);
          for (var i = 0; i < result.allReplies.length; i++) {
          if(result.allReplies[i].author.id === $rootScope.users.id){
            $scope.posts.repliedByUser = true;
          }
        }
        if($rootScope.users.id !== result.author.id){
          $scope.flagButton = true;
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

    $scope.flag = function (id){
      var fagsSpecificPostRequestParameters = {
        id : id,
        token : window.localStorage.getItem('loginToken')
      };
      if(!$scope.posts.flaggedByUser){
        $scope.posts.flaggedByUser = true;
        fagsSpecificPostRequestParameters.requestMethods = 'POST';
        requests.fagsSpecificPost(fagsSpecificPostRequestParameters, function (result) {
          console.log(result);
        }, function (error) {
          $rootScope.showCustomToast();
          console.log(error);
        });
      }else{
        $scope.posts.flaggedByUser = false;
        fagsSpecificPostRequestParameters.requestMethods = 'DELETE';
        requests.fagsSpecificPost(fagsSpecificPostRequestParameters,function(result){
          console.log(result);
        },function(error){
          console.log(error);
        });
      }
    };

    $scope.like = function(id){
      var likeUnlikePostRequestParameters = {
        id : id,
        token : window.localStorage.getItem('loginToken')
      };
      if(!$scope.posts.likedByUser){
        $scope.posts.allLikes.length++;
        $scope.posts.likedByUser = true;
        likeUnlikePostRequestParameters.requestMethods = 'POST';
        requests.likeUnlikePost(likeUnlikePostRequestParameters, function (result) {
          console.log(result);
        }, function (error) {
          $rootScope.showCustomToast();
          console.log(error);
        });
      }else{
        $scope.posts.allLikes.length--;
        $scope.posts.likedByUser = false;
        likeUnlikePostRequestParameters.requestMethods = 'DELETE';
        requests.likeUnlikePost(likeUnlikePostRequestParameters, function (result) {
          console.log(result);
        }, function (error) {
          $rootScope.showCustomToast();
          console.log(error);
        });
      }
    };

    $scope.openLink = function (event) {
      if(event.target.nodeName === 'A'){
        event.preventDefault();
        event.stopPropagation();
        window.open(event.target.href,'_system');
      }
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

    $scope.back = function(){
      $location.path('/home');
    };

  });
