'use strict';

angular.module('Hoodie')
  .factory('profile', function($http,$rootScope,$mdToast) {
    var myService = {
      getMyProfile : function(token,successCallback,errorCallback){
        $http({
          method: 'GET',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/profiles/@me',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+token

          }
        })
          .success(function (result) {
            $rootScope.users = result;
            $rootScope.users.avatar = 'images/empty-picture.png';
            successCallback(result);


          if(!$rootScope.$$phase){
            $rootScope.$apply();
          }
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
            errorCallback(error,status);
          }else {
            errorCallback(error);

          }

        });
      }
    };
    return myService;
  });
