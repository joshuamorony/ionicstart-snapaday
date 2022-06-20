import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Photo } from '../../../shared/interfaces/photo';

@Component({
  selector: 'app-photo-list',
  template: `
    <ion-list>
      <ion-item *ngFor="let photo of photos" data-test="photo">
        <img [src]="photo.safeResourceUrl" />
      </ion-item>
    </ion-list>
  `,
  styles: [],
})
export class PhotoListComponent {
  @Input() photos!: Photo[] | null;

  constructor() {}
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: PhotoListComponent }]),
  ],
  declarations: [PhotoListComponent],
  exports: [PhotoListComponent],
})
export class PhotoListComponentModule {}
