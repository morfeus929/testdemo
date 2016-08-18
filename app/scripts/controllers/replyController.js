'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('Hoodie')
  .controller('replyController', function($scope,$rootScope,$mdToast, $location,requests,$mdDialog,$timeout) {

    $scope.$on('$viewContentLoaded',function(){
      $scope.postText = '';
      $rootScope.link = '';
      $scope.postImage = [];
      $rootScope.homeIcon=false;
      $rootScope.searchIcon=false;
      $rootScope.inviteIcon=false;
      $scope.progressCircular = false;
      $rootScope.speedDial.showSpeedDial = false;
      $rootScope.speedDial.isOpen = true;
      $rootScope.showEdit=false;
      $rootScope.showSend=true;
      $rootScope.pageName='Reply';
      $rootScope.hideEditSubButtons = false;
      $timeout(function(){ $rootScope.speedDial.isOpen = false;}, 0);
      $rootScope.speedDial.showSpeedDial = false;
      $rootScope.speedDial.label = 'menu';
      $rootScope.speedDial.method = function(){};
      $rootScope.speedDial.subButtons = [
        {
          icon: 'ion-image',
          label: 'Add Image',
          show: true,
          method: function(){
            $scope.getPicture();
          }
        }
      ];
      $timeout(function(){
        $rootScope.speedDial.showSpeedDial = true;
      },700);

    });

    $scope.getPicture = function(){

      var option = {
        quality: 100,
        targetWidth:600,
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
              console.log($scope.blob);

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
        $scope.disableSendButton = true;
        $scope.progressCircular[0].className = 'md-primary ng-hide';
        console.error( message);
      }

      navigator.camera.getPicture(onSuccess, onFail, option);
      $scope.onCameraSuccess();
    };

    $scope.uploadPicture = function(image){
      var form = new FormData();
      form.append('picture',image);
      var uploadPostPictureRequestParameters = {
        image : form,
        token : window.localStorage.getItem('loginToken')
      };
      requests.uploadPostPicture(uploadPostPictureRequestParameters,function(result){
        $scope.postImage.push(result);
        $scope.disableSendButton = false;
        if(!$scope.$$phase){
          $scope.$apply();
        }
      },function(error){
        $rootScope.showCustomToast();
      });
    };

    $scope.onCameraSuccess = function () {
      $scope.disableSendButton = true;
      var imgWrapper = angular.element(document.getElementById('images-wrapper'));
      var width = Number(imgWrapper[0].style.width.replace('px', ''));
      imgWrapper[0].style.width = (width + 160) + 'px';
      $scope.progressCircular = angular.element(document.getElementById('progressCircular'));
      $scope.progressCircular[0].className = 'md-primary';
    };

    $scope.remove = function(elIndex, array){
      array.splice(elIndex, 1);
      var imgWrapper = angular.element(document.getElementById('images-wrapper'));
      var width = Number(imgWrapper[0].style.width.replace('px', ''));
      imgWrapper[0].style.width = (width - 160) + 'px';
    };

    $scope.sendPost=function(){
      if($scope.replyText ||  $scope.postImage){
        var addReplyRequestParameters = {
          id :  $rootScope.lastOpenedPost,
          text : $scope.replyText,
          images : $scope.postImage,
          token : window.localStorage.getItem('loginToken')
        };
        requests.addReply(addReplyRequestParameters, function (result) {
          $location.path('/post');
          console.log(result);
        }, function (error) {
          $rootScope.showCustomToast();
          console.log(error);
        });
      }else {
        $mdToast.show($mdToast.simple().textContent('Please add title or pictures'));
      }


    };

  });
