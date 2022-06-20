import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PhotoService } from './data-access/photo/photo.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Snapaday</ion-title>
        <ion-buttons slot="end">
          <ion-button
            (click)="photoService.takePhoto()"
            data-test="take-photo-button"
          >
            <ion-icon name="camera-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content></ion-content>
  `,
  styles: [],
})
export class HomeComponent {
  photos$ = this.photoService.getPhotos().pipe(
    map((photos) =>
      photos.map((photo) => ({
        ...photo,
        path: this.sanitizer.bypassSecurityTrustResourceUrl(photo.path),
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
