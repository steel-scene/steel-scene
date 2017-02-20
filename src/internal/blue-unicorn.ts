import { Dictionary, IAnimationEngine, IBlueUnicorn, ICurve, ILayer } from '../types';
import { resolveElement, elementToLayers, attr } from '../internal';

const frolicAttr = 'frolic';

export class BlueUnicorn implements IBlueUnicorn {
  private _engine: IAnimationEngine;
  private layers: Dictionary<ILayer> = {};

  /**
   * Import layers from an existing DOM element
   */
  public frolic = (elOrSelector: Element | string): this => {
    const self = this;
    const el = resolveElement(elOrSelector);
    if (!el) {
      throw 'Could not frolic in ' + elOrSelector;
    }
    if (attr(el, frolicAttr) === 'true') {
      throw 'Unicorn is frolicing in ' + elOrSelector + ' already!';
    }
    self.layers = elementToLayers(el);
    self.reset();
    el.setAttribute(frolicAttr, 'true');

    return self;
  }

  /**
   * Sets all layers to their initial state
   */
  public reset = (): this => {
    const self = this;
    const layers = self.layers;
    for (let layerName in layers) {
      const layer = layers[layerName];
      const state = layer.state;
      self.set(layerName, state);
    }
    return self;
  }

  /**
   * Move directly to a state.  Do not pass GO.  Do not collect $200
   */
  public set = (layerName: string, toStateName: string): this => {
    const self = this;
    // lookup layer and state
    const layer = self.layers[layerName];
    const toState = layer.states[toStateName];

    // tell animation engine to set the state directly
    self._engine.set(toState);
    layer.state = toStateName;
    return self;
  }

  /**
   * Transition from the current state to this new state
   */
  public transition = (layerName: string, toStateName: string): this => {
    const self = this;
    const layer = self.layers[layerName];
    const fromStateName = layer.state;

    // ignore command if already in progress
    if (fromStateName === toStateName) {
      return self;
    }

    // find a suitable curve between the states
    const curves = layer.curves;
    let curve: ICurve | undefined = undefined;
    for (let i = 0, len = curves.length; i < len; i++) {
      const c = curves[i];
      if ((c.state1 === fromStateName && c.state2 === toStateName)
        || (c.state2 === fromStateName && c.state1 === toStateName)) {
          curve = c;
          break;
      }
    }
    if (!curve) {
      throw `No curves connect ${fromStateName} to ${toStateName}`;
    }

    // lookup start and end states
    const fromState = layer.states[fromStateName];
    const toState = layer.states[toStateName];

    // tell animation engine to transition
    self._engine.transition(fromState, toState, curve);
    layer.state = toStateName;

    return self;
  }

  /**
   * Register your favorite animation engine with this command
   */
  public use = (animationEngine: IAnimationEngine): this => {
    const self = this;
    // if another animation engine was registered, fire hook to teardown
    if (self._engine) {
      self._engine.teardown(self);
    }

    // set new animation engine and call setup
    self._engine = animationEngine;
    animationEngine.setup(self);
    return self;
  }

  /**
   * Change the play state with this command
   */
  public setPlayState = (state: 'paused' | 'running'): this => {
    const self = this;
    // tell animation engine to switch states for a layer
    self._engine.setPlayState(state);
    return self;
  }
}
