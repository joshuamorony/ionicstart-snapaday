import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { SlideshowImageComponent } from './slideshow-image.component';

@Component({
  selector: 'app-slideshow-image',
  template: '',
})
export class MockSlideshowImageComponent {
  @Input() safeResourceUrl!: SafeResourceUrl;
}

describe('SlideshowImageComponent', () => {
  let component: SlideshowImageComponent;
  let fixture: ComponentFixture<SlideshowImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SlideshowImageComponent],
      imports: [IonicModule.forRoot()],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideshowImageComponent);
    component = fixture.componentInstance;

    component.safeResourceUrl = 'http://localhost/test';

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the img src to safe resource url', () => {
    const image = fixture.debugElement.query(By.css('img'));
    expect(image.nativeElement.src).toEqual('http://localhost/test');
  });
});
