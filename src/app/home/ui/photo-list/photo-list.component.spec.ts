import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { IonicModule } from '@ionic/angular';
import { Photo } from '../../../shared/interfaces/photo';
import { MockDaysAgoPipe } from '../days-ago/days-ago.pipe.spec';
import { PhotoListComponent } from './photo-list.component';

@Component({
  selector: 'app-photo-list',
  template: '',
})
export class MockPhotoListComponent {
  @Input() photos!: Photo[];
  @Output() delete = new EventEmitter<string>();
}

describe('PhotoListComponent', () => {
  let component: PhotoListComponent;
  let fixture: ComponentFixture<PhotoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoListComponent, MockDaysAgoPipe],
      imports: [IonicModule.forRoot()],
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
      dateTaken: new Date().toString(),
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
      expect(items.length).toEqual(component.photos?.length);
    });
  });

  describe('@Output() delete', () => {
    it('should emit name of photo to delete when delete button is clicked', () => {
      const observerSpy = subscribeSpyTo(component.delete);
      const deleteButton = fixture.debugElement.query(
        By.css('[data-test="delete-photo-button"]')
      );
      deleteButton.nativeElement.click();
      expect(observerSpy.getLastValue()).toEqual(component.photos?.[0].name);
    });
  });
});
