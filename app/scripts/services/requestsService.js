'use strict';

angular.module('Hoodie')
  .factory('requests', function($http,$mdToast) {
    var myService = {

      contacts: function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'POST',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/contacts',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token

          },
          data: {
            'emails': requestParameters.emails
          }
        }).
        success(function (result) {
          successCallback(result);
        }).
        error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      createAccount: function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'POST',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/account',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            'email': requestParameters.email,
            'password': requestParameters.password
          }
        })
          .success(function (result) {
            successCallback(result);
          })
          .error(function (error,status) {
            if(status === -1){
              $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
            }else {
              errorCallback(error);
            }
          });
      },

      login : function (requestParameters,successCallback,errorCallback) {
        $http({
          method: 'POST',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/login',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            'email': requestParameters.email,
            'password': requestParameters.password
          }
        }).success(function (result) {
          successCallback(result);
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      loginFB: function(fbToken,successCallback,errorCallback){
        $http({
          method: 'POST',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/login',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            'facebook_token': fbToken
          }
        }).success(function (result) {
          successCallback(result);

        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      logout : function(token,successCallback,errorCallback){
        $http({
          method: 'POST',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/logout',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer: '+token
          }
        }).success(function (result) {
          successCallback(result);
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      invites : function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'POST',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/invites',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token

          },
          data: {
            'emails': requestParameters.emails
          }
        })
          .success(function (result) {
            successCallback(result);
          }).error(function (error) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      neighbours: function(token,successCallback,errorCallback){
        $http({
          method: 'GET',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/profiles',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+token
          }

        })
          .success(function (result) {
            successCallback(result);
          })
          .error(function (error,status) {
            if(status === -1){
              $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
            }else {
              errorCallback(error);
            }
          });
      },

      specificProfile: function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'GET',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/profiles/'+requestParameters.id,
          headers: {
            'Authorization': 'Bearer: '+requestParameters.token
          }
        })
          .success(function (result) {
            successCallback(result);
          })
          .error(function (error,status) {
            if(status === -1){
              $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
            }else {
              errorCallback(error);
            }
          });
      },

      editMandatoryProfileDetails: function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'PUT',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/profiles',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token
          },
          data:{
            'firstName': requestParameters.firstName,
            'lastName': requestParameters.lastName,
            'street': requestParameters.street,
            'apartment': requestParameters.apartment,
            'city': requestParameters.city,
            'state': requestParameters.state,
            'zipCode': requestParameters.zip
          }
        })
        .success(function (result) {
          successCallback(result);
        }).
        error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      editProfile: function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'PUT',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/profiles',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token
          },
          data:{
            'firstName': requestParameters.firstName,
            'lastName': requestParameters.lastName,
            'status': requestParameters.status,
            'work': [requestParameters.work],
            'likes':[requestParameters.likes],
            'places': requestParameters.places,
            'sports':[requestParameters.sports],
            'picture' : requestParameters.picture
          }
        })
        .success(function (result) {
          successCallback(result);
        }).
        error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      uploadedProfilePictures : function(token,successCallback,errorCallback){
        $http({
          method: 'GET',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/profiles/@me/pictures',
          headers: {
            'Authorization': 'Bearer: '+token
          }
        })
        .success(function (result) {
          successCallback(result);
        })
        .error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      uploadProfilePicture : function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'POST',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/profiles/@me/pictures',
          headers: {
            'Content-Type': undefined,
            'Authorization': 'Bearer: '+requestParameters.token
          },
          transformRequest: angular.identity,
          data : requestParameters.image
        })
        .success(function (result) {
          successCallback(result);
        })
        .error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      posts: function(requestParameters,successCallback,errorCallback){

        $http({
          method: 'GET',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/posts?groupIds=['+requestParameters.groupIds+']&lastPost='+requestParameters.lastPost+'&count='+requestParameters.count,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token

          }
        }).success(function (result) {
          successCallback( result);
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      specificPost: function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'GET',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/posts/'+requestParameters.id,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token
          }
        }).success(function (result) {
          successCallback(result);
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      addPost: function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'POST',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/posts',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token

          },
          data: {
            'groupIds': [requestParameters.groupIds],
            'content': requestParameters.post,
            'images' : requestParameters.image
          }
        }).success(function (result) {
          successCallback(result);
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      uploadPostPicture : function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'POST',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/posts/@me/images',
          headers: {
            'Content-Type': undefined,
            'Authorization': 'Bearer: '+requestParameters.token
          },
          transformRequest: angular.identity,
          data : requestParameters.image
        })
        .success(function (result) {
          successCallback(result);
        })
        .error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      addReply : function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'POST',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/posts/'+requestParameters.id+'/reply',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token

          },
          data: {
            'content':requestParameters.text,
            'images':requestParameters.images
          }
        }).success(function (result) {
          successCallback(result);
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      likeUnlikePost: function(requestParameters,successCallback,errorCallback){
        $http({
          method: requestParameters.requestMethods,
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/posts/'+requestParameters.id+'/like',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token

          }
        }).success(function (result) {
          successCallback(result);
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      fagsSpecificPost : function(requestParameters,successCallback,errorCallback){
        $http({
          method: requestParameters.requestMethods,
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/posts/'+requestParameters.id+'/flag',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token

          }
        }).success(function (result) {
          successCallback(result);
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      news : function(token,successCallback,errorCallback){
        $http({
          method: 'GET',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/news?lastPost=100&count=100',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+token
          }
        }).success(function (result) {
          successCallback(result);
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      },

      specificNews : function(requestParameters,successCallback,errorCallback){
        $http({
          method: 'GET',
          url: 'http://ec2-52-72-11-2.compute-1.amazonaws.com/news/'+requestParameters.id,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: '+requestParameters.token

          }
        }).success(function (result) {
          successCallback(result);
        }).error(function (error,status) {
          if(status === -1){
            $mdToast.show($mdToast.simple().textContent('You don\'t have internet connection!'));
          }else {
            errorCallback(error);
          }
        });
      }

    };
    return myService;
  });

