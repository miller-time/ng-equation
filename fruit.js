'use strict';

angular.module('exampleApp')
    .constant('fruits', ['apple', 'banana', 'lime', 'orange', 'plum'])
    .factory('capitalize', function() {
        return function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        };
    })
    .factory('fruitOperand', function($uibModal, capitalize, fruits) {
        var launchEditModal = function() {
            var modalInstance = $uibModal.open({
                size: 'sm',
                templateUrl: 'templates/fruit-select-modal.html',
                controller: function($uibModalInstance, $scope) {
                    $scope.fruits = fruits.map(function(fruit) {
                        return {label: capitalize(fruit), value: fruit};
                    });
                    $scope.fruit = {};
                    $scope.submit = function() {
                        var value = $scope.fruit.selected && $scope.fruit.selected.value;
                        $uibModalInstance.close(value);
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
                    editMetadata: function() {
                        return launchEditModal();
                    },
                    getLabel: function(operand) {
                        return operand.value ? capitalize(operand.value) : 'N/A';
                    }
                };
            }
        };
    });
