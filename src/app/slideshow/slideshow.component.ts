import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
  OnChanges,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { BehaviorSubject, from, of } from 'rxjs';
import { concatMap, delay, switchMap } from 'rxjs/operators';
import { Photo } from '../shared/interfaces/photo';
import { SlideshowImageComponentModule } from './ui/slideshow-image.component';

@Component({
  selector: 'app-slideshow',
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title>Play</ion-title>
        <ion-buttons slot="end">
          <ion-button
            data-test="slideshow-close-button"
            (click)="modalCtrl.dismiss()"
          >
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-slideshow-image
        *ngIf="currentPhoto"
        [safeResourceUrl]="currentPhoto.safeResourceUrl"
      ></app-slideshow-image>
    </ion-content>
  `,
  styles: [
    `
      :host {
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideshowComponent implements OnChanges {
  @Input() photos!: Photo[];

  public currentPhoto?: Photo;
  private intervalRef?: number;

  constructor(
    protected modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }

    this.currentPhoto = this.photos[this.photos.length];

    let photoIndex = this.photos.length - 1;
    this.intervalRef = setInterval(() => {
      this.currentPhoto = this.photos[photoIndex];

      this.cdr.markForCheck();

      if (photoIndex < 1) {
        clearInterval(this.intervalRef);
      }

      photoIndex--;
    }, 500);
  }

  // currentPhotos$ = new BehaviorSubject<Photo[]>([]);

  // currentPhoto$ = this.currentPhotos$.pipe(
  //   switchMap((photos) => from(photos)),
  //   concatMap((photo) => of(photo).pipe(delay(500)))
  // );

  // @Input() set photos(value: Photo[]) {
  //   this.currentPhotos$.next([...value].reverse());
  // }
}

@NgModule({
  declarations: [SlideshowComponent],
  imports: [IonicModule, CommonModule, SlideshowImageComponentModule],
  exports: [SlideshowComponent],
})
export class SlideshowComponentModule {}
