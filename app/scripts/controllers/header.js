'use strict';

appControllers.controller('HeaderController', ['$scope', '$http', '$rootScope','$location', '$window', 'UserService', 'AuthenticationService',
    function HeaderController($scope, $http, $rootScope, $location, $window, UserService, AuthenticationService) {
        $rootScope.authtoken = $window.sessionStorage.token;
        $scope.$on('user-logged', function (event, args) {
            try {
                AuthenticationService.isAuthenticated = true;
            } catch (e) {
            }
        });
        $scope.$on('user-loggedoff', function (event, args) {
            try {
                AuthenticationService.isAuthenticated = false;
            } catch (e) {
            }
        });

        $scope.logOut = function () {
          console.log(AuthenticationService.isAuthenticated)
            if (AuthenticationService.isAuthenticated) {
                UserService.logOut($rootScope.authtoken).success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    $rootScope.authtoken = '';
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

}]);

