import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { Photo } from '../../../shared/interfaces/photo';
import { SlideshowComponent } from './slideshow.component';

describe('SlideshowComponent', () => {
  let component: SlideshowComponent;
  let fixture: ComponentFixture<SlideshowComponent>;
  let testPhotos: Photo[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SlideshowComponent],
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
      const img = fixture.debugElement.query(
        By.css('[data-test="slideshow-image"]')
      );

      expect(img.attributes.src).toEqual(
        testPhotos[testPhotos.length - 1].safeResourceUrl
      );
    });

    it('when it is launched, it should show every photo in sequence', fakeAsync(() => {
      const img = fixture.debugElement.query(
        By.css('[data-test="slideshow-image"]')
      );

      component.ngOnInit();

      tick(500);
      fixture.detectChanges();

      expect(img.nativeElement.src).toEqual(
        testPhotos[testPhotos.length - 1].safeResourceUrl
      );

      tick(500);
      fixture.detectChanges();

      expect(img.nativeElement.src).toEqual(
        testPhotos[testPhotos.length - 2].safeResourceUrl
      );

      tick(500);
      fixture.detectChanges();

      expect(img.nativeElement.src).toEqual(
        testPhotos[testPhotos.length - 3].safeResourceUrl
      );

      tick(500);
    }));
  });
});
