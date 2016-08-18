'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:PostsController
 * @description
 * # PostsController
 */
angular.module('Hoodie')
  .controller('NewsController', function($rootScope, $scope,$location,requests) {

      $scope.$on('$viewContentLoaded',function(){
        $scope.flagButton = true;
        $rootScope.pageName = 'News';
        $rootScope.homeIcon=false;
        $rootScope.searchIcon=false;
        $rootScope.showEdit=false;
        $rootScope.inviteIcon=false;
        $rootScope.showSend=false;
        $rootScope.speedDial.showSpeedDial = true;
        $rootScope.hideEditSubButtons = true;
        $scope.getNewsInfo();
        $rootScope.speedDial.showSpeedDial = false;
      });

    $scope.getNewsInfo = function () {
      var specificNewsRequestParameters = {
        id : $rootScope.lastOpenedNews,
        token : window.localStorage.getItem('loginToken')
      };
      requests.specificNews(specificNewsRequestParameters,function(result){
        console.log(result);
        $scope.news = result;
        if(!$scope.$$phase){
          $scope.$apply();
        }
      }, function (error) {
        console.log(error);
      });
    };

    $scope.openLink = function (event) {
      if(event.target.nodeName === 'A'){
        event.preventDefault();
        event.stopPropagation();
        window.open(event.target.href,'_system');
        return false;
      }
    };

    $scope.back = function(){
      $location.path('/home');
    };

  });
