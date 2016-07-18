'use strict';

describe('expressionGroup directive', function() {
    var $scope,
        controller;

    function createOperand(value, label) {
        return {
            class: 'foo',
            typeLabel: 'Foo',
            editMetadata: function() {},
            getLabel: function() { return label; },
            value: value
        };
    }

    beforeEach(module('ngEquation'));

    beforeEach(inject(function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.myOperator = 'AND';
        $scope.myOperands = [];
        $scope.myAvailableOperands = [];

        var element = angular.element(
            '<expression-group ' +
                'operator="myOperator" ' +
                'operands="myOperands" ' +
                'available-operands="myAvailableOperands">' +
            '</expression-group>'
        );
        $compile(element)($scope);
        $scope.$apply();

        controller = element.isolateScope().group;
    }));

    it('should allow adding operands', function() {
        expect(controller.operands.length).toBe(0);

        controller.addOperand(createOperand('bar', 'Bar'));

        expect(controller.operands.length).toBe(1);
        expect(controller.isSubgroup(controller.operands[0])).toBe(false);
    });

    it('should allow adding subgroups as operands', function() {
        expect(controller.operands.length).toBe(0);

        controller.addSubgroup();

        expect(controller.operands.length).toBe(1);
        expect(controller.isSubgroup(controller.operands[0])).toBe(true);
    });

    it('should allow getting the "value"', function() {
        expect(controller.value()).toEqual({
            operator: 'AND',
            children: []
        });
    });

    it('should allow getting the "formula"', function() {
        expect(controller.formula()).toEqual('');
    });

    describe('with an operand', function() {
        beforeEach(function() {
            controller.addOperand(createOperand('bar', 'Bar'));
        });

        it('should allow looking up the index of an operand', function() {
            var barOperand = {value: 'bar'};
            expect(controller.getIndexOfOperand(barOperand)).toEqual(0);

            var nonexistentOperand = {value: 'baz'};
            expect(controller.getIndexOfOperand(nonexistentOperand)).toEqual(-1);
        });

        it('should allow removing an operand', function() {
            expect(controller.operands.length).toBe(1);

            var barOperand = {value: 'bar'};
            controller.removeOperand(barOperand);

            expect(controller.operands.length).toBe(0);
        });

        it('should allow getting the "value" of operand', function() {
            expect(controller.value()).toEqual({
                operator: 'AND',
                children: [
                    {
                        itemType: 'foo',
                        id: 'bar',
                        label: 'Bar'
                    }
                ]
            });
        });

        it('should allow getting the "formula" of operand', function() {
            expect(controller.formula()).toEqual('Bar');
        });

        it('should prepend "NOT" to the formula when operator is "AND NOT"', function() {
            controller.operator = 'AND NOT';
            expect(controller.formula()).toEqual('NOT Bar');
        });

        describe('with multiple operands', function() {
            beforeEach(function() {
                controller.addOperand(createOperand('foo', 'Foo'));
            });

            it('should allow getting the "formula" of operand', function() {
                expect(controller.formula()).toEqual('Bar AND Foo');
            });

            it('should prepend "NOT" to the formula when operator is "AND NOT"', function() {
                controller.operator = 'AND NOT';
                expect(controller.formula()).toEqual('NOT Bar AND NOT Foo');
            });

            describe('with subgroups with multiple operands', function() {
                beforeEach(function() {
                    controller.addSubgroup();
                    var subgroup = controller.operands[controller.operands.length - 1];
                    subgroup.operands = [
                        createOperand('sub_foo', 'Inner Foo'),
                        createOperand('sub_bar', 'Inner Bar')
                    ];
                    subgroup.operator = 'AND NOT';
                });

                it('should properly nest formula', function() {
                    expect(controller.formula()).toEqual('Bar AND Foo AND (NOT Inner Foo AND NOT Inner Bar)');
                });
            });
        });
    });

    describe('with a subgroup', function() {
        beforeEach(function() {
            controller.addSubgroup();
        });

        it('should allow removing subgroup by index', function() {
            expect(controller.operands.length).toBe(1);

            controller.removeSubgroup(0);

            expect(controller.operands.length).toBe(0);
        });

        it('should allow getting the "value" of the subgroup', function() {
            expect(controller.value()).toEqual({
                operator: 'AND',
                children: [
                    {
                        operator: 'AND',
                        children: []
                    }
                ]
            });
        });

        it('should allow getting the "formula" of the subgroup', function() {
            expect(controller.formula()).toEqual('()');
        });

        it('should get -1 for index of operands that are subgroups', function() {
            expect(controller.getIndexOfOperand(controller.operands[0])).toBe(-1);
        });

        describe('that has an operand', function() {
            beforeEach(function() {
                controller.operands[0].operands.push(createOperand('bar', 'Bar'));
            });

            it('should allow getting the "value" of all its descendents', function() {
                expect(controller.value()).toEqual({
                    operator: 'AND',
                    children: [
                        {
                            operator: 'AND',
                            children: [
                                {
                                    itemType: 'foo',
                                    id: 'bar',
                                    label: 'Bar'
                                }
                            ]
                        }
                    ]
                });
            });

            it('should allow getting the "formula" of all its descendents', function() {
                expect(controller.formula()).toEqual('(Bar)');
            });
        });
    });
});
