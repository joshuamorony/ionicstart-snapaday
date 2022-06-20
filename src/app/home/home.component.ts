import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PhotoService } from './data-access/photo/photo.service';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Snapaday</ion-title>
      </ion-toolbar>
      <ion-buttons>
        <ion-button
          (click)="photoService.takePhoto()"
          data-test="take-photo-button"
        >
          <ion-icon name="camera-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-header>
    <ion-content></ion-content>
  `,
  styles: [],
})
export class HomeComponent {
  constructor(protected photoService: PhotoService) {}
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
