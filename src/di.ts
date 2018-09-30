import { InjectionToken, Inject } from '@angular/core';

export const ITM_AREA_TOKEN = new InjectionToken('ITM_AREA_TOKEN');
export const ITM_TARGET_TOKEN = new InjectionToken('ITM_TARGET_TOKEN');

export module ItmInject {
  export const area = Inject(ITM_AREA_TOKEN);
  export const target = Inject(ITM_TARGET_TOKEN);
}

export default ItmInject;
