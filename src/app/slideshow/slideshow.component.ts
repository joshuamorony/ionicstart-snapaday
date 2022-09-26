import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { BehaviorSubject, from, of } from 'rxjs';
import { concatMap, delay, delayWhen, switchMap, tap } from 'rxjs/operators';
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
        (mousedown)="paused$.next(true)"
        (mouseup)="paused$.next(false)"
        *ngIf="currentPhoto$ | async as photo"
        [safeResourceUrl]="photo.safeResourceUrl"
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
export class SlideshowComponent {
  paused$ = new BehaviorSubject(false);

  currentPhotos$ = new BehaviorSubject<Photo[]>([]);
  currentPhoto$ = this.currentPhotos$.pipe(
    // Emit one photo at a time
    switchMap((photos) => from(photos)),
    concatMap((photo) =>
      // Create a new stream for each individual photo
      of(photo).pipe(
        // Creating a stream for each individual photo
        // will allow us to delay the start of the stream
        delayWhen(() =>
          this.paused$.pipe(
            tap((val) => console.log(val)),
            switchMap((isPaused) =>
              isPaused ? of('').pipe(delay(100000)) : of('').pipe(delay(1000))
            )
          )
        )
      )
    )
  );

  constructor(protected modalCtrl: ModalController) {}

  @Input() set photos(value: Photo[]) {
    this.currentPhotos$.next([...value].reverse());
  }
}

@NgModule({
  declarations: [SlideshowComponent],
  imports: [IonicModule, CommonModule, SlideshowImageComponentModule],
  exports: [SlideshowComponent],
})
export class SlideshowComponentModule {}
