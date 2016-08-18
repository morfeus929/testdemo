'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:SpecificProfileController
 * @description
 * # SpecificProfileController
 */
angular.module('Hoodie')
  .controller('SpecificProfileController', function($scope,$rootScope,$location,profile,$http,requests,$ionicPopup) {
    $scope.$on('$viewContentLoaded',function(){
      $rootScope.subNavBarShow=false;
      $rootScope.userPictures = [];
      $rootScope.homeIcon=false;
      $rootScope.searchIcon=false;
      $rootScope.inviteIcon=false;
      $rootScope.pageName='Profile';
      $rootScope.showThirdNavBarTab=true;
      $rootScope.showEdit=true;
      $rootScope.showSend=false;
      $rootScope.showEdit=false;
      $rootScope.speedDial.showSpeedDial = false;
      $scope.getSpecificUser();
    });

    $scope.getSpecificUser = function(){
      var specificProfileRequestParameters = {
        id: $rootScope.lastOpenedProfile,
        token : window.localStorage.getItem('loginToken')
      };
      requests.specificProfile(specificProfileRequestParameters,function(result){
        console.log(result);
        $scope.user = result;
        $scope.user.avatar = 'images/empty-picture.png';
        angular.forEach(result.pictures,function(value){
          $scope.userPictures.push('https://hoodie-profile-pictures.s3.amazonaws.com/'+value);
        });
        if(!$scope.$$phase){
          $scope.$apply();
        }
      },function(error){
        $rootScope.showCustomToast();
        console.log(error);
      });

    };

    $scope.expandPicture = function (index,pictures) {
      $rootScope.expandpictures = pictures;
      $rootScope.activeExpandPicture = index;
      $rootScope.expandAlert = $ionicPopup.alert({
        templateUrl: 'templates/partial/expand-picture.html',
        cssClass: 'expand-picture'
      });
    };

    $scope.back = function(){
      $location.path('/neighbors');
    };

  });
