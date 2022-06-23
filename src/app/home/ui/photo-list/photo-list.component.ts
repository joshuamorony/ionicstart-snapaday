import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Photo } from '../../../shared/interfaces/photo';
import { DaysAgoPipeModule } from '../days-ago/days-ago.pipe';

@Component({
  selector: 'app-photo-list',
  template: `
    <ion-list data-test="photo-list">
      <ion-item-sliding *ngFor="let photo of photos; trackBy: trackByFn">
        <ion-item data-test="photo">
          <img [src]="photo.safeResourceUrl" />
          <ion-badge data-test="days-ago-label" slot="end" color="light">
            {{ photo.dateTaken | daysAgo }}
          </ion-badge>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option
            data-test="delete-photo-button"
            (click)="delete.emit(photo.name)"
            color="danger"
          >
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoListComponent {
  @Input() photos!: Photo[] | null;
  @Output() delete = new EventEmitter<string>();

  constructor() {}

  trackByFn(index: number, photo: Photo) {
    return photo.name;
  }
}

@NgModule({
  imports: [CommonModule, IonicModule, DaysAgoPipeModule],
  declarations: [PhotoListComponent],
  exports: [PhotoListComponent],
})
export class PhotoListComponentModule {}
