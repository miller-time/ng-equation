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

        instantiate = function(options, group) {
            var controller;

            // use $timeout to allow for exception assertions
            $timeout(function() {
                $scope = $rootScope.$new();
                $scope.myOptions = options;
                $scope.myGroup = group;

                var element = angular.element(
                    '<expression-operand ' +
                        'operand-options="myOptions" ' +
                        'group="myGroup">' +
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
                typeLabel: 'Foo',
                getLabel: jasmine.createSpy('fooOperand.getLabel')
            };
            instantiate(operandOptions);
            expect($exceptionHandler.errors[0].error).toEqual(
                'Operand options missing required property "editMetadata".'
            );
        });
    });

    describe('with required option of incorrect type', function() {
        it('should raise an operand type exception', function() {
            var operandOptions = {
                class: 'foo',
                typeLabel: 'Foo',
                getLabel: jasmine.createSpy('fooOperand.getLabel'),
                editMetadata: 'edit?'
            };
            instantiate(operandOptions);
            expect($exceptionHandler.errors[0].error).toEqual(
                'Operand options property "editMetadata" is incorrect type. Expected: "function". Got: "string".'
            );
        });
    });

    describe('with valid options', function() {
        var controller,
            operandOptions;

        beforeEach(function() {
            operandOptions = {
                class: 'foo',
                typeLabel: 'Foo',
                getLabel: jasmine.createSpy('fooOperand.getLabel'),
                editMetadata: jasmine.createSpy('fooOperand.editMetadata')
            };
            controller = instantiate(operandOptions);
        });

        it('should have a "getLabel" method for displaying its value', function() {
            controller.options.getLabel();
            expect(operandOptions.getLabel).toHaveBeenCalled();
        });

        it('should have an "editMetadata" method for setting its value', function() {
            controller.options.editMetadata();
            expect(operandOptions.editMetadata).toHaveBeenCalled();
        });
    });

    describe('in a group', function() {
        it('should immediately call editMetadata', function() {
            var operandOptions = {
                class: 'foo',
                typeLabel: 'Foo',
                getLabel: function() {
                    return 'foo';
                },
                editMetadata: jasmine.createSpy('fooOperand.editMetadata')
            };
            instantiate(operandOptions, {message: "I'm a group!"});

            expect(operandOptions.editMetadata).toHaveBeenCalled();
        });
    });
});
