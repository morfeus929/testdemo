'use strict';

angular.module('Hoodie')
  .directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          return scope.$eval(attrs.compile);
        },
        function(value) {
          element.html(value);
          $compile(element.contents())(scope);
        }
      );
    };
  }])
  .directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return;


      ngModel.$render = function() {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };


      element.on('blur keyup change paste', function() {
        scope.$evalAsync(read);
      });
      read();


      function read() {
        function replaceStyleAttr (str) {
          return str.replace(/(<[\w\W]*?)(style)([\w\W]*?>)/g, function (a, b, c, d) {
            return b + 'replaced' + d;
          });
        }

        function removeTagsExcludeA (str) {
          return str.replace(/<\/?((?!a)(\w+))\s*[\w\W]*?>/g, '');
        }
        var html = element.html();
        html = removeTagsExcludeA(replaceStyleAttr(html));
        console.log(html);

        if ( attrs.stripBr && html == '<br>' ) {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
}])
  .filter('parseUrlFilter', function () {
  return function (text, target) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = text.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
    return replacedText;

    };
})
  .filter('thumbImage',function(){
    return function (text){
      var index = text.lastIndexOf('.');
      var thumb =   text.slice(0, index) + '-thumb' + text.slice(index);
      return thumb;
    }
  });
