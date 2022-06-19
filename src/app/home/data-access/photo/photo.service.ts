import { Injectable } from '@angular/core';
import { Camera, ImageOptions, CameraResultType } from '@capacitor/camera';
import { BehaviorSubject } from 'rxjs';
import { Photo } from '../../../shared/interfaces/photo';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photos$ = new BehaviorSubject<Photo[]>([]);

  getPhotos() {
    return this.photos$.asObservable();
  }

  async takePhoto() {
    const options: ImageOptions = {
      resultType: CameraResultType.Uri,
    };

    const photo = await Camera.getPhoto(options);

    if (photo.path) {
      this.addPhoto(Date.now().toString(), photo.path);
    }
  }

  private addPhoto(fileName: string, filePath: string) {
    const newPhotos = [
      {
        name: fileName,
        path: filePath,
        dateTaken: new Date(),
      },
      ...this.photos$.value,
    ];

    this.photos$.next(newPhotos);
  }
}
