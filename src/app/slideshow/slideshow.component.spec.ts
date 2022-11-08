import { ChangeDetectionStrategy } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { IonicModule } from '@ionic/angular';
import { Photo } from '../shared/interfaces/photo';
import { SlideshowComponent } from './slideshow.component';
import { MockSlideshowImageComponent } from './ui/slideshow-image.component.spec';

describe('SlideshowComponent', () => {
  let component: SlideshowComponent;
  let fixture: ComponentFixture<SlideshowComponent>;
  let testPhotos: Photo[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SlideshowComponent, MockSlideshowImageComponent],
      imports: [IonicModule.forRoot()],
      providers: [],
    })
      .overrideComponent(SlideshowComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SlideshowComponent);
    component = fixture.componentInstance;

    testPhotos = [
      { safeResourceUrl: 'http://localhost/path1' },
      { safeResourceUrl: 'http://localhost/path2' },
      { safeResourceUrl: 'http://localhost/path3' },
    ] as any;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('@Input() photos', () => {
    const getSlideshowImage = () =>
      fixture.debugElement.query(By.css('app-slideshow-image'));

    const getResourceUrl = () =>
      getSlideshowImage().componentInstance.safeResourceUrl;

    const waitForDelay = () => {
      tick(1000);
      fixture.detectChanges();
    };

    beforeEach(() => {
      component.loop$.next(false);
      component.delayTime$.next(1000);
      component.staticPhoto$.next(null);
      component.paused$.next(false);
    });

    it('should set safeResourceUrl of app-slideshow-image to each of the photos in the array with delay', fakeAsync(() => {
      component.photos = testPhotos;

      for (let i = testPhotos.length - 1; i >= 0; i--) {
        waitForDelay();
        expect(getResourceUrl()).toBe(testPhotos[i].safeResourceUrl);
      }
    }));

    describe('paused$', () => {
      it('should go to next photo if false', fakeAsync(() => {
        component.paused$.next(false);
        component.photos = testPhotos;
        fixture.detectChanges();

        waitForDelay();
        expect(getResourceUrl()).toBe(
          testPhotos[testPhotos.length - 1].safeResourceUrl
        );
        waitForDelay();
        expect(getResourceUrl()).toBe(
          testPhotos[testPhotos.length - 2].safeResourceUrl
        );

        discardPeriodicTasks();
      }));

      it('should not go to next photo if true', fakeAsync(() => {
        component.photos = testPhotos;
        fixture.detectChanges();

        waitForDelay();
        component.paused$.next(true);

        expect(getResourceUrl()).toBe(
          testPhotos[testPhotos.length - 1].safeResourceUrl
        );
        waitForDelay();
        expect(getResourceUrl()).toBe(
          testPhotos[testPhotos.length - 1].safeResourceUrl
        );

        discardPeriodicTasks();
      }));
    });

    describe('loop$', () => {
      it('should loop if true', fakeAsync(() => {
        component.loop$.next(true);
        component.photos = testPhotos;
        fixture.detectChanges();

        testPhotos.forEach((photo) => waitForDelay());

        waitForDelay();

        expect(getResourceUrl()).toBe(
          testPhotos[testPhotos.length - 1].safeResourceUrl
        );

        discardPeriodicTasks();
      }));

      it('should stop after all photos have been emitted if false', fakeAsync(() => {
        component.loop$.next(false);
        component.photos = testPhotos;
        fixture.detectChanges();

        testPhotos.forEach((photo) => waitForDelay());

        expect(getResourceUrl()).toBe(testPhotos[0].safeResourceUrl);
      }));
    });

    describe('staticPhoto$', () => {
      it('should display static photo if static photo is set', fakeAsync(() => {
        component.staticPhoto$.next(testPhotos[0]);
        component.photos = testPhotos;
        fixture.detectChanges();

        waitForDelay();
        waitForDelay();

        fixture.detectChanges();

        expect(getResourceUrl()).toBe(testPhotos[0].safeResourceUrl);
      }));
    });

    describe('delayTime$', () => {
      it('should change delay to specified amount', fakeAsync(() => {
        component.photos = testPhotos;
        fixture.detectChanges();

        waitForDelay();
        component.delayTime$.next(2000);

        expect(getResourceUrl()).toBe(
          testPhotos[testPhotos.length - 1].safeResourceUrl
        );

        waitForDelay();

        expect(getResourceUrl()).toBe(
          testPhotos[testPhotos.length - 1].safeResourceUrl
        );

        waitForDelay();

        expect(getResourceUrl()).toBe(
          testPhotos[testPhotos.length - 2].safeResourceUrl
        );

        discardPeriodicTasks();
      }));
    });
  });
});
