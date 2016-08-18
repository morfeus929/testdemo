'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:toastController
 * @description
 * # toastController
 */
angular.module('Hoodie')
  .controller('toastController', function($scope,$mdToast) {

    $scope.closeToast = function() {
      $mdToast.hide();
    };

  });
