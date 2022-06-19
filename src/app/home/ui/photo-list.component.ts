import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-photo-list',
  template: ``,
  styles: [],
})
export class PhotoListComponent {}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: PhotoListComponent }]),
  ],
  declarations: [PhotoListComponent],
})
export class PhotoListComponentModule {}
