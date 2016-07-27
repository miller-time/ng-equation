'use strict';

angular.module('ngEquation')
    .factory('UnknownOperandClassException', function() {
        function UnknownOperandClassException(className) {
            this.message = 'Available operands does not include an operand with class "' + className + '".';
            this.stack = (new Error()).stack;
        }
        UnknownOperandClassException.prototype = Object.create(Error.prototype);
        UnknownOperandClassException.prototype.constructor = UnknownOperandClassException;
        UnknownOperandClassException.prototype.name = 'UnknownOperandClassException';
        return UnknownOperandClassException;
    });
