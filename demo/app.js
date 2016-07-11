angular.module('exampleApp', ['ngEquation'])
    .controller('ExampleCtrl', function() {
        var ctrl = this;

        ctrl.availableOperands = [
            {label: 'A', class: 'a'},
            {label: 'B', class: 'b'},
            {label: 'C', class: 'c'},
            {label: 'D', class: 'd'},
            {label: 'E', class: 'e'},
            {label: 'F', class: 'f'}
        ];

        ctrl.config = {
            availableOperands: ctrl.availableOperands
        };

        ctrl.equationOne = {
            operator: 'OR',
            operands: [
                {label: 'A', class: 'a'},
                {label: 'B', class: 'b'},
                {label: 'C', class: 'c'},
                {
                    operator: 'AND',
                    operands: [
                        {label: 'D', class: 'd'},
                        {label: 'E', class: 'e'},
                        {label: 'F', class: 'f'}
                    ]
                }
            ]
        };

        ctrl.equationTwo = {
            operator: 'AND NOT',
            operands: [
                {label: 'X', class: 'a'},
                {label: 'Y', class: 'b'},
                {label: 'Z', class: 'c'}
            ]
        };
    });