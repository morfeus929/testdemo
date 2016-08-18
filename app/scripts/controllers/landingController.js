'use strict';

/**
 * @ngdoc function
 * @name Hoodie.controller:LandingController
 * @description
 * # LandingController
 */
angular.module('Hoodie')

  .controller('LandingController', function ($scope, $rootScope,$timeout, $mdToast, $mdMedia,profile, $http, $location,requests) {

    $scope.$on('$viewContentLoaded',function(){
      $scope.showLanding = false;
      $scope.signUpForm = false;
      $scope.firstSignUpForm = false;
      $scope.secondSignUpForm = false;
      $scope.showErrorMessage = false;
      $rootScope.showNavigation = false;
      $scope.newUser = {};
      $scope.newUser.name = '';
      $scope.newUser.email = '';
      $scope.newUser.password = '';
      $scope.newUser.confirmPassword = '';
      $rootScope.showSpeedDial = false;
      $scope.landingBackButton = false;
      $rootScope.speedDial.showSpeedDial = false;
      $scope.checkLoginStatus();

    });

    $scope.$on('$locationChangeSuccess', function () {
      $rootScope.showNavigation = true;

    });

    $scope.checkLoginStatus = function () {
      if(window.localStorage.getItem('loginToken') !== null && window.localStorage.getItem('loginToken').length > 0){
        profile.getMyProfile(window.localStorage.getItem('loginToken'),function(result){
          console.log(result);
          $location.path('/home');
        },function(error,status){
          if(status === -1){
            $scope.showLanding = true;
          }else {
            window.localStorage.clear();
            $scope.showLanding = true;
            console.log(error);
          }
        });
      }else {
        $scope.showLanding = true;
      }
    };

    function loginFB(token,fbUserid) {
      requests.loginFB(token,function(result){
        $scope.serverToken = result;
        profile.getMyProfile(result,function(response){
          $scope.checkIfExists(response,token,fbUserid);
        },function(err){
          console.log(err);
        });
      },function(error){
        $rootScope.showCustomToast();
        console.log(error);
      });
    }

    $scope.checkIfExists = function(data,token,userId){
      if(data.groups.length === 0 ){
        $scope.getUserInfo(token,userId);
        $scope.signUpForm = true;
        $scope.secondSignUpForm = true;
        $scope.landingBackButton = true;
      }else {
        window.localStorage.setItem('loginToken', $scope.serverToken);
        $location.path('/home');
      }

    };

    function fbLoginSuccess(userData) {
      console.log(userData);
      loginFB(userData.authResponse.accessToken, userData.authResponse.userID);
    }

    function fbLoginError(error) {
      if(error.errorCode == "4201"){
        facebookConnectPlugin.login(['public_profile'], fbLoginSuccess, fbLoginError);
      }else {
        $mdToast.show($mdToast.simple().textContent('To sign in with Facebook, please accept the Hoodie app permissions required.'));
        console.log( error);
      }
    }

    function fbGetStatusSuccess (userData){
      if (userData.status === 'connected') {
        loginFB(userData.authResponse.accessToken, userData.authResponse.userID);
      } else if (userData.status === 'not_authorized') {
        facebookConnectPlugin.login(['public_profile'], fbLoginSuccess, fbLoginError);
      } else {
        facebookConnectPlugin.login(['public_profile'], fbLoginSuccess, fbLoginError);
      }
    }

    function fbGetStatusError (error){
      $rootScope.showCustomToast();
      console.log(error);
    }

    $scope.facebookLogin = function () {
      facebookConnectPlugin.getLoginStatus( fbGetStatusSuccess, fbGetStatusError);
    };

    $scope.login = function (email,password,signIn) {
      if(signIn){
        $scope.signInsubmited = true;
        $timeout(function(){
          $scope.signInsubmited = false;
        },3000);
      }

      var loginRequestParameters = {
        email : email,
        password: password
      };
      requests.login(loginRequestParameters,function(result){
        window.localStorage.setItem('loginToken',result);
        if(signIn){
          profile.getMyProfile(result,function(response){
            $location.path('/home');
            console.log(response);
          },function(err){
            $rootScope.showCustomToast();
            console.log(err);
          });
        }
        else {
          $scope.editMandatoryProfileDetails();
        }
      },function(error){
        console.log(error);
        $scope.showErrorMessage = true;
        $scope.errorMessage = 'Invalid email or password';
        $timeout(function(){
          $scope.showErrorMessage = false;
        },3000);
      });


    };

    $scope.editMandatoryProfileDetails = function(){
      var editMandatoryProfileDetailsRequestParameters = {
        firstName :  $scope.createAccountData.firstName,
        lastName:  $scope.createAccountData.lastName,
        street :  $scope.createAccountData.street,
        apartment :  $scope.createAccountData.apartment,
        city :  $scope.createAccountData.city,
        state :  $scope.createAccountData.state,
        zip :  $scope.createAccountData.zip,
        token : window.localStorage.getItem('loginToken')
      };

      requests.editMandatoryProfileDetails(editMandatoryProfileDetailsRequestParameters,function(result){
        console.log(result);
        profile.getMyProfile(window.localStorage.getItem('loginToken'),function(response){
          $location.path('/home');
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

    $scope.createAccount = function (firstName,lastName,email,password,street,streetNumber,apartment,city,state,zip) {
      if(street && streetNumber && apartment && city && state && zip){
        $scope.createAccountData = {
          firstName : firstName,
          lastName : lastName,
          email : email,
          password: password,
          street :streetNumber+' '+street,
          apartment: apartment,
          city : city,
          state : state,
          zip : zip
        };
        if(!password){
          window.localStorage.setItem('loginToken',$scope.serverToken);
          $scope.editMandatoryProfileDetails();
        }
        if( $scope.createAccountData.password){
          var createAccountRequestParameters = {
            email :  $scope.createAccountData.email,
            password:  $scope.createAccountData.password
          };
          requests.createAccount(createAccountRequestParameters,function(result){
            console.log(result);
            $scope.login( $scope.createAccountData.email, $scope.createAccountData.password,false);
          },function(error){
            $scope.errorMessage = 'This email is already linked to existing account';
            $scope.showErrorMessage = true;
            console.log(error);
          });
        }
        else {
          $scope.errorMessage = 'Invalid password. Try again';
          $scope.showErrorMessage = true;
        }
      }
      else {
        $scope.secondFormError = true;
        $timeout(function(){
          $scope.secondFormError = false;
        },3000)
      }
    };

    $scope.landingBack = function (pass) {
      $scope.showErrorMessage = false;
      function onSuccessLogOut(){
        console.log('logout true');
      }
      function onErrorLogOut(){
        console.log('logout false');
      }
      if($scope.firstSignUpForm){
        $scope.signUpForm = !$scope.signUpForm;
        $scope.firstSignUpForm = !$scope.firstSignUpForm;
        $scope.landingBackButton = false;
      }
      if($scope.secondSignUpForm ){
        if(pass){
          $scope.landingBackButton = true;
          $scope.firstSignUpForm = true;
          $scope.secondSignUpForm = false;
        }
        else {
          $scope.signUpForm = false;
          $scope.firstSignUpForm = false;
          $scope.secondSignUpForm = false;
          $scope.landingBackButton = false;
          facebookConnectPlugin.logout(onSuccessLogOut,onErrorLogOut);
        }

      }
    };

    $scope.signUp = function () {
      $scope.showErrorMessage = false;
      $scope.signUpForm = true;
      $scope.firstSignUpForm = true;
      $scope.landingBackButton=true;
    };

    $scope.firstFormSubmit = function (firstName,lastName,email,password) {
      if(firstName && lastName && email && password){
        $scope.showErrorMessage = false;
        $scope.firstSignUpForm = false;
        $scope.secondSignUpForm = true;
      }else {
        $scope.firtsFormError = true;
        $timeout(function(){
          $scope.firtsFormError = false;
        },3000)
      }

    };

    $scope.getUserInfo = function(token, userId) {
       $http({
         method: 'GET',
         url: 'https://graph.facebook.com/v2.5/' + userId + '?fields=name,last_name,first_name,email&access_token=' + token
       })
       .success(function (result) {
         $scope.signUpFirstName = result.first_name;
         $scope.signUpLastName = result.last_name;
         $scope.signUpEmail = result.email;
       })
       .error(function (error) {
        console.log(error);
       });
     };

});



