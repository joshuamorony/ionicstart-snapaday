import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnDestroy, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Photo } from '../../../shared/interfaces/photo';

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
      <div class="image-container">
        <img
          *ngIf="photos"
          data-test="slideshow-image"
          [src]="
            currentPhoto
              ? currentPhoto.safeResourceUrl
              : photos[photos.length - 1].safeResourceUrl
          "
        />
      </div>
    </ion-content>
  `,
  styles: [
    `
      :host {
        height: 100%;
      }

      .image-container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
      }
    `,
  ],
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
  imports: [IonicModule, CommonModule],
  exports: [SlideshowComponent],
})
export class SlideshowComponentModule {}
