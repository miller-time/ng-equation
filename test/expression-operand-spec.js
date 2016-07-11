'use strict';

describe('expressionOperand directive', function() {
    var $exceptionHandler,
        $scope,
        instantiate;

    beforeEach(module('ngEquation'));

    beforeEach(module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
    }));

    beforeEach(inject(function($compile, _$exceptionHandler_, $rootScope, $timeout) {
        $exceptionHandler = _$exceptionHandler_;

        instantiate = function(options) {
            var controller;

            // use $timeout to allow for exception assertions
            $timeout(function() {
                $scope = $rootScope.$new();
                $scope.myOptions = options;

                var element = angular.element(
                    '<expression-operand ' +
                        'operand-options="myOptions">' +
                    '</expression-operand>'
                );
                $compile(element)($scope);
                $scope.$apply();

                controller = element.isolateScope().operand;
            });
            $timeout.flush();

            return controller;
        };
    }));

    describe('with required options missing', function() {
        it('should raise a missing option exception', function() {
            var operandOptions = {
                class: 'foo',
                typeLabel: 'Foo'
            };
            instantiate(operandOptions);
            expect($exceptionHandler.errors[0].error).toEqual(
                'Operand options missing required property "getLabel".'
            );
        });
    });

    describe('with required option of incorrect type', function() {
        it('should raise an operand type exception', function() {
            var operandOptions = {
                class: 'foo',
                typeLabel: 'Foo',
                getLabel: 'foo?'
            };
            instantiate(operandOptions);
            expect($exceptionHandler.errors[0].error).toEqual(
                'Operand options property "getLabel" is incorrect type. Expected: "function". Got: "string".'
            );
        });
    });

    describe('with valid options', function() {
        it('should have a "getLabel" method for displaying its value', function() {
            var operandOptions = {
                class: 'foo',
                typeLabel: 'Foo',
                getLabel: jasmine.createSpy('fooOperand.getLabel')
            };
            var controller = instantiate(operandOptions);

            controller.options.getLabel();
            expect(operandOptions.getLabel).toHaveBeenCalled();
        });
    });
});
