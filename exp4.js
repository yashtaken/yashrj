angular.module('billApp', [])
  .controller('BillController', function() {
    var vm = this;
    vm.records = [
      { id: 1, name: 'Electricity', amount: 1200, date: new Date(2025,0,15) },
      { id: 2, name: 'Internet', amount: 800, date: new Date(2025,0,18) }
    ];

    vm.newRecord = { name: '', amount: null, date: null };

    vm.addRecord = function(isValid) {
      if (!isValid) {
        alert('Please fill all required fields correctly.');
        return;
      }
      var newId = vm.records.length ? Math.max.apply(null, vm.records.map(r=>r.id)) + 1 : 1;
      vm.records.push({
        id: newId,
        name: vm.newRecord.name,
        amount: vm.newRecord.amount,
        date: vm.newRecord.date ? new Date(vm.newRecord.date) : new Date()
      });
      vm.newRecord = { name: '', amount: null, date: null };
    };

    vm.deleteRecord = function(id) {
      vm.records = vm.records.filter(r => r.id !== id);
    };
  });
