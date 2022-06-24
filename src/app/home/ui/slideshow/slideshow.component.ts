import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Photo } from '../../../shared/interfaces/photo';

@Component({
  selector: 'app-slideshow',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title></ion-title>
        <ion-buttons>
          <ion-button data-test="play-button" (click)="playSlideshow()">
            <ion-icon name="play" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <img
        *ngIf="photos"
        data-test="slideshow-image"
        [src]="
          currentPhoto
            ? currentPhoto.safeResourceUrl
            : photos[photos.length - 1].safeResourceUrl
        "
      />
    </ion-content>
  `,
  styles: [``],
})
export class SlideshowComponent implements OnDestroy {
  @Input() photos!: Photo[];
  currentPhoto: Photo | null = null;

  private slideshowInterval: ReturnType<typeof setInterval> | null = null;

  ngOnDestroy() {
    this.clearInterval();
  }

  playSlideshow() {
    let currentPhotoIndex = this.photos.length - 1;

    // Clear interval if there is one set
    this.clearInterval();

    this.slideshowInterval = setInterval(() => {
      if (currentPhotoIndex >= 0) {
        this.currentPhoto = this.photos[currentPhotoIndex];
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
