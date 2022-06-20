/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Platform } from '@ionic/angular';
import { PhotoService } from './photo.service';

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
  },
}));

describe('PhotoService', () => {
  let service: PhotoService;
  let platform: Platform;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Platform],
    });
    service = TestBed.inject(PhotoService);
    platform = TestBed.inject(Platform);

    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('takePhoto()', () => {
    it('should cause value returned from Camera.getPhoto to be emitted on getPhotos() stream', async () => {
      const observerSpy = subscribeSpyTo(service.getPhotos());
      await service.takePhoto();
      expect(observerSpy.getLastValue()?.[0].path).toContain('test-path');
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

    it('should cause result to emit with current date as name and result of X as the path if not running natively', async () => {
      expect(true).toBeFalsy();
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
        expect(result?.[0].path).toEqual('resultFromConvertFileSrc');
      });
    });
  });
});
