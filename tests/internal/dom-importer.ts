import { elementToCurve, elementToLayer, elementToState, elementToTarget } from '../../src/internal';
import * as  assert from 'assert';

const jsdom = require('mocha-jsdom');

describe('dom-importer', () => {
  jsdom();

  it('should translate a <layer> to a Layer', () => {

    const $target1a = document.createElement('target');
    $target1a.setAttribute('ref', '#box1');
    $target1a.setAttribute('x', '0');

    const $target2a = document.createElement('target');
    $target2a.setAttribute('ref', '#box2');
    $target2a.setAttribute('y', '0');

    const $statea = document.createElement('state');
    $statea.setAttribute('name', 'first');
    $statea.appendChild($target1a);
    $statea.appendChild($target2a);

    const $target1b = document.createElement('target');
    $target1b.setAttribute('ref', '#box1');
    $target1b.setAttribute('x', '90px');

    const $target2b = document.createElement('target');
    $target2b.setAttribute('ref', '#box2');
    $target2b.setAttribute('y', '90px');

    const $stateb = document.createElement('state');
    $stateb.setAttribute('name', 'second');
    $stateb.appendChild($target1b);
    $stateb.appendChild($target2b);

    const $curve = document.createElement('curve');
    $curve.setAttribute('state-1', 'first');
    $curve.setAttribute('state-2', 'second');
    $curve.setAttribute('duration', '1000');
    $curve.setAttribute('easing', 'ease-in-out');

    const $layer = document.createElement('layer');
    $layer.setAttribute('name', 'layer1');
    $layer.setAttribute('state', 'first');
    $layer.appendChild($statea);
    $layer.appendChild($stateb);
    $layer.appendChild($curve);

    const layer = elementToLayer($layer);
    assert.deepEqual(layer, {
      name: 'layer1',
      state: 'first',
      states: {
        first: {
          name: 'first',
          targets: [
            {
              ref: '#box1',
              x: '0'
            },
            {
              ref: '#box2',
              y: '0'
            }
          ]
        },
        second: {
          name: 'second',
          targets: [
            {
              ref: '#box1',
              x: '90px'
            },
            {
              ref: '#box2',
              y: '90px'
            }
          ]
        }
      },
      curves: [
        {
          state1: 'first',
          state2: 'second',
          duration: 1000,
          easing: 'ease-in-out'
        }
      ]
    });
  });


  it('should translate a <state> to a State', () => {

    const $target1 = document.createElement('target');
    $target1.setAttribute('ref', '#box1');
    $target1.setAttribute('x', '0');

    const $target2 = document.createElement('target');
    $target2.setAttribute('ref', '#box2');
    $target2.setAttribute('y', '0');

    const $state = document.createElement('state');
    $state.setAttribute('name', 'first');
    $state.appendChild($target1);
    $state.appendChild($target2);

    const state = elementToState($state);
    assert.deepEqual(state, {
      name: 'first',
      targets: [
        {
          ref: '#box1',
          x: '0'
        },
        {
          ref: '#box2',
          y: '0'
        }
      ]
    });
  });


  it('should translate a <target> to a Target', () => {
    const $target = document.createElement('target');
    $target.setAttribute('ref', '#box');
    $target.setAttribute('x', '0');
    $target.setAttribute('y', '90px');

    const target = elementToTarget($target);
    assert.deepEqual(target, {
      ref: '#box',
      x: '0',
      y: '90px'
    });
  });

  it('should translate a <curve> to a Curve', () => {
    const $curve = document.createElement('curve');
    $curve.setAttribute('state-1', 'first');
    $curve.setAttribute('state-2', 'second');
    $curve.setAttribute('duration', '1000');
    $curve.setAttribute('easing', 'ease-in-out');

    const curve = elementToCurve($curve);
    assert.deepEqual(curve, {
      state1: 'first',
      state2: 'second',
      duration: 1000,
      easing: 'ease-in-out'
    });
  });
});
