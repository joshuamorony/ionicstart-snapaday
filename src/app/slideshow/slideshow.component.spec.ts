import { ChangeDetectionStrategy } from '@angular/core';
import {
  ComponentFixture,
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
      component.paused$.next(false);
    });

    it('should set safeResourceUrl of app-slideshow-image to each of the photos in the array with delay', fakeAsync(() => {
      component.photos = testPhotos;

      for (let i = testPhotos.length - 1; i >= 0; i--) {
        waitForDelay();
        expect(getResourceUrl()).toBe(testPhotos[i].safeResourceUrl);
      }
    }));
  });
});
