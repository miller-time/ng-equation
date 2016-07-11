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
        it('should raise a missing operand exception', function() {
            instantiate({class: 'foo'});
            expect($exceptionHandler.errors[0].toString()).toEqual(
                'Operand options missing required property "label".'
            );
        });
    });

    describe('with required option of incorrect type', function() {
        it('should raise an operand type exception', function() {
            instantiate({class: 2, label: 'Foo'});
            expect($exceptionHandler.errors[0].toString()).toEqual(
                'Operand options property "class" is incorrect type. Expected: "string". Got: "number".'
            );
        });
    });

    describe('with valid options', function() {
        it('should have class and label', function() {
            var controller = instantiate({class: 'foo', label: 'Bar'});
            expect(controller.options.class).toEqual('foo');
            expect(controller.options.label).toEqual('Bar');
        });
    });
});
