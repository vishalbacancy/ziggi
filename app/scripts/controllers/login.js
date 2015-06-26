'use strict';

appControllers.controller('LoginController', ['$scope', '$http', '$rootScope','$location', '$window', '$cookieStore', 'UserService', 'AuthenticationService',
    function LoginController($scope, $http, $rootScope, $location, $window, $cookieStore, UserService, AuthenticationService) {
        //Admin User Controller (signIn, logOut)
        //$scope.remember = false;
        if($cookieStore.get('count') >= 3) {

          $('#emailID').attr('disabled', 'disabled');
          $('#inputPassword').attr('disabled', 'disabled');
          setTimeout(function() { $('#emailID').removeAttr('disabled'); }, 30000);
          setTimeout(function() { $('#inputPassword').removeAttr('disabled'); }, 30000);
          setTimeout(function() { $('#blockAccess').attr('display', 'hide');  }, 30000);  
          setTimeout(function() { $cookieStore.put('count',0);}, 30000);  
        }
        $scope.email = '';
        $scope.emailId = '';
        $scope.password = '';
        $scope.isForgotPassword = false;
        $scope.newPassword = '';
        $scope.confirmNewPassword ='';
        $scope.blockLogin = false;
        var count = 0;
        var now = new Date();
        var exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
        console.log(exp);
        if($rootScope.authtoken){
          $location.path("/home"); 
        }

        $scope.login = function (email, password) {
            if($cookieStore.get('count') >= 2) {
              console.log("hello")
              $scope.blockLogin = true;
              $('#emailID').attr('disabled', 'disabled');
              $('#inputPassword').attr('disabled', 'disabled');
              $scope.email = '';
              $scope.password = '';
              setTimeout(function() { $('#emailID').removeAttr('disabled'); }, 30000);
              setTimeout(function() { $('#inputPassword').removeAttr('disabled'); }, 30000);
              setTimeout(function() { $('#blockAccess').attr('display', 'hide');  }, 30000);  
              setTimeout(function() { $cookieStore.put('count',0);}, 30000);  
            }
            //$scope.blockLogin = false;
            UserService.signIn(email,password).success(function(data) {
              if(data[0].status == "success"){
                  AuthenticationService.isAuthenticated = true;
                  AuthenticationService.userName = $scope.email;
                  $window.sessionStorage.token = data[0].authentication_token;
                  $rootScope.authtoken = data[0].authentication_token;
                  $rootScope.$broadcast('user-logged');
                  $location.path("/home"); 
              }
              else if(email == null || password == null){
                $('#message').fadeIn('slow');
                  $scope.message = "Email and Password should not be empty";
                  setTimeout(function() {$scope.clearmessage();}, 1000);
              }
              else if(data[0].status == "fail" && email !== null && password !== null) {
                  $('#message').fadeIn('slow');
                  $scope.message = data[0].msg;
                  setTimeout(function() {$scope.clearmessage();}, 1000);
                  count ++;
                  $cookieStore.put('count',count);                
              }
              else{
                  $location.path("/login");
              }
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
            console.log("hello");
        }; 

        
        $scope.clearmessage = function(){
          if(angular.element("#message").html()!=undefined){
            setTimeout(function() {$('#message').fadeOut('slow');}, 2000);
          }   
        }

        $scope.forgotPassword = function(){
          $scope.isForgotPassword = true;
        }

        $scope.sendEmail = function(email){
          $cookieStore.put('count',count);   
          UserService.forgotPassword(email).success(function(data) {
                  console.log(data);
                  if(data.status == "fail"){
                    $scope.message = data.msg;  
                    setTimeout(function() {$scope.clearmessage();}, 1000);
                }
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        //console.log($window.location.href);
        $scope.changePassword = function(email, password, confirmPassword) {
            $cookieStore.put('count',count);   
            UserService.changePassword(email, $rootScope.reset_token[1], password, confirmPassword).success(function(data) {
          
                  if(data.status == "success") {
                    $location.path("/login");
                  }
                  else if(data.status == "fail"){
                    $scope.message = data.msg;  
                    setTimeout(function() {$scope.clearmessage();}, 1000);
                  }
                  console.log(data);
              
            }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
            });

        }



        $scope.logOut = function () {
          $cookieStore.put('count',count);   
          console.log(AuthenticationService.isAuthenticated)
            if (AuthenticationService.isAuthenticated) {
                UserService.logOut($rootScope.authtoken).success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    $rootScope.authtoken = '';
                    delete $window.sessionStorage.token;
                    $rootScope.$broadcast('user-loggedoff');
                    $location.path("/login");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/login");
            }
        }

console.log(AuthenticationService.isAuthenticated)
    }]);