require 'angular'
require 'angular-material'
require 'angular-animate'
require 'angular-aria'

angular
.module 'starterApp', [
  'ngMaterial'
  require './users/Users' .name
]

.config ($md-theming-provider, $md-icon-provider)!->
  'ngInject'
  $md-icon-provider.default-icon-set './assets/svg/avatars.svg', 128
  $md-icon-provider.icon 'share', './assets/svg/share.svg', 24
  $md-icon-provider.icon 'menu', './assets/svg/menu.svg', 24

  $md-theming-provider
  .theme 'default'
  .primary-palette 'brown'
  .accent-palette 'red'
