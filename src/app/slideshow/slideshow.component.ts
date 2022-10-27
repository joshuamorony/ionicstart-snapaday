import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import {
  IonicModule,
  ModalController,
  RangeCustomEvent,
  ToggleCustomEvent,
} from '@ionic/angular';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  from,
  iif,
  NEVER,
  of,
  timer,
} from 'rxjs';
import { concatMap, delayWhen, expand, switchMap } from 'rxjs/operators';
import { Photo } from '../shared/interfaces/photo';
import { SlideshowImageComponentModule } from './ui/slideshow-image.component';

@Component({
  selector: 'app-slideshow',
  template: `
    <ion-header>
      <ion-toolbar
        *ngIf="{ paused: paused$ | async } as pause"
        [color]="pause.paused ? 'success' : 'danger'"
      >
        <ion-title>{{
          pause.paused ? 'Look at this gorgeous specimen' : 'Play'
        }}</ion-title>
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
      <ng-container *ngIf="currentPhoto$ | async as photo">
        <app-slideshow-image
          (mousedown)="paused$.next(true)"
          (mouseup)="paused$.next(false); staticPhoto$.next(null)"
          [safeResourceUrl]="photo.safeResourceUrl"
        ></app-slideshow-image>
        <ion-card>
          <ion-card-content>
            <ion-button (click)="prevPhoto(photo)">Prev</ion-button>
            <ion-button (click)="nextPhoto(photo)">Next</ion-button>
            <h2>Speed</h2>
            <ion-range
              (ionChange)="changeDelay($event)"
              min="50"
              max="1000"
              [value]="delayTime$.value"
            ></ion-range>
            <h2>Loop</h2>
            <ion-toggle
              [checked]="loop$.value"
              (ionChange)="toggleLoop($event)"
            ></ion-toggle>
          </ion-card-content>
        </ion-card>
      </ng-container>
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
  currentPhotos$ = new BehaviorSubject<Photo[]>([]);

  paused$ = new BehaviorSubject(false); // pause/play slideshow
  delayTime$ = new BehaviorSubject(1000); // time between photos
  loop$ = new BehaviorSubject(true); // loop slideshow
  staticPhoto$ = new BehaviorSubject<Photo | null>(null); // set photo manually

  // If stream is paused delay is infinite, otherwise it is the value of delayTime$
  calculateDelay$ = combineLatest([this.paused$, this.delayTime$]).pipe(
    switchMap(([isPaused, delayTime]) =>
      iif(() => isPaused, NEVER, timer(delayTime))
    )
  );

  // Emit one photo at a time with a delay
  playCurrentPhotos$ = this.currentPhotos$.pipe(
    switchMap((photos) => from(photos)),
    concatMap((photo) => of(photo).pipe(delayWhen(() => this.calculateDelay$)))
  );

  currentPhoto$ = combineLatest([this.currentPhotos$, this.staticPhoto$]).pipe(
    switchMap(([_, staticPhoto]) =>
      iif(
        // Determine whether to show static photo or slideshow
        () => staticPhoto !== null,
        of(staticPhoto),
        this.playCurrentPhotos$.pipe(
          // Play recursively when last photo is reached if loop is set to true
          expand((photo) => {
            const currentPhotos = this.currentPhotos$.value;
            const isLastPhoto =
              photo === currentPhotos[currentPhotos.length - 1];
            return isLastPhoto && this.loop$.value
              ? this.playCurrentPhotos$
              : EMPTY;
          })
        )
      )
    )
  );

  constructor(protected modalCtrl: ModalController) {}

  @Input() set photos(value: Photo[]) {
    this.currentPhotos$.next([...value].reverse());
  }

  nextPhoto(currentPhoto: Photo) {
    this.paused$.next(true);

    const currentPhotos = this.currentPhotos$.value;
    const currentIndex = currentPhotos.indexOf(currentPhoto);
    const nextIndex =
      currentIndex < currentPhotos.length - 1 ? currentIndex + 1 : 0;

    this.staticPhoto$.next(currentPhotos[nextIndex]);
  }

  prevPhoto(currentPhoto: Photo) {
    this.paused$.next(true);

    const currentPhotos = this.currentPhotos$.value;
    const currentIndex = currentPhotos.indexOf(currentPhoto);
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : currentPhotos.length - 1;

    this.staticPhoto$.next(currentPhotos[prevIndex]);
  }

  changeDelay(ev: Event) {
    this.delayTime$.next((ev as RangeCustomEvent).detail.value as number);
  }

  toggleLoop(ev: Event) {
    this.loop$.next((ev as ToggleCustomEvent).detail.checked);
  }
}

@NgModule({
  declarations: [SlideshowComponent],
  imports: [IonicModule, CommonModule, SlideshowImageComponentModule],
  exports: [SlideshowComponent],
})
export class SlideshowComponentModule {}
