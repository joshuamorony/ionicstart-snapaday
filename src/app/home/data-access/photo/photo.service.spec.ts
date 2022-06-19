import { TestBed } from '@angular/core/testing';
import { PhotoService } from './photo.service';

jest.mock('@capacitor/camera');

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('takePhoto()', () => {
    it('should cause new photo to emit when Camera resolves', () => {});
  });
});
