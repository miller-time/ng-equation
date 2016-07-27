'use strict';

angular.module('ngEquation')
    .factory('MissingOperandClassException', function() {
        function MissingOperandClassException(className) {
            this.message = 'Available operands does not include an operand with class "' + className + '".';
            this.stack = (new Error()).stack;
        }
        MissingOperandClassException.prototype = Object.create(Error.prototype);
        MissingOperandClassException.prototype.constructor = MissingOperandClassException;
        MissingOperandClassException.prototype.name = 'MissingOperandClassException';
        return MissingOperandClassException;
    });
