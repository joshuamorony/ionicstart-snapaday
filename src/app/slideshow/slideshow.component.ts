import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  from,
  iif,
  NEVER,
  of,
  race,
  Subject,
  timer,
} from 'rxjs';
import {
  concatMap,
  delay,
  delayWhen,
  expand,
  finalize,
  repeat,
  repeatWhen,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
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
          (mouseup)="paused$.next(false); manualPhoto$.next(null)"
          [safeResourceUrl]="photo.safeResourceUrl"
        ></app-slideshow-image>
        <ion-button (click)="prevPhoto(photo)">Prev</ion-button>
        <ion-button (click)="nextPhoto(photo)">Next</ion-button>
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
  paused$ = new BehaviorSubject(false); // pause/play slideshow
  delayTime$ = new BehaviorSubject(1000); // time between photos
  loop$ = new BehaviorSubject(true); // loop slideshow
  manualPhoto$ = new BehaviorSubject<Photo | null>(null); // set photo manually

  delay$ = combineLatest([this.paused$, this.delayTime$]).pipe(
    switchMap(([isPaused, delayTime]) =>
      iif(() => isPaused, NEVER, timer(delayTime))
    )
  );

  currentPhotos$ = new BehaviorSubject<Photo[]>([]);

  currentPhoto$ = combineLatest([this.currentPhotos$, this.manualPhoto$]).pipe(
    switchMap(([_, manualPhoto]) =>
      iif(
        // If manual photo set, use that instead
        () => manualPhoto !== null,
        of(manualPhoto),
        this.playCurrentPhotos().pipe(
          // Play recursively if loop is set to true
          expand((photo) => {
            const currentPhotos = this.currentPhotos$.value;
            const isLastPhoto =
              photo === currentPhotos[currentPhotos.length - 1];
            return isLastPhoto && this.loop$.value
              ? this.playCurrentPhotos()
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

  playCurrentPhotos() {
    return this.currentPhotos$.pipe(
      switchMap((photos) => from(photos)),
      concatMap((photo) => of(photo).pipe(delayWhen(() => this.delay$)))
    );
  }

  nextPhoto(currentPhoto: Photo) {
    this.paused$.next(true);

    const currentPhotos = this.currentPhotos$.value;
    const currentIndex = currentPhotos.indexOf(currentPhoto);
    const nextIndex =
      currentIndex < currentPhotos.length - 1 ? currentIndex + 1 : 0;

    this.manualPhoto$.next(currentPhotos[nextIndex]);
  }

  prevPhoto(currentPhoto: Photo) {
    this.paused$.next(true);

    const currentPhotos = this.currentPhotos$.value;
    const currentIndex = currentPhotos.indexOf(currentPhoto);
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : currentPhotos.length - 1;

    this.manualPhoto$.next(currentPhotos[prevIndex]);
  }
}

@NgModule({
  declarations: [SlideshowComponent],
  imports: [IonicModule, CommonModule, SlideshowImageComponentModule],
  exports: [SlideshowComponent],
})
export class SlideshowComponentModule {}
