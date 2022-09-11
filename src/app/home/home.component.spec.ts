import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By, DomSanitizer } from '@angular/platform-browser';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { PhotoService } from './data-access/photo/photo.service';
import { HomeComponent } from './home.component';
import { BehaviorSubject, of } from 'rxjs';
import { MockPhotoListComponent } from './ui/photo-list/photo-list.component.spec';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockHasTakenPhotoToday: BehaviorSubject<boolean>;

  const testPhoto = {
    name: 'test',
    path: 'path',
    dateTaken: new Date(),
  };

  const testPhotos = [testPhoto, testPhoto, testPhoto];

  beforeEach(waitForAsync(() => {
    mockHasTakenPhotoToday = new BehaviorSubject(false);

    TestBed.configureTestingModule({
      declarations: [HomeComponent, MockPhotoListComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: IonRouterOutlet,
          useValue: {},
        },
        {
          provide: PhotoService,
          useValue: {
            takePhoto: jest.fn(),
            photos$: of(testPhotos),
            hasTakenPhotoToday$: mockHasTakenPhotoToday,
            deletePhoto: jest.fn(),
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

  it('should disable the take photo button if a photo has already been taken', () => {
    mockHasTakenPhotoToday.next(true);
    fixture.detectChanges();
    const takePhotoButton = fixture.debugElement.query(
      By.css('[data-test="take-photo-button"]')
    );
    expect(takePhotoButton.componentInstance.disabled).toBeTruthy();
  });

  it('should call the takePhoto method in the photo service when take photo button clicked', () => {
    const photoService = fixture.debugElement.injector.get(PhotoService);

    const takePhotoButton = fixture.debugElement.query(
      By.css('[data-test="take-photo-button"]')
    );

    takePhotoButton.nativeElement.click();

    expect(photoService.takePhoto).toHaveBeenCalled();
  });

  it('should call the deletePhoto method in the photo service when the delete event emits', () => {
    const photoService = fixture.debugElement.injector.get(PhotoService);
    const photoList = fixture.debugElement.query(By.css('app-photo-list'));

    photoList.triggerEventHandler('delete', 'testName');

    expect(photoService.deletePhoto).toHaveBeenCalledWith('testName');
  });

  describe('photos$', () => {
    it('should modify photo paths to use bypassSecurityTrustResourceUrl', () => {
      const observerSpy = subscribeSpyTo(component.photos$);
      expect(observerSpy.getLastValue()?.[0].safeResourceUrl).toEqual(
        'bypass-path'
      );
    });
  });
});
