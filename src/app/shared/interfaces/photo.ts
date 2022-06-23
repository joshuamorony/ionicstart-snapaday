import { SafeResourceUrl } from '@angular/platform-browser';

export interface Photo {
  name: string;
  path: string;
  dateTaken: string;
  safeResourceUrl?: SafeResourceUrl;
}
