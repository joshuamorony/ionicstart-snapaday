import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-slideshow',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title></ion-title>
        <ion-buttons>
          <ion-button data-test="play-button">
            <ion-icon name="play" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <img data-test="slideshow-image" src="" />
    </ion-content>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideshowComponent {}

@NgModule({
  declarations: [SlideshowComponent],
  imports: [IonicModule, CommonModule],
  exports: [SlideshowComponent],
})
export class SlideshowComponentModule {}
