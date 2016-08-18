'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('Hoodie')
  .controller('ProfileController', function($scope,$rootScope,$ionicPopup ,$location,profile,$http,requests) {

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
      $rootScope.showEdit=true;
      $rootScope.speedDial.showSpeedDial = false;
      $scope.getAllPhotos();

    });

    $scope.getAllPhotos = function(){
      requests.uploadedProfilePictures(window.localStorage.getItem('loginToken'),function(result){
        angular.forEach(result,function(value){
          $rootScope.userPictures.push('https://hoodie-profile-pictures.s3.amazonaws.com/'+value);
          if(!$scope.$$phase){
            $scope.$apply();
          }
        });
      },function(error){
        $rootScope.showCustomToast();
        console.log(error);
      });

     };

    $scope.back = function(){
      $location.path('/home');
    };

    $scope.expandPicture = function (index,pictures) {

      $rootScope.expandpictures = pictures;
      $rootScope.activeExpandPicture = index;
      $rootScope.expandAlert = $ionicPopup.alert({
        templateUrl: 'templates/partial/expand-picture.html',
        cssClass: 'expand-picture'
      });
    };

  });


