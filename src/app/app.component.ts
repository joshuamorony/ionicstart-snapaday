import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PhotoService } from './home/data-access/photo/photo.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private photoService: PhotoService) {}

  ngOnInit() {
    this.photoService.init();
  }
}
