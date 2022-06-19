import { TestBed } from '@angular/core/testing';
import { Camera, CameraResultType } from '@capacitor/camera';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Platform } from '@ionic/angular';
import { PhotoService } from './photo.service';

jest.mock('@capacitor/camera', () => ({
  ...jest.requireActual('@capacitor/camera'),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Camera: {
    getPhoto: jest.fn().mockResolvedValue({
      dataUrl: 'test-dataUrl',
      path: 'test-path',
      base64String: 'test-base64String',
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

    it('should use the Camera as the source', () => {});

    it('should save result to file system if running natively', () => {});
  });
});
