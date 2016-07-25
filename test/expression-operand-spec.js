'use strict';

describe('expressionOperand directive', function() {
    var $exceptionHandler,
        $log,
        $scope,
        $q,
        instantiate;

    beforeEach(module('ngEquation'));

    beforeEach(module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
    }));

    beforeEach(inject(function($compile, _$exceptionHandler_, $rootScope, $timeout, _$q_, _$log_) {
        $exceptionHandler = _$exceptionHandler_;
        $q = _$q_;
        $log = _$log_;

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
                    return {
                        value: 'newValue'
                    };
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

        it('should call "removeFromGroup" method when no initial value and operand\'s "editMetadata" does not return a value', function() {
            controller.options.editMetadata = function() { return undefined; };
            controller.removeFromGroup = jasmine.createSpy('removeFromGroupSpy');
            controller.editMetadata();
            $scope.$apply();
            expect(controller.removeFromGroup).toHaveBeenCalled();
        });

        it('should call "removeFromGroup" method when no initial value and operand\'s "editMetadata" is a rejected promise', function() {
            var deferred = $q.defer();
            controller.options.editMetadata = function() { return deferred.promise; };
            controller.removeFromGroup = jasmine.createSpy('removeFromGroupSpy');
            controller.editMetadata();
            deferred.reject();
            $scope.$apply();
            expect(controller.removeFromGroup).toHaveBeenCalled();
        });
    });

    describe('initialized with a value', function() {
        var controller,
            operandOptions;

        beforeEach(function() {
            operandOptions = {
                class: 'foo',
                typeLabel: 'Foo',
                getLabel: jasmine.createSpy('fooOperand.getLabel'),
                editMetadata: jasmine.createSpy('fooOperand.editMetadata'),
                value: 'bar'
            };
            controller = instantiate(operandOptions);
        });

        it('should not call "removeFromGroup" when operand\'s "editMetadata" does not return a value', function() {
            controller.options.editMetadata = function() { return undefined; };
            controller.removeFromGroup = jasmine.createSpy('removeFromGroupSpy');
            controller.editMetadata();
            $scope.$apply();
            expect(controller.removeFromGroup).not.toHaveBeenCalled();
            expect($log.warn.logs).toEqual([[
                'editMetadata resulted in undefined value, operand will retain previous value of bar'
            ]]);
        });

        it('should not call "removeFromGroup" when operand\'s "editMetadata" is a rejected promise', function() {
            var deferred = $q.defer();
            controller.options.editMetadata = function() { return deferred.promise; };
            controller.removeFromGroup = jasmine.createSpy('removeFromGroupSpy');
            controller.editMetadata();
            deferred.reject();
            $scope.$apply();
            expect(controller.removeFromGroup).not.toHaveBeenCalled();
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

    describe('configured to add multiple operands at once', function() {
        var group,
            operandOptions = {
                class: 'foos',
                typeLabel: 'Foos',
                getLabel: function() {
                    return 'foos';
                }
            };

        beforeEach(function() {
            group = {
                addOperand: jasmine.createSpy('group.addOperand')
            };
            operandOptions.editMetadata = function() {
                return {
                    value: ['a', 'b', 'c'],
                    addMultiple: true
                };
            };

            instantiate(operandOptions, group);
        });

        it('should call addOperand for the additional values returned from editMetadata', function() {
            var allAddOperandCallArgs = group.addOperand.calls.all().map(function(call) {
                return call.args;
            });
            expect(allAddOperandCallArgs).toEqual([
                [
                    {
                        class: 'foos',
                        typeLabel: 'Foos',
                        getLabel: jasmine.any(Function),
                        editMetadata: jasmine.any(Function),
                        value: 'b'
                    }
                ],
                [
                    {
                        class: 'foos',
                        typeLabel: 'Foos',
                        getLabel: jasmine.any(Function),
                        editMetadata: jasmine.any(Function),
                        value: 'c'
                    }
                ]
            ]);
        });
    });
});
