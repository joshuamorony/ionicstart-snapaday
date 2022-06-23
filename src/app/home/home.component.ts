import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { PhotoService } from './data-access/photo/photo.service';
import { PhotoListComponentModule } from './ui/photo-list/photo-list.component';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Snapaday</ion-title>
        <ion-buttons slot="end">
          <ion-button
            [disabled]="(photoService.canTakePhoto() | async) === false"
            (click)="photoService.takePhoto()"
            data-test="take-photo-button"
          >
            <ion-icon name="camera-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-photo-list [photos]="photos$ | async"></app-photo-list>
    </ion-content>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  photos$ = this.photoService.getPhotos().pipe(
    map((photos) =>
      photos.map((photo) => ({
        ...photo,
        safeResourceUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          photo.path
        ),
      }))
    )
  );

  constructor(
    protected photoService: PhotoService,
    private sanitizer: DomSanitizer
  ) {}
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PhotoListComponentModule,
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
