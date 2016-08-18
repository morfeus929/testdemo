'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:NeighborsController
 * @description
 * # NeighborsController
 */
angular.module('Hoodie')
  .controller('NeighborsController', function($scope,$rootScope,$http,$location,requests) {

    $scope.$on('$viewContentLoaded', function(){
      $scope.neighbors = true;
      $scope.home = false;
      $scope.noUserList  = false;
      $scope.invite = false;
      $rootScope.subNavBarShow=false;
      $rootScope.homeIcon=true;
      $rootScope.searchIcon=false;
      $rootScope.inviteIcon=false;
      $rootScope.pageName='My Neighbors';
      $rootScope.speedDial.showSpeedDial = false;
      $scope.usersList = [];
      $scope.getNeighbors();
    });

    $scope.getNeighbors = function(){
      requests.neighbours(window.localStorage.getItem('loginToken'),function(result){
        console.log(result);
        $scope.usersList = result;
        $scope.noUserList  = true;
        if(!$scope.$$phase){
          $scope.$apply();
        }
      },function(error){
        $rootScope.showCustomToast();
        console.log(error);
      });

    };

    $scope.inviteUser = function () {
      $location.path('/invite');
    };

    $scope.getUserProfile = function(id){
      $rootScope.lastOpenedProfile = id;
      $location.path('/specific-profile');
    };

  });




