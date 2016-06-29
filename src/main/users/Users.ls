angular
  .module 'users', []

  .controller 'UserController', [
    'userService'
    '$mdSidenav'
    '$mdBottomSheet'
    '$timeout'
    '$log'
    require './UserController' .UserController
  ]

  .service 'userService', [
    '$q'
    require './UserService' .UserService
  ]

exports.name = 'users'
