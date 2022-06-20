import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { PhotoService } from './data-access/photo/photo.service';
import { HomeComponent } from './home.component';

jest.mock('./data-access/photo/photo.service');

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [IonicModule.forRoot()],
      providers: [PhotoService],
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
});
