import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By, DomSanitizer } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { PhotoService } from './data-access/photo/photo.service';
import { HomeComponent } from './home.component';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const testPhoto = {
    name: 'test',
    path: 'path',
    dateTaken: new Date(),
  };

  const testPhotos = [testPhoto, testPhoto, testPhoto];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: PhotoService,
          useValue: {
            takePhoto: jest.fn(),
            getPhotos: jest.fn().mockReturnValue(of(testPhotos)),
          },
        },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustResourceUrl: jest
              .fn()
              .mockReturnValue('bypass-path'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the takePhoto method in the photo service when take photo button clicked', () => {
    const photoService = fixture.debugElement.injector.get(PhotoService);

    const takePhotoButton = fixture.debugElement.query(
      By.css('[data-test="take-photo-button"]')
    );

    takePhotoButton.nativeElement.click();

    expect(photoService.takePhoto).toHaveBeenCalled();
  });

  describe('photos$', () => {
    it('should modify photo paths to use bypassSecurityTrustResourceUrl', () => {
      const observerSpy = subscribeSpyTo(component.photos$);
      expect(observerSpy.getLastValue()?.[0].path).toEqual('bypass-path');
    });
  });
});
