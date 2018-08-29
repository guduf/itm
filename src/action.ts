export interface ItmActionConfig {
  /** The identifier of the actions */
  key: string;
  /** The icon representing the action */
  icon?: string;
}

export class ItmActionDef implements ItmActionConfig {
  /** see [[ItmActionConfig.key]] */
  key: string;
  /** see [[ItmActionConfig.icon]] */
  icon: string;

  constructor(cfg: ItmActionConfig) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    else throw new TypeError('InvalidItmActionConfig : Expected [key] as string for event config');
    this.icon = cfg.icon && typeof cfg.icon === 'string' ? cfg.icon : this.key;
  }
}

export abstract class ItmActionDefs extends Array<ItmActionDef> { }

export class ItmActionEvent<T = {}> {
  /** The key of the action */
  readonly key: string;

  constructor(
    readonly action: ItmActionDef,
    readonly nativeEvent: any,
    readonly target: T = {} as T
  ) {
    if (action instanceof ItmActionDef) this.key = action.key;
    else throw new TypeError('ItmActionEvent : Expected (action) as ItmActionDef');
    if (!nativeEvent) throw new TypeError('ItmActionEvent : Expected (nativeEvent)');
  }
}

