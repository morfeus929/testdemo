'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:EditProfileController
 * @description
 * # EditProfileController
 */
angular.module('Hoodie')
  .controller('EditProfileController', function($scope,$rootScope,$http,$location,requests,profile) {

    $scope.$on('$viewContentLoaded',function(){
      $rootScope.homeIcon=false;
      $rootScope.searchIcon=false;
      $rootScope.inviteIcon=false;
      $rootScope.showEdit=false;
      $rootScope.showSend=true;
      $scope.showAvatar = false;
      $scope.changePicture = true;
      $scope.progressCircularBottom = false;
      $scope.progressCircularTop = false;
      $scope.uploadedImage = true;
      $scope.user = angular.copy($rootScope.users);
      $rootScope.subNavBarShow=false;
      $rootScope.pageName='Edit Profile';
      $rootScope.showThirdNavBarTab=true;
      $rootScope.speedDial.showSpeedDial = false;
    });

    $scope.getPicture = function () {
      var option = {
          quality: 100,
          targetWidth: 600,
          targetHeight: 600,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: Camera.DestinationType.FILE_URI,
          encodingType: Camera.EncodingType.PNG
      };

      function onSuccess(imageData) {
        window.resolveLocalFileSystemURL(imageData, function(fileEntry) {
          fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function() {
              $scope.blob = new Blob([ this.result ], { type: "image/jpeg" } );
              $scope.uploadPicture($scope.blob);
            };
            reader.readAsArrayBuffer(file);
          }, function(e){
            console.log(e);
          });
        }, function(e){
          console.log(e);
        });

      }

      function onFail(message) {
        $scope.progressCircular = angular.element(document.getElementById('progressCircularBottom'));
        $scope.progressCircular[0].className = 'md-primary ng-hide';
        $scope.progressCircularTop = false;
        $scope.showAvatar = false;
        if(!$scope.$$phase){
          $scope.$apply();
        }
        console.error( message);
      }

      navigator.camera.getPicture(onSuccess, onFail, option);

    };

    $scope.fileNameChangedBottom = function() {
      $scope.progressCircular = angular.element(document.getElementById('progressCircularBottom'));
      $scope.progressCircular[0].className = 'md-primary';
      $scope.getPicture();
    };

    $scope.fileNameChangedTop = function() {
      $scope.showAvatar = true;
      $scope.progressCircularTop = true;
      $scope.getPicture();
    };

    $scope.uploadPicture = function(image){
      var form = new FormData();
      form.append('picture',image);
      var uploadProfilePictureRequestParameters = {
        image : form,
        token : window.localStorage.getItem('loginToken')
      };
      requests.uploadProfilePicture(uploadProfilePictureRequestParameters,function(result){
        $scope.user.picture = result;
        $scope.avatar = result;
        $rootScope.userPictures.push(result);
        $scope.showAvatar = false;
        $scope.progressCircularTop = false;
        if(!$scope.$$phase){
          $scope.$apply();
        }
      },function(error){
        $rootScope.showCustomToast();
        console.log(error);
      });

    };

    $scope.sendPost = function(){
      var editProfileRequestParameters = {
        firstName : $scope.user.firstName,
        lastName : $scope.user.lastName,
        status : '',
        work : $scope.user.work,
        likes : $scope.user.likes,
        places : [],
        sports : $scope.user.sports,
        picture : $scope.avatar,
        token : window.localStorage.getItem('loginToken')

      };
      requests.editProfile(editProfileRequestParameters,function(result){
        console.log(result);
        profile.getMyProfile(window.localStorage.getItem('loginToken'),function(response){
          $location.path('/profile');
          console.log(response);
        },function(err){
          $rootScope.showCustomToast();
          console.log(err);
        });
      },function(error){
        $rootScope.showCustomToast();
        console.log(error);
      });
    };

    $scope.chooseActive = function (index,src) {
      $scope.activePhoto = index;
      $scope.changePicture = false;
      $scope.avatar = src;
    };

    $scope.back = function(){
      $location.path('/profile');
    };

  });


