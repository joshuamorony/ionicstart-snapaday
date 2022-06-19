import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { PhotoService } from '../../data-access/photo/photo.service';
import { PhotoListComponent } from './photo-list.component';

jest.mock('../../data-access/photo/photo.service');

describe('PhotoListComponent', () => {
  let component: PhotoListComponent;
  let fixture: ComponentFixture<PhotoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoListComponent],
      imports: [IonicModule.forRoot()],
      providers: [PhotoService],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoListComponent);
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
