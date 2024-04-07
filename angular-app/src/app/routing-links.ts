export const PATH_EMPTY = 'empty';
export const PATH_RXJS_TIMER = 'rxjs-timer';
export const PATH_RXJS_TIMER_COMPLETE = 'rxjs-timer-complete';
export const PATH_HTTP_CLIENT = 'http-client';
export const PATH_ROUTER_PARAM_MAP = 'param-map';
export const PATH_ROUTER_EVENTS = 'router-events';
export const PATH_COMPONENT_TREE = 'component-tree';
export const PATH_UNSUBSCRIPTION_GATHER = 'unsubscription-gather';
export const PATH_UNSUBSCRIPTION_TAKE_UNTIL = 'unsubscription-take-until';
export const PATH_UNSUBSCRIPTION_UNTIL_DESTROYED = 'unsubscription-until-destroyed';
export const PATH_UNSUBSCRIPTION_TAKE_UNTIL_DESTROYED = 'unsubscription-take-until-destroyed';

export class RoutingLinks {
  static emptyComponent = PATH_EMPTY;
  static rxjsTimer = PATH_RXJS_TIMER;
  static rxjsTimerComplete = PATH_RXJS_TIMER_COMPLETE;
  static httpClient = PATH_HTTP_CLIENT;
  static paramMap = PATH_ROUTER_PARAM_MAP;
  static routerEvents = PATH_ROUTER_EVENTS;
  static componentTree = PATH_COMPONENT_TREE;
  static unsubscriptionGather = PATH_UNSUBSCRIPTION_GATHER;
  static unsubscriptionTakeUntil = PATH_UNSUBSCRIPTION_TAKE_UNTIL;
  static unsubscriptionUntilDestroyed = PATH_UNSUBSCRIPTION_UNTIL_DESTROYED;
  static unsubscriptionTakeUntilDestroyed = PATH_UNSUBSCRIPTION_TAKE_UNTIL_DESTROYED;
}
