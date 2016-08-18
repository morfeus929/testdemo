'use strict';

angular.module('Hoodie')
  .directive('showOnceBackgroundLoaded', function () {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attributes) {
        element.addClass('ng-hide');
        var image = new Image();
        image.onload = function () {
          scope.$apply(function () {
            element.css({ backgroundImage: 'url("' + attributes.showOnceBackgroundLoaded + '")' });
            element.removeClass('ng-hide');
            if(element.next().hasClass('md-primary')){
              element.next().addClass('ng-hide');
            }
          });
        };
        image.src = attributes.showOnceBackgroundLoaded;
      }
    };
  })
  .directive('imageonloadnewpost', function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.bind('load', function() {
          element.removeClass('ng-hide').addClass('new-post-img');
          element.parent().next().addClass('md-primary ng-hide');
          element.next().removeClass('ng-hide').addClass('md-icon-button close');
        });
      }
    };
  })
  .directive('slider', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.bind('load', function() {
        var ele = element[0];
        if(ele.naturalHeight >= ele.naturalWidth){
          ele.className = 'image-portrait';
        }
        else {
          ele.className = 'image-landscape';
        }
        ele.src = '';
        ele.style.display = 'inline-block';
      });

    }
  };
});
