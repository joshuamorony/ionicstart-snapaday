import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';

describe('StorageService', () => {
  let service: StorageService;
  let storage: Storage;

  const testLoadData = {};

  const setMock = jest.fn();
  const getMock = jest.fn().mockResolvedValue(testLoadData);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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

    jest.clearAllMocks();
  });

  it('should be created', () => {
    service = TestBed.inject(StorageService);
    storage = TestBed.inject(Storage);
    expect(service).toBeTruthy();
  });

  describe('load()', () => {
    it('should return result of get method of storage api', (done) => {
      service = TestBed.inject(StorageService);
      storage = TestBed.inject(Storage);

      service.load().subscribe((result) => {
        expect(getMock).toHaveBeenCalledWith('photos');
        expect(result).toEqual(testLoadData);
        done();
      });
    });

    it('should return empty array if key is undefined', (done) => {
      const undefinedGetMock = jest.fn().mockResolvedValue(undefined);

      TestBed.overrideProvider(Storage, {
        useValue: {
          create: jest.fn().mockResolvedValue({
            set: setMock,
            get: undefinedGetMock,
          }),
        },
      });

      service = TestBed.inject(StorageService);
      storage = TestBed.inject(Storage);

      service.load().subscribe((result) => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('save()', () => {
    beforeEach(() => {
      service = TestBed.inject(StorageService);
      storage = TestBed.inject(Storage);
    });

    it('should pass data to set method of storage api', () => {
      const testData = {};

      service.load().subscribe(() => {
        service.save(testData as any);
        expect(setMock).toHaveBeenCalledWith('photos', testData);
      });
    });

    it('should NOT pass data if photos have not been loaded yet', () => {
      const testData = {};
      service.save(testData as any);
      expect(setMock).not.toHaveBeenCalled();
    });
  });
});
