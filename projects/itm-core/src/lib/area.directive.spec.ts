// import { Component, InjectionToken, Inject, StaticProvider, Injector } from '@angular/core';
// import { async, TestBed, ComponentFixture } from '@angular/core/testing';
// import { Map } from 'immutable';

// import { ItmAreaDirective } from './area.directive';
// import { ComponentType } from './utils';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { By } from '@angular/platform-browser';

// describe('ItmAreaDirective', () => {
//   @Component({template: `<ng-container [itmArea]="areaRef"></ng-container>`})
//   class HotTestComponent {
//     areaRef: { comp: ComponentType, injector: Injector };
//   }

//   const TEST_PROVIDER_TOKEN = new InjectionToken('TEST_PROVIDER_TOKEN');

//   const testProvider = Symbol('testProvider');

//   @Component({template: ''})
//   class FirstEntryTestComponent { }

//   @Component({template: ''})
//   class SecondEntryTestComponent {
//     constructor(@Inject(TEST_PROVIDER_TOKEN) readonly provider: Symbol) { }
//   }

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         ItmAreaDirective,
//         HotTestComponent
//       ],
//     });
//     TestBed.overrideModule(BrowserDynamicTestingModule, {
//       set: {
//         declarations: [FirstEntryTestComponent, SecondEntryTestComponent],
//         entryComponents: [FirstEntryTestComponent, SecondEntryTestComponent]
//       }
//     });
//     TestBed.compileComponents();
//   }));

//   // tslint:disable-next-line:max-line-length
//   function setup(comp: ComponentType = FirstEntryTestComponent, providers: StaticProvider[] = []): ComponentFixture<HotTestComponent> {
//     const fixture = TestBed.createComponent(HotTestComponent);
//     if (comp) {
//       fixture.componentInstance.areaRef = {comp, injector: Injector.create(providers)};
//       fixture.detectChanges();
//     }
//     return fixture;
//   }

//   it('should be created by the hot test component', () => {
//     expect(setup(null).componentInstance).toBeTruthy();
//   });

//   it('should create the component when area ref is valid', () => {
//     const fixture = setup();
//     const testDebugElem = fixture.debugElement.query(By.directive(FirstEntryTestComponent));
//     expect(testDebugElem).toBeTruthy();
//   });

//   it('should recreate the component when area ref changes', () => {
//     const fixture = setup();
//     fixture.componentInstance.areaRef = null;
//     fixture.detectChanges();
//     // tslint:disable-next-line:max-line-length
//     expect(fixture.debugElement.query(By.directive(FirstEntryTestComponent))).toBeFalsy('expected empty ref');
//     fixture.componentInstance.areaRef = {
//       comp: SecondEntryTestComponent,
//       injector: Injector.create([{provide: TEST_PROVIDER_TOKEN, useValue: testProvider}])
//     };
//     fixture.detectChanges();
//     // tslint:disable-next-line:max-line-length
//     expect(fixture.debugElement.query(By.directive(SecondEntryTestComponent))).toBeTruthy('expected component');
//   });

//   it('should not throw a error when component failed to initialize', () => {
//     expect(setup(SecondEntryTestComponent)).toBeTruthy();
//   });
// });
