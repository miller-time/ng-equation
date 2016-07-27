'use strict';

angular.module('ngEquation')
    .factory('OperandOptionTypeException', function() {
        function OperandOptionTypeException(property, expectedType, propertyType) {
            this.message = 'Operand options property "' + property + '" is incorrect type. ' +
                'Expected: "' + expectedType + '". ' +
                'Got: "' + propertyType + '".';
            this.stack = (new Error()).stack;
        }
        OperandOptionTypeException.prototype = Object.create(Error.prototype);
        OperandOptionTypeException.prototype.constructor = OperandOptionTypeException;
        OperandOptionTypeException.prototype.name = 'OperandOptionTypeException';
        return OperandOptionTypeException;
    });
