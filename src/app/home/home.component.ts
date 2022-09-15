import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SlideshowComponentModule } from '../slideshow/slideshow.component';
import { PhotoService } from './data-access/photo/photo.service';
import { PhotoListComponentModule } from './ui/photo-list/photo-list.component';

@Component({
  selector: 'app-home',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ion-header>
        <ion-toolbar color="danger">
          <ion-title>Snapaday</ion-title>
          <ion-buttons slot="end">
            <ion-button
              [disabled]="vm.hasTakenPhotoToday === true"
              (click)="photoService.takePhoto()"
              data-test="take-photo-button"
            >
              <ion-icon name="camera-outline" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button
              data-test="slideshow-button"
              (click)="modalIsOpen$.next(true)"
            >
              <ion-icon name="play" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <app-photo-list
          [photos]="vm.photos"
          (delete)="photoService.deletePhoto($event)"
        ></app-photo-list>
        <ion-modal
          [isOpen]="vm.modalIsOpen"
          [canDismiss]="true"
          [presentingElement]="routerOutlet.nativeEl"
          (ionModalDidDismiss)="modalIsOpen$.next(false)"
        >
          <ng-template>
            <app-slideshow [photos]="vm.photos"></app-slideshow>
          </ng-template>
        </ion-modal>
      </ion-content>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  photos$ = this.photoService.photos$.pipe(
    map((photos) =>
      photos.map((photo) => ({
        ...photo,
        safeResourceUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          photo.path
        ),
      }))
    )
  );

  modalIsOpen$ = new BehaviorSubject(false);

  vm$ = combineLatest([
    this.photos$,
    this.modalIsOpen$,
    this.photoService.hasTakenPhotoToday$,
  ]).pipe(
    map(([photos, modalIsOpen, hasTakenPhotoToday]) => ({
      photos,
      modalIsOpen,
      hasTakenPhotoToday,
    }))
  );

  constructor(
    protected photoService: PhotoService,
    private sanitizer: DomSanitizer,
    public routerOutlet: IonRouterOutlet
  ) {}
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PhotoListComponentModule,
    SlideshowComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
