'use strict';

angular.module('ngEquation')
    .factory('MissingOperandOptionException', function() {
        function MissingOperandOptionException(property) {
            this.message = 'Operand options missing required property "' + property + '".';
            this.stack = (new Error()).stack;
        }
        MissingOperandOptionException.prototype = Object.create(Error.prototype);
        MissingOperandOptionException.prototype.constructor = MissingOperandOptionException;
        MissingOperandOptionException.prototype.name = 'MissingOperandOptionException';
        return MissingOperandOptionException;
    });
