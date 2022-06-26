import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';
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
  currentPhoto$: Observable<Photo> | undefined;

  constructor(protected modalCtrl: ModalController) {}

  @Input() set photos(value: Observable<Photo[]>) {
    this.currentPhoto$ = value.pipe(
      // Switch to stream that emits one photo from the array at a time (in reverse order)
      switchMap((photos) =>
        from(photos.reverse()).pipe(
          // For each emission, switch to a stream of just that one value
          concatMap((photo) =>
            of(photo).pipe(
              // Wait 500 ms before making it the currentPhoto
              // Then concatMap will move on to the next photo
              delay(500)
            )
          )
        )
      )
    );
  }
}

@NgModule({
  declarations: [SlideshowComponent],
  imports: [IonicModule, CommonModule, SlideshowImageComponentModule],
  exports: [SlideshowComponent],
})
export class SlideshowComponentModule {}
