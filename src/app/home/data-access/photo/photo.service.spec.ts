/* eslint-disable @typescript-eslint/naming-convention */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Platform } from '@ionic/angular';
import { PhotoService } from './photo.service';
import { StorageService } from '../../../shared/data-access/storage.service';
import { of } from 'rxjs';

jest.mock('@capacitor/core', () => ({
  ...jest.requireActual('@capacitor/core'),
  Capacitor: {
    convertFileSrc: jest.fn().mockReturnValue('result-from-convertFileSrc'),
  },
}));

jest.mock('@capacitor/camera', () => ({
  ...jest.requireActual('@capacitor/camera'),
  Camera: {
    getPhoto: jest.fn().mockResolvedValue({
      dataUrl: 'test-dataUrl',
      path: 'test-path',
      base64String: 'test-base64String',
    }),
  },
}));

jest.mock('@capacitor/filesystem', () => ({
  ...jest.requireActual('@capacitor/filesystem'),
  Filesystem: {
    readFile: jest.fn().mockResolvedValue({
      data: 'dataFromReadFile',
    }),
    writeFile: jest.fn().mockResolvedValue({
      uri: 'uriFromWriteFile',
    }),
    deleteFile: jest.fn().mockResolvedValue(true),
  },
}));

describe('PhotoService', () => {
  let service: PhotoService;
  let platform: Platform;
  let storageService: StorageService;

  const testPhotoOne = {
    name: 'photo1',
  };

  const testPhotoTwo = {
    name: 'photo2',
  };

  const testLoadData: any = [testPhotoOne, testPhotoTwo];

  const setMock = jest.fn();
  const getMock = jest.fn().mockResolvedValue(testLoadData);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StorageService,
          useValue: {
            load$: of(testLoadData),
            save: jest.fn(),
          },
        },
        {
          provide: Platform,
          useValue: {
            is: jest.fn(),
          },
        },
      ],
    });

    jest.clearAllMocks();
  });

  it('should be created', () => {
    storageService = TestBed.inject(StorageService);
    service = TestBed.inject(PhotoService);
    platform = TestBed.inject(Platform);

    expect(service).toBeTruthy();
  });

  describe('hasTakenPhotoToday$', () => {
    it('should emit true if no photos are present', () => {
      TestBed.overrideProvider(StorageService, {
        useValue: {
          load$: of([]),
          save: jest.fn(),
        },
      });

      storageService = TestBed.inject(StorageService);
      service = TestBed.inject(PhotoService);
      platform = TestBed.inject(Platform);

      const observerSpy = subscribeSpyTo(service.hasTakenPhotoToday$);
      service.load();
      expect(observerSpy.getLastValue()).toBe(false);
    });

    it('should emit true if there are no photos that have been taken today', () => {
      TestBed.overrideProvider(StorageService, {
        useValue: {
          load$: of([{ dateTaken: new Date(2022, 5, 5) }]),
          save: jest.fn(),
        },
      });

      storageService = TestBed.inject(StorageService);
      service = TestBed.inject(PhotoService);
      platform = TestBed.inject(Platform);

      const observerSpy = subscribeSpyTo(service.hasTakenPhotoToday$);
      service.load();
      expect(observerSpy.getLastValue()).toBe(false);
    });

    it('should emit false if a photo exists that has been taken today', () => {
      TestBed.overrideProvider(StorageService, {
        useValue: {
          load$: of([{ dateTaken: new Date() }]),
          save: jest.fn(),
        },
      });

      storageService = TestBed.inject(StorageService);
      service = TestBed.inject(PhotoService);
      platform = TestBed.inject(Platform);

      const observerSpy = subscribeSpyTo(service.hasTakenPhotoToday$);
      service.load();
      expect(observerSpy.getLastValue()).toBe(true);
    });
  });

  describe('init()', () => {
    it('should emit the photos from storage on getPhotos if defined', () => {
      storageService = TestBed.inject(StorageService);
      service = TestBed.inject(PhotoService);
      platform = TestBed.inject(Platform);
      const observerSpy = subscribeSpyTo(service.photos$);
      service.load();
      expect(observerSpy.getLastValue()).toEqual(testLoadData);
    });
  });

  describe('getPhotos()', () => {
    it('should set photo data in storage whenever it emits', async () => {
      jest.spyOn(storageService, 'save');

      const photoSpy = subscribeSpyTo(service.photos$);
      service.load();
      await service.takePhoto();
      expect(storageService.save).toHaveBeenCalledWith(photoSpy.getLastValue());
    });
  });

  describe('deletePhoto()', () => {
    it('should cause getPhotos to emit without the photo that was deleted', async () => {
      const observerSpy = subscribeSpyTo(service.photos$);
      service.load();
      service.deletePhoto(testPhotoOne.name);
      expect(
        observerSpy
          .getLastValue()
          ?.find((photo) => photo.name === testPhotoOne.name)
      ).toBeUndefined();
    });

    it('should delete the file path with Filesystem if running natively', async () => {
      jest.spyOn(platform, 'is').mockReturnValue(true);
      service.load();
      service.deletePhoto(testPhotoOne.name);

      expect(Filesystem.deleteFile).toHaveBeenCalledWith({
        path: testPhotoOne.name,
        directory: Directory.Data,
      });
    });
  });

  describe('takePhoto()', () => {
    it('should use URI result type if running natively', async () => {
      storageService = TestBed.inject(StorageService);
      service = TestBed.inject(PhotoService);
      platform = TestBed.inject(Platform);
      jest.spyOn(platform, 'is').mockReturnValue(true);

      await service.takePhoto();

      expect(Camera.getPhoto).toHaveBeenCalledWith(
        expect.objectContaining({ resultType: CameraResultType.Uri })
      );
    });

    it('should use data url result type if running as PWA', async () => {
      storageService = TestBed.inject(StorageService);
      service = TestBed.inject(PhotoService);
      platform = TestBed.inject(Platform);
      jest.spyOn(platform, 'is').mockReturnValue(false);

      await service.takePhoto();

      expect(Camera.getPhoto).toHaveBeenCalledWith(
        expect.objectContaining({ resultType: CameraResultType.DataUrl })
      );
    });

    it('should use the Camera as the source', async () => {
      storageService = TestBed.inject(StorageService);
      service = TestBed.inject(PhotoService);
      platform = TestBed.inject(Platform);
      await service.takePhoto();

      expect(Camera.getPhoto).toHaveBeenCalledWith(
        expect.objectContaining({ source: CameraSource.Camera })
      );
    });

    it('should not attempt to save natively if not running natively', async () => {
      storageService = TestBed.inject(StorageService);
      service = TestBed.inject(PhotoService);
      platform = TestBed.inject(Platform);
      jest.spyOn(platform, 'is').mockReturnValue(false);
      await service.takePhoto();
      expect(Filesystem.readFile).not.toHaveBeenCalled();
    });

    it('should cause result to emit with result of getPhoto as the dataUrl if not running natively', async () => {
      storageService = TestBed.inject(StorageService);
      service = TestBed.inject(PhotoService);
      platform = TestBed.inject(Platform);
      const observerSpy = subscribeSpyTo(service.photos$);

      jest.spyOn(platform, 'is').mockReturnValue(false);
      await service.takePhoto();

      const result = observerSpy.getLastValue();

      expect(result?.[0].path).toEqual('test-dataUrl');
    });

    describe('should save result to file system if running natively', () => {
      beforeEach(() => {
        storageService = TestBed.inject(StorageService);
        service = TestBed.inject(PhotoService);
        platform = TestBed.inject(Platform);
        jest.spyOn(platform, 'is').mockReturnValue(true);
      });

      it('should pass photo path from camera to readFile', async () => {
        await service.takePhoto();
        expect(Filesystem.readFile).toHaveBeenCalledWith({ path: 'test-path' });
      });

      it('should call writeFile with the data from readFile, the current date as a file name, and the Data directory', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));

        await service.takePhoto();

        expect(Filesystem.writeFile).toHaveBeenCalledWith({
          data: 'dataFromReadFile',
          path: Date.now().toString() + '.jpeg',
          directory: Directory.Data,
        });
      });

      it('should cause result to emit with result of convertFileSrc as the path', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
        const observerSpy = subscribeSpyTo(service.photos$);

        await service.takePhoto();

        const result = observerSpy.getLastValue();

        expect(Capacitor.convertFileSrc).toHaveBeenCalledWith(
          'uriFromWriteFile'
        );
        expect(result?.[0].path).toEqual('result-from-convertFileSrc');
      });
    });
  });
});
