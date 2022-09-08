import { ChangeDetectionStrategy } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
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
    it('when it is launched, it should show every photo in sequence', fakeAsync(() => {
      const observerSpy = subscribeSpyTo(component.currentPhoto$);
      component.photos = testPhotos;
      fixture.detectChanges();

      expect(observerSpy.getLastValue()).toBe(undefined);

      tick(500);

      expect(observerSpy.getLastValue()?.safeResourceUrl).toEqual(
        testPhotos[testPhotos.length - 1].safeResourceUrl
      );

      tick(500);

      expect(observerSpy.getLastValue()?.safeResourceUrl).toEqual(
        testPhotos[testPhotos.length - 2].safeResourceUrl
      );

      tick(500);

      expect(observerSpy.getLastValue()?.safeResourceUrl).toEqual(
        testPhotos[testPhotos.length - 3].safeResourceUrl
      );
    }));
  });
});
