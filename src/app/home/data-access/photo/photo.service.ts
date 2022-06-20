import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  Camera,
  ImageOptions,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Photo } from '../../../shared/interfaces/photo';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photos$ = new BehaviorSubject<Photo[]>([]);

  constructor(private platform: Platform) {}

  getPhotos() {
    return this.photos$.asObservable();
  }

  async takePhoto() {
    const options: ImageOptions = {
      quality: 50,
      width: 600,
      allowEditing: false,
      resultType: this.platform.is('capacitor')
        ? CameraResultType.Uri
        : CameraResultType.DataUrl,
      source: CameraSource.Camera,
    };

    const photo = await Camera.getPhoto(options);

    if (photo.path) {
      const uniqueName = Date.now().toString();

      if (this.platform.is('capacitor')) {
        const photoOnFileSystem = await Filesystem.readFile({
          path: photo.path,
        });

        const fileName = uniqueName + '.jpeg';
        const permanentFile = await Filesystem.writeFile({
          data: photoOnFileSystem.data,
          path: fileName,
          directory: Directory.Data,
        });

        this.addPhoto(fileName, Capacitor.convertFileSrc(permanentFile.uri));
      } else {
        this.addPhoto(uniqueName, photo.path);
      }
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
