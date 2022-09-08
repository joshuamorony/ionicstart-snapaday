import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { Photo } from '../interfaces/photo';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage$ = from(this.ionicStorage.create()).pipe(shareReplay(1));

  constructor(private ionicStorage: Storage) {}

  load(): Observable<Photo[]> {
    return this.storage$.pipe(
      switchMap((storage) => from(storage.get('photos'))),
      map((photos) => photos ?? [])
    );
  }

  save(photos: Photo[]) {
    this.load()
      .pipe(
        switchMap(() => this.storage$),
        take(1)
      )
      .subscribe((storage) => {
        storage.set('photos', photos);
      });
  }
}
