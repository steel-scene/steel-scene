import {
  elementToCurve,
  elementToLayer,
  elementToLayers,
  elementToState,
  elementToTarget
} from '../../src/internal';

import * as  assert from 'assert';
const jsdom = require('mocha-jsdom');

describe('dom', () => {
  jsdom();

  describe('elementToLayers', () => {
    it('should detect multiple layers in html', () => {
      const $element = document.createElement('div');
      $element.innerHTML = `
      <div id="container">
        <div id="box1">BOX 1</div>
        <div id="box2">BOX 2</div>
        <div id="box3">BOX 3</div>
        <layer name="box-animations" state="hidden-left" transition-easing="ease-out" transition-duration="500">
            <state name="hidden-left">
                <target ref="#box1" opacity="0" x="-50px" />
                <target ref="#box2" opacity="0" x="-150px" />
                <target ref="#box3" opacity="0" x="-50px" />
            </state>
            <state name="hidden-right">
                <target ref="#box1" opacity="0" x="50px" />
                <target ref="#box2" opacity="0" x="150px" />
                <target ref="#box3" opacity="0" x="50px" />
            </state>
            <state name="reset">
                <target ref="#box1" opacity="1" x="0" />
                <target ref="#box2" opacity="1" x="0" />
                <target ref="#box3" opacity="1" x="0" />
            </state>
            <curve state-1="hidden-left" state-2="reset" easing="ease-out" duration="250" />
            <curve state-1="hidden-right" state-2="reset" easing="ease-out" duration="250" />
        </layer>
      </div>`;

      const layers = elementToLayers($element);
      assert.deepEqual(layers, {
        'box-animations': {
          transitionDuration: 500,
          transitionEasing: 'ease-out',
          state: 'hidden-left',
          states: {
            'hidden-left': [
              { ref: '#box1', opacity: '0', x: '-50px' },
              { ref: '#box2', opacity: '0', x: '-150px' },
              { ref: '#box3', opacity: '0', x: '-50px' }
            ],
            'hidden-right': [
              { ref: '#box1', opacity: '0', x: '50px' },
              { ref: '#box2', opacity: '0', x: '150px' },
              { ref: '#box3', opacity: '0', x: '50px' }
            ],
            reset: [
              { ref: '#box1', opacity: '1', x: '0' },
              { ref: '#box2', opacity: '1', x: '0' },
              { ref: '#box3', opacity: '1', x: '0' }
            ]
          },
          curves: [
            { state1: 'hidden-left', state2: 'reset', easing: 'ease-out', duration: 250 },
            { state1: 'hidden-right', state2: 'reset', easing: 'ease-out', duration: 250 }
          ]
        }
      });
    });
  });

  describe('elementToLayer', () => {
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
        transitionDuration: undefined,
        transitionEasing: undefined,
        state: 'first',
        states: {
          first: [
            { ref: '#box1', x: '0' },
            { ref: '#box2', y: '0' }
          ],
          second: [
            { ref: '#box1', x: '90px' },
            { ref: '#box2', y: '90px' }
          ]
        },
        curves: [
          { state1: 'first', state2: 'second', duration: 1000, easing: 'ease-in-out' }
        ]
      });
    });
  });

  describe('elementToCurve', () => {
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
      assert.deepEqual(state, [
        {
          ref: '#box1',
          x: '0'
        },
        {
          ref: '#box2',
          y: '0'
        }
      ]);
    });
  });

  describe('elementToTarget', () => {
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
  });

  describe('elementToCurve', () => {
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

});
