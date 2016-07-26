'use strict';

angular.module('exampleApp')
    .constant('fruits', ['apple', 'banana', 'lime', 'orange', 'plum'])
    .factory('capitalize', function() {
        return function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        };
    })
    .factory('fruitOperand', function($filter, $uibModal, capitalize, fruits) {
        var launchEditModal = function(value) {
            var modalInstance = $uibModal.open({
                size: 'sm',
                templateUrl: 'templates/fruit-select-modal.html',
                controller: function($uibModalInstance, $scope) {
                    $scope.fruits = fruits.map(function(fruit) {
                        return {label: capitalize(fruit), value: fruit};
                    });
                    $scope.fruit = {
                        selected: []
                    };

                    // select current fruit in dropdown
                    var current = $filter('filter')($scope.fruits, function(fruit) {
                        return fruit.value === value;
                    });
                    if (current[0]) {
                        $scope.fruit.selected.push({obj: current[0]});
                    } else {
                        $scope.fruit.selected.push({});
                    }

                    $scope.addAnother = function() {
                        $scope.fruit.selected.push({});
                    };

                    $scope.submit = function() {
                        var values = $scope.fruit.selected.map(function(fruit) {
                            return fruit.obj.value;
                        });
                        $uibModalInstance.close({value: values, addMultiple: true});
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss();
                    };
                }
            });

            return modalInstance.result;
        };

        return {
            config: function() {
                return {
                    class: 'fruit',
                    typeLabel: 'Fruit',
                    editMetadata: function(operand) {
                        return launchEditModal(operand.value);
                    },
                    getLabel: function(operand) {
                        return operand.value ? capitalize(operand.value) : 'N/A';
                    }
                };
            }
        };
    });
