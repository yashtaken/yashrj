angular.module('tableApp', [])
  .controller('TableController', function() {
    var vm = this;
    vm.sortKey = 'id';
    vm.reverse = false;

    vm.students = [
      { id: 1, name: 'Anita', age: 20, grade: 'A' },
      { id: 2, name: 'Ravi', age: 22, grade: 'B' },
      { id: 3, name: 'Sunita', age: 19, grade: 'A' },
      { id: 4, name: 'John', age: 21, grade: 'C' }
    ];

    vm.sort = function(key) {
      if (vm.sortKey === key) {
        vm.reverse = !vm.reverse;
      } else {
        vm.sortKey = key;
        vm.reverse = false;
      }
    };
  });
