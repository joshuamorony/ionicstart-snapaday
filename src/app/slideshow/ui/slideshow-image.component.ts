import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-slideshow-image',
  template: `
    <div class="image-container">
      <img data-test="slideshow-image" [src]="safeResourceUrl" />
    </div>
  `,
  styles: [
    `
      .image-container {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideshowImageComponent {
  @Input() safeResourceUrl!: SafeResourceUrl | undefined;
}

@NgModule({
  declarations: [SlideshowImageComponent],
  exports: [SlideshowImageComponent],
})
export class SlideshowImageComponentModule {}
