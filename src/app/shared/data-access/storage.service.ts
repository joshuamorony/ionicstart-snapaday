import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { Photo } from '../interfaces/photo';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  #hasLoaded = false;

  storage$ = from(this.ionicStorage.create()).pipe(shareReplay(1));
  load$: Observable<Photo[]> = this.storage$.pipe(
    switchMap((storage) => from(storage.get('photos'))),
    map((photos) => photos ?? []),
    tap(() => (this.#hasLoaded = true)),
    shareReplay(1)
  );

  constructor(private ionicStorage: Storage) {}

  save(photos: Photo[]) {
    if (this.#hasLoaded) {
      this.storage$.pipe(take(1)).subscribe((storage) => {
        storage.set('photos', photos);
      });
    }
  }
}
