'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('Hoodie')
  .controller('newPostController', function($scope,$rootScope, $timeout,$http,$mdDialog,$mdToast,$location ,requests) {

    $scope.$on('$viewContentLoaded',function(){
      $rootScope.speedDial.showSpeedDial = false;
      $rootScope.speedDial.isOpen = true;
      $rootScope.homeIcon=false;
      $rootScope.searchIcon=false;
      $rootScope.inviteIcon=false;
      $rootScope.showEdit=false;
      $rootScope.showSend=true;
      $scope.postText = '';
      $scope.progressCircular = false;
      $rootScope.link = '';
      $scope.postImage = [];
      $rootScope.pageName='New Post';
      $rootScope.hideEditSubButtons = false;
      $scope.select = ['Area','Building'];
      $scope.selected =  $scope.select[$rootScope.selectedTab];
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
              console.log(this.result.byteLength);
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
        console.log(2)
        $scope.postImage.push(result);
        $scope.disableSendButton = false;
        if(!$scope.$$phase){
          $scope.$apply();
        }
      },function(error){
        $rootScope.showCustomToast();
        console.log(error);
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

    $scope.sendPost = function(){
      if($scope.postText){
        $location.path('/home');
        var addPostRequestParameters = {
          post : $scope.postText,
          image :  $scope.postImage,
          token : window.localStorage.getItem('loginToken')
        };
        if($scope.selected === 'Area'){
          $rootScope.activeTab = 0;
          addPostRequestParameters.groupIds = $rootScope.users.groups[0].id;
          requests.addPost(addPostRequestParameters,function(response){
            console.log(response);
          },function(error){
            console.log(error);
          });
        }
        if($scope.selected === 'Building') {
          $rootScope.activeTab = 1;
          addPostRequestParameters.groupIds = $rootScope.users.groups[1].id;
          requests.addPost(addPostRequestParameters,function(response){
            console.log(response);
          },function(error){
            console.log(error);
          });
        }
      }else {
        $mdToast.show($mdToast.simple().textContent('Please add description'));
      }

    };

  });
