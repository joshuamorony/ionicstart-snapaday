import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By, DomSanitizer } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { PhotoListComponent } from './photo-list.component';

describe('PhotoListComponent', () => {
  let component: PhotoListComponent;
  let fixture: ComponentFixture<PhotoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoListComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustResourceUrl: jest
              .fn()
              .mockReturnValue('bypass-url'),
          },
        },
      ],
    })
      .overrideComponent(PhotoListComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PhotoListComponent);
    component = fixture.componentInstance;

    const testPhoto = {
      name: 'test',
      path: 'path',
      dateTaken: new Date(),
    };

    component.photos = [testPhoto, testPhoto, testPhoto];

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('@Input() photos', () => {
    it('should render an item for each', () => {
      const items = fixture.debugElement.queryAll(
        By.css('[data-test="photo"]')
      );
      expect(items.length).toEqual(component.photos.length);
    });

    it('should use bypassSecurityTrustResourceUrl to set the src for the image for each time', () => {
      const photoImage = fixture.debugElement.query(
        By.css('[data-test="photo"] img')
      );
      expect(photoImage.nativeElement.src).toEqual('bypass-url');
    });
  });
});
