'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:InviteController
 * @description
 * # InviteController
 */
angular.module('Hoodie')
  .controller('InviteController', function($scope,$rootScope,$http,$mdToast,$location,$mdDialog,requests) {

    var invite = [];

    $scope.$on('$viewContentLoaded',function(){
      $scope.emptyResult = false;

      $scope.inviteList = [];
      $scope.toInvite = [];
      $scope.emailsArray = [];
      $scope.allContacts = [];
      $scope.home = false;
      $scope.neighbors = false;
      $scope.invite = true;
      $rootScope.homeIcon=true;
      $rootScope.searchIcon=false;
      $rootScope.inviteIcon=true;
      $rootScope.speedDial.showSpeedDial = false;
      $rootScope.pageName='Invite Neighbors';
      $scope.getAllContacts();
    });



    $scope.inviteFriend = function(){
      if($scope.toInvite.length > 0){
        for(var i = 0, maxLength = $scope.toInvite.length;i<maxLength;i=i+1){
          for(var j = 0, length = $scope.toInvite[i].length;j<length;j=j+1){
            invite.push($scope.toInvite[i][j].value);
          }
        }
        $scope.sendInviteList();
      }else {
        $mdToast.show($mdToast.simple().textContent('Please select al least one contact'));
      }

    };

    $scope.sendInviteList = function(){
      var invitesRequestParameters = {
        emails : invite,
        token : window.localStorage.getItem('loginToken')
      };
      requests.invites(invitesRequestParameters,function(result){
        console.log(result);
        $mdDialog.show({
          templateUrl: 'templates/partial/add-inviters.html',
          controller: InvitePopUpController,
          parent: angular.element(document.body),
          clickOutsideToClose:true
        });
      },function(error){
        $rootScope.showCustomToast();
        console.log(error);
      });

    };

    $scope.getUnRegisteredUser = function(){
      if($scope.emailsArray.length === 0){
        $scope.progressCircular = false;
        $scope.emptyResult = true;
      }
      else {

        var contactsRequestParameters = {
          emails : $scope.emailsArray,
          token : window.localStorage.getItem('loginToken')
        };
        requests.contacts(contactsRequestParameters,function(result){
          $scope.successGetUnRegisteredUser(result);
        },function(error){
          console.log(error);
          $rootScope.showCustomToast();
        });
      }
    };

    $scope.successGetUnRegisteredUser = function(result){
      for(var i=0, length = $scope.allContacts.length; i<length; i=i+1) {
        for(var j= 0, lengthEmail = $scope.allContacts[i].emails.length;j<lengthEmail;j=j+1){
          if(result.indexOf($scope.allContacts[i].emails[j].value) > -1 ){
           $scope.inviteList.push($scope.allContacts[i]);
            if(!$scope.$$phase){
              $scope.$apply();
            }
          }
        }
      }
      $scope.progressCircular = false;
    };

    $scope.toggle = function(item){
      var idx = $scope.toInvite.indexOf(item);
      if (idx > -1){
        $scope.toInvite.splice(idx, 1);
      }else {

        $scope.toInvite.push(item);
      }
    };

    $scope.getAllContacts = function(){
      $scope.progressCircular = true;
      $scope.permisionDeniedMessage = false;
      function onError(error) {
        $scope.progressCircular = false;
        console.log(error);

        $scope.permisionDeniedMessage = true;

        $scope.$evalAsync();
      }

      function onSuccess(result) {

        var nameArray = [];
        for(var i=0, length = result.length; i<length; i=i+1) {
          if(result[i].emails !== null){
            for(var j= 0, lengthEmail = result[i].emails.length;j<lengthEmail;j=j+1){
              if($scope.emailsArray.indexOf(result[i].emails[j].value)  === -1 &&  nameArray.indexOf(result[i].name.formatted) === -1){
                $scope.allContacts.push(result[i]);
                $scope.emailsArray.push(result[i].emails[j].value);
                nameArray.push(result[i].name.formatted)
              }
            }
          }
        }
        $scope.getUnRegisteredUser();
      }

      navigator.contacts.find(['emails'],onSuccess,onError);

    };



    function InvitePopUpController($scope){
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
    }

  });
