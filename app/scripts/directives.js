appDirectives.directive('authenticatedUser', ['AuthenticationService', function (AuthenticationService) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {

            function toggleVisibilityBasedOnAuthentication() {
                if (AuthenticationService.isAuthenticated) {
                    element.removeClass('display-hide');
                } else {
                    element.addClass('display-hide');
                }
            }

            toggleVisibilityBasedOnAuthentication();

            scope.$on('user-logged', toggleVisibilityBasedOnAuthentication);

            scope.$on('user-loggedoff', toggleVisibilityBasedOnAuthentication);
        }
    };
}]);

appDirectives.directive("headerLayout", function () {

    // Return the directive configuration.
    return ({
        controller: "HeaderController",
        link: link,
        restrict: "E",
        templateUrl: "views/header.html"
    });

    // I bind the JavaScript events to the scope.
    function link(scope, element, attributes) {
        console.log("directive linking.");
    }
});


// changes started
appDirectives.directive("footerLayout", function () {

    // Return the directive configuration.
    return ({
        controller: "FooterController",
        link: link,
        restrict: "E",
        templateUrl: "views/footer.html"
    });

    // I bind the JavaScript events to the scope.
    function link(scope, element, attributes) {
        console.log("directive linking.");
    }
});

// appDirectives.directive('ngDebounce', function ($timeout) {
//   return {
//       restrict: 'A',
//       require: 'ngModel',
//       priority: 99,
//       link: function (scope, elm, attr, ngModelCtrl) {
//           if (attr.type === 'password' || attr.type === 'submit') {
//               return;
//           }

//           var delay = parseInt(attr.ngDebounce, 3);
//           if (isNaN(delay)) {
//               delay = 30000;
//           }

//           elm.unbind('input');

//           var debounce;
//           elm.bind('input', function () {
//               $timeout.cancel(debounce);
//               debounce = $timeout(function () {
//                   scope.$apply(function () {
//                       ngModelCtrl.$setViewValue(elm.val());
//                   });
//               }, delay);
//           });
//           elm.bind('blur', function () {
//               scope.$apply(function () {
//                   ngModelCtrl.$setViewValue(elm.val());
//               });
//           });
//       }
//   };
// });