import { IDictionary, IStateJSON, ITarget } from '../types';
import { elementToState } from '../internal';
import { assignExcept, resolveElement } from '../utils';

export class State {
  public duration: number | undefined;
  public transition: string | undefined;
  public easing: string | undefined;
  public targets: ITarget[];
  public props: IDictionary<any>;

  public fromJSON(json: IStateJSON): this {
    const self = this;
    self.duration = json.duration;
    self.easing = json.easing;
    self.transition = json.transition;
    self.props = assignExcept({}, json, ['duration', 'easing', 'name', 'targets', 'transition']);
    self.targets = json.targets.slice(0);
    return self;
  }

  public fromHTML(html: Element | string): this {
    return this.fromJSON(
      elementToState(
        resolveElement(html, true)
      )
    );
  }

  public toJSON(): IStateJSON {
    const self = this;
    return {
      duration: self.duration,
      easing: self.easing,
      transition: self.transition,
      targets: self.targets
    }
  }
}


