import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
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
        *ngIf="photos"
        [safeResourceUrl]="
          currentPhoto
            ? currentPhoto.safeResourceUrl
            : photos[photos.length - 1].safeResourceUrl
        "
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
export class SlideshowComponent implements OnInit, OnDestroy {
  @Input() photos!: Photo[] | null;
  currentPhoto: Photo | null = null;

  private slideshowInterval: ReturnType<typeof setInterval> | null = null;

  constructor(protected modalCtrl: ModalController) {}

  ngOnInit() {
    this.playSlideshow();
  }

  ngOnDestroy() {
    this.clearInterval();
  }

  playSlideshow() {
    if (!this.photos) {
      return;
    }

    let currentPhotoIndex = this.photos.length - 1;

    // Clear interval if there is one set
    this.clearInterval();

    const photos = this.photos;

    this.slideshowInterval = setInterval(() => {
      if (currentPhotoIndex >= 0) {
        this.currentPhoto = photos[currentPhotoIndex];
        currentPhotoIndex--;
      } else {
        this.clearInterval();
      }
    }, 500);
  }

  clearInterval() {
    clearInterval(this.slideshowInterval ?? undefined);
  }
}

@NgModule({
  declarations: [SlideshowComponent],
  imports: [IonicModule, CommonModule, SlideshowImageComponentModule],
  exports: [SlideshowComponent],
})
export class SlideshowComponentModule {}
