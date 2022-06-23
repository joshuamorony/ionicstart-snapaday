/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Platform } from '@ionic/angular';
import { PhotoService } from './photo.service';
import { Storage } from '@ionic/storage-angular';

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
  let storage: Storage;

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
          provide: Platform,
          useValue: {
            is: jest.fn(),
          },
        },
        {
          provide: Storage,
          useValue: {
            create: jest.fn().mockResolvedValue({
              set: setMock,
              get: getMock,
            }),
          },
        },
      ],
    });
    service = TestBed.inject(PhotoService);
    platform = TestBed.inject(Platform);
    storage = TestBed.inject(Storage);

    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canTakePhoto()', () => {
    it('should emit true if no photos are present', async () => {
      jest.spyOn(storage, 'create').mockResolvedValue({
        get: jest.fn().mockResolvedValue(undefined),
      } as any);

      const observerSpy = subscribeSpyTo(service.canTakePhoto());
      await service.init();
      expect(observerSpy.getLastValue()).toBe(true);
    });

    it('should emit true if there are no photos that have been taken today', async () => {
      jest.spyOn(storage, 'create').mockResolvedValue({
        get: jest.fn().mockResolvedValue([{ dateTaken: new Date(2022, 5, 5) }]),
      } as any);

      const observerSpy = subscribeSpyTo(service.canTakePhoto());
      await service.init();
      expect(observerSpy.getLastValue()).toBe(true);
    });

    it('should emit false if a photo exists that has been taken today', async () => {
      jest.spyOn(storage, 'create').mockResolvedValue({
        get: jest.fn().mockResolvedValue([{ dateTaken: new Date() }]),
      } as any);

      const observerSpy = subscribeSpyTo(service.canTakePhoto());
      await service.init();
      expect(observerSpy.getLastValue()).toBe(false);
    });
  });

  describe('init()', () => {
    it('should return a promise', () => {
      expect(service.init()).toBeInstanceOf(Promise);
    });

    it('should emit the photos from storage on getPhotos if defined', async () => {
      const observerSpy = subscribeSpyTo(service.getPhotos());
      await service.init();
      expect(observerSpy.getLastValue()).toEqual(testLoadData);
    });

    it('should not emit the photos from storage on getPhotos if not defined', async () => {
      jest.spyOn(storage, 'create').mockResolvedValue({
        get: jest.fn().mockResolvedValue(undefined),
      } as any);

      const observerSpy = subscribeSpyTo(service.getPhotos());
      await service.init();
      expect(observerSpy.getLastValue()).toEqual([]);
    });
  });

  describe('getPhotos()', () => {
    it('should set photo data in storage whenever it emits', async () => {
      const observerSpy = subscribeSpyTo(service.getPhotos());
      await service.init();
      await service.takePhoto();
      expect(setMock).toHaveBeenCalledWith(
        'photos',
        observerSpy.getLastValue()
      );
    });
  });

  describe('deletePhoto()', () => {
    it('should cause getPhotos to emit without the photo that was deleted', async () => {
      const observerSpy = subscribeSpyTo(service.getPhotos());
      await service.init();
      service.deletePhoto(testPhotoOne.name);
      expect(
        observerSpy
          .getLastValue()
          ?.find((photo) => photo.name === testPhotoOne.name)
      ).toBeUndefined();
    });

    it('should delete the file path with Filesystem if running natively', async () => {
      jest.spyOn(platform, 'is').mockReturnValue(true);
      await service.init();
      service.deletePhoto(testPhotoOne.name);

      expect(Filesystem.deleteFile).toHaveBeenCalledWith({
        path: testPhotoOne.name,
        directory: Directory.Data,
      });
    });
  });

  describe('takePhoto()', () => {
    it('should not take photo if photo has already been taken', async () => {
      jest.spyOn(storage, 'create').mockResolvedValue({
        get: jest.fn().mockResolvedValue([{ dateTaken: new Date() }]),
      } as any);
      await service.init();
      await service.takePhoto();
      expect(Camera.getPhoto).not.toHaveBeenCalled();
    });

    it('should use URI result type if running natively', async () => {
      jest.spyOn(platform, 'is').mockReturnValue(true);

      await service.takePhoto();

      expect(Camera.getPhoto).toHaveBeenCalledWith(
        expect.objectContaining({ resultType: CameraResultType.Uri })
      );
    });

    it('should use data url result type if running as PWA', async () => {
      jest.spyOn(platform, 'is').mockReturnValue(false);

      await service.takePhoto();

      expect(Camera.getPhoto).toHaveBeenCalledWith(
        expect.objectContaining({ resultType: CameraResultType.DataUrl })
      );
    });

    it('should use the Camera as the source', async () => {
      await service.takePhoto();

      expect(Camera.getPhoto).toHaveBeenCalledWith(
        expect.objectContaining({ source: CameraSource.Camera })
      );
    });

    it('should not attempt to save natively if not running natively', async () => {
      jest.spyOn(platform, 'is').mockReturnValue(false);
      await service.takePhoto();
      expect(Filesystem.readFile).not.toHaveBeenCalled();
    });

    it('should cause result to emit with result of getPhoto as the dataUrl if not running natively', async () => {
      const observerSpy = subscribeSpyTo(service.getPhotos());

      jest.spyOn(platform, 'is').mockReturnValue(false);
      await service.takePhoto();

      const result = observerSpy.getLastValue();

      expect(result?.[0].path).toEqual('test-dataUrl');
    });

    describe('should save result to file system if running natively', () => {
      beforeEach(() => {
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
        const observerSpy = subscribeSpyTo(service.getPhotos());

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
