import { IDictionary, IAnimationEngine, IBlueUnicorn, ICurve, ILayer, ITransition } from '../types';
import { resolveElement, layersToElement, elementToLayers, assign } from '../internal';

export class BlueUnicorn implements IBlueUnicorn {
  private _engine: IAnimationEngine;
  private layers: IDictionary<ILayer> = {};

  public exportHTML = (): Element => {
    return layersToElement(this.layers);
  }

  public exportJSON = (): IDictionary<ILayer> => {
    return assign({}, this.layers);
  }

  /**
   * Import layers from an existing DOM element
   */
  public importHTML = (options: Element, reset: boolean = true): this => {
    const self = this;

    const el = resolveElement(options);
    if (!el) {
      throw 'Could not load from ' + options;
    }

    self.importJSON(elementToLayers(el), reset);
    return self;
  }

  /**
   * Import layers from JSON
   */
  public importJSON = (layers: IDictionary<ILayer>, reset: boolean = true): this => {
    const self = this;
    for (let layerName in layers) {
      self.layers[layerName] = assign(self.layers[layerName] || {}, layers[layerName]);
    }
    if (reset) {
      self.reset();
    }
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
    const curves = findPath(layer.curves, fromStateName, toStateName);

    // lookup states for curves
    const transitions: ITransition[] = [];
    for (let i = 0, len = curves.length; i < len; i++) {
      const curve = curves[i];
      transitions.push({
        curve: curve,
        state1: layer.states[curve.state1],
        state2: layer.states[curve.state2]
      });
    }

    // tell animation engine to transition
    self._engine.transition(transitions);
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

function findPath(curves: ICurve[], fromName: string, toName: string): ICurve[] {
  let directCurve: ICurve | undefined = undefined;
  // look for a direct match
  for (let i = 0, len = curves.length; i < len; i++) {
    const c = curves[i] as ICurve;
    // skip default curve
    if (!c.state1 || !c.state2) {
      continue;
    }
    // check for an exact match in either direction
    if ((c.state1 === fromName && c.state2 === toName) || (c.state2 === fromName && c.state1 === toName)) {
      directCurve = c;
      break;
    }
  }

  // return early if an exact match was found
  if (directCurve) {
    return [directCurve];
  }

  // todo: path finding
  throw `Could not transition from ${fromName} to ${toName}`;
}
