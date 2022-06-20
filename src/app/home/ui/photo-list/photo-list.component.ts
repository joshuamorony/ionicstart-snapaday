import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Photo } from '../../../shared/interfaces/photo';

@Component({
  selector: 'app-photo-list',
  template: ``,
  styles: [],
})
export class PhotoListComponent {
  @Input() photos!: Photo[];

  constructor() {}
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
