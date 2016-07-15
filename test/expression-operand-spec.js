'use strict';

describe('expressionOperand directive', function() {
    var $exceptionHandler,
        $scope,
        $q,
        instantiate;

    beforeEach(module('ngEquation'));

    beforeEach(module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
    }));

    beforeEach(inject(function($compile, _$exceptionHandler_, $rootScope, $timeout, _$q_) {
        $exceptionHandler = _$exceptionHandler_;
        $q = _$q_;

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
                editMetadata: jasmine.createSpy('fooOperand.editMetadata').and.callFake(function() {
                    return 'newValue';
                })
            };
            controller = instantiate(operandOptions);
        });

        it('should have a "getLabel" method for displaying its value', function() {
            controller.options.getLabel();
            expect(operandOptions.getLabel).toHaveBeenCalled();
        });

        it('should have an "editMetadata" method for setting its value', function() {
            controller.editMetadata();
            expect(operandOptions.editMetadata).toHaveBeenCalled();

            // trigger `$q.when()` wrapped around result
            $scope.$apply();
            expect(controller.options.value).toEqual('newValue');
        });

        it('should not call "removeFromGroup" if pre-existing value and operand\'s "editMetadata" does not return a value', function() {
            controller.options.value = 'existing_value';
            controller.options.editMetadata = function() { return undefined; };
            controller.removeFromGroup = jasmine.createSpy('removeFromGroupSpy');
            controller.editMetadata();
            $scope.$apply();
            expect(controller.removeFromGroup).not.toHaveBeenCalled();
        });

        it('should call "removeFromGroup" method when no initial value and operand\'s "editMetadata" does not return a value', function() {
            delete controller.options.value;
            controller.options.editMetadata = function() { return undefined; };
            controller.removeFromGroup = jasmine.createSpy('removeFromGroupSpy');
            controller.editMetadata();
            $scope.$apply();
            expect(controller.removeFromGroup).toHaveBeenCalled();
        });

        it('should not call "removeFromGroup" if pre-existing value and operand\'s "editMetadata" is a rejected promise', function() {
            controller.options.value = 'existing_value';
            var deferred = $q.defer();
            controller.options.editMetadata = function() { return deferred.promise; };
            controller.removeFromGroup = jasmine.createSpy('removeFromGroupSpy');
            controller.editMetadata();
            deferred.reject();
            $scope.$apply();
            expect(controller.removeFromGroup).not.toHaveBeenCalled();
        });

        it('should call "removeFromGroup" method when no initial value and operand\'s "editMetadata" is a rejected promise', function() {
            delete controller.options.value;
            var deferred = $q.defer();
            controller.options.editMetadata = function() { return deferred.promise; };
            controller.removeFromGroup = jasmine.createSpy('removeFromGroupSpy');
            controller.editMetadata();
            deferred.reject();
            $scope.$apply();
            expect(controller.removeFromGroup).toHaveBeenCalled();
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

        it('should not immediately call editMetadata when value already exists', function() {
            var operandOptions = {
                class: 'foo',
                typeLabel: 'Foo',
                getLabel: function() {
                    return 'foo';
                },
                editMetadata: jasmine.createSpy('fooOperand.editMetadata'),
                value: 100
            };
            instantiate(operandOptions, {message: "I'm a group!"});

            expect(operandOptions.editMetadata).not.toHaveBeenCalled();
        });
    });
});
