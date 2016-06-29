require('angular');
require('angular-material');
require('angular-animate');
require('angular-aria');
angular.module('starterApp', ['ngMaterial', require('./users/Users').name]).config(['$mdThemingProvider', '$mdIconProvider', function($mdThemingProvider, $mdIconProvider){
  'ngInject';
  $mdIconProvider.defaultIconSet('./assets/svg/avatars.svg', 128);
  $mdIconProvider.icon('share', './assets/svg/share.svg', 24);
  $mdIconProvider.icon('menu', './assets/svg/menu.svg', 24);
  $mdThemingProvider.theme('default').primaryPalette('brown').accentPalette('red');
}]);