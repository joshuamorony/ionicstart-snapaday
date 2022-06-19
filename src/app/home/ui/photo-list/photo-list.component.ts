import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PhotoService } from '../../data-access/photo/photo.service';

@Component({
  selector: 'app-photo-list',
  template: `
    <ion-list>
      <ion-item
        data-test="take-photo-button"
        button
        (click)="photoService.takePhoto()"
      >
        take photo
      </ion-item>
    </ion-list>
  `,
  styles: [],
})
export class PhotoListComponent {
  constructor(protected photoService: PhotoService) {}
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: PhotoListComponent }]),
  ],
  declarations: [PhotoListComponent],
})
export class PhotoListComponentModule {}
