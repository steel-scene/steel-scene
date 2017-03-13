const internal_1 = require("../../src/internal");
const assert = require("assert");
const jsdom = require('mocha-jsdom');
describe('dom', () => {
    jsdom();
    describe('elementToTransition', () => {
        it('should translate a <transition> to a Transition', () => {
            const $transition = document.createElement('s-transition');
            $transition.setAttribute('duration', '1000');
            $transition.setAttribute('easing', 'ease-in-out');
            const transition = internal_1.elementToTransition($transition);
            assert.deepEqual(transition, {
                default: false,
                duration: 1000,
                easing: 'ease-in-out'
            });
        });
    });
});
