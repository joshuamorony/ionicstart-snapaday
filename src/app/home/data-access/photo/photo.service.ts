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
import { Storage } from '@ionic/storage-angular';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photos$ = new BehaviorSubject<Photo[]>([]);
  private storage: Storage | null = null;

  constructor(private platform: Platform, private ionicStorage: Storage) {}

  async init() {
    this.storage = await this.ionicStorage.create();

    const photos = await this.storage?.get('photos');
    if (photos) {
      this.photos$.next(photos);
    }
  }

  getPhotos() {
    return this.photos$.pipe(
      tap((photos) => this.storage?.set('photos', photos))
    );
  }

  canTakePhoto() {
    return this.photos$.pipe(map((photos) => !this.hasTakenPhotoToday(photos)));
  }

  async takePhoto() {
    if (this.hasTakenPhotoToday(this.photos$.value)) {
      return;
    }

    const options: ImageOptions = {
      quality: 50,
      width: 600,
      allowEditing: false,
      resultType: this.platform.is('capacitor')
        ? CameraResultType.Uri
        : CameraResultType.DataUrl,
      source: CameraSource.Camera,
    };

    try {
      const photo = await Camera.getPhoto(options);

      const uniqueName = Date.now().toString();

      if (this.platform.is('capacitor') && photo.path) {
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
      } else if (photo.dataUrl) {
        this.addPhoto(uniqueName, photo.dataUrl);
      }
    } catch (err) {
      console.log(err);
      throw new Error('Could not save photo');
    }
  }

  async deletePhoto(name: string) {
    const newPhotos = this.photos$.value.filter(
      (photos) => photos.name !== name
    );

    this.photos$.next(newPhotos);

    if (this.platform.is('capacitor')) {
      await Filesystem.deleteFile({
        path: name,
        directory: Directory.Data,
      });
    }
  }

  private addPhoto(fileName: string, filePath: string) {
    const newPhotos = [
      {
        name: fileName,
        path: filePath,
        dateTaken: new Date().toISOString(),
      },
      ...this.photos$.value,
    ];

    this.photos$.next(newPhotos);
  }

  private hasTakenPhotoToday(photos: Photo[]) {
    return photos.find(
      (photo) =>
        new Date().setHours(0, 0, 0, 0) ===
        new Date(photo.dateTaken).setHours(0, 0, 0, 0)
    )
      ? true
      : false;
  }
}
