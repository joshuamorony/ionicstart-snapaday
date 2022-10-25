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
      <ion-toolbar [color]="isPaused ? 'success' : 'danger'">
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
        (mousedown)="pause()"
        (mouseup)="unpause()"
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
  public isPaused = false;
  private intervalRef?: number;
  private photoIndex = 0;

  constructor(
    protected modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }

    this.photoIndex = this.photos.length - 1;
    this.currentPhoto = this.photos[this.photoIndex];
    this.photoIndex--;

    this.start();
  }

  start() {
    this.intervalRef = setInterval(() => {
      this.currentPhoto = this.photos[this.photoIndex];

      this.cdr.markForCheck();

      if (this.photoIndex < 1) {
        clearInterval(this.intervalRef);
      }

      this.photoIndex--;
    }, 2000);
  }

  pause() {
    this.isPaused = true;
    clearInterval(this.intervalRef);
  }

  unpause() {
    this.isPaused = false;
    this.start();
  }
}

@NgModule({
  declarations: [SlideshowComponent],
  imports: [IonicModule, CommonModule, SlideshowImageComponentModule],
  exports: [SlideshowComponent],
})
export class SlideshowComponentModule {}
