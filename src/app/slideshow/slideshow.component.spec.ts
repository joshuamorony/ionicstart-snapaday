import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
    }).compileComponents();

    fixture = TestBed.createComponent(SlideshowComponent);
    component = fixture.componentInstance;

    testPhotos = [
      { safeResourceUrl: 'http://localhost/path1' },
      { safeResourceUrl: 'http://localhost/path2' },
      { safeResourceUrl: 'http://localhost/path3' },
    ] as any;

    component.photos = testPhotos;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('@Input() photos', () => {
    it('should display the oldest photo in an image tag', () => {
      const slideshowImage = fixture.debugElement.query(
        By.css('app-slideshow-image')
      );

      expect(slideshowImage.componentInstance.safeResourceUrl).toEqual(
        testPhotos[testPhotos.length - 1].safeResourceUrl
      );
    });

    it('when it is launched, it should show every photo in sequence', fakeAsync(() => {
      const slideshowImage = fixture.debugElement.query(
        By.css('app-slideshow-image')
      );

      component.ngOnInit();

      tick(500);
      fixture.detectChanges();

      expect(slideshowImage.componentInstance.safeResourceUrl).toEqual(
        testPhotos[testPhotos.length - 1].safeResourceUrl
      );

      tick(500);
      fixture.detectChanges();

      expect(slideshowImage.componentInstance.safeResourceUrl).toEqual(
        testPhotos[testPhotos.length - 2].safeResourceUrl
      );

      tick(500);
      fixture.detectChanges();

      expect(slideshowImage.componentInstance.safeResourceUrl).toEqual(
        testPhotos[testPhotos.length - 3].safeResourceUrl
      );

      tick(500);
    }));
  });
});
