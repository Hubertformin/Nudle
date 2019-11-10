import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NudleService {

  constructor() {}
  // get random color
  get randomColor () {
    return this.colors[Math.floor(Math.random() * (this.colors.length - 1))];
  }
  static readonly static_path: string = 'bin';
  static readonly resource_dir: string = 'bin/.res';
  static readonly config_path: string = 'bin/.cfg';
  static readonly emp_path: string = 'bin/.emp';
  readonly colors = [
    '#718096', '#E53E3E', '#DD6B20', '#D69E2E', '#5A67D8', '#805AD5', '#D53F8C', '#234E52', '#2A4365', '#2B6CB0',
    '#d32f2f', '#c2185b', '#0097a7', '#827717', '#ef6c00', '#4e342e', '#d84315', '#37474f', '#263238', '#1976d2'
  ];
  // convert base64 to blob
  public static Base64ToBlob(b64Data, contentType = '', sliceSize = 512): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  }
  // get file from blob
  public static toFileData(data, type) {
    return URL.createObjectURL(NudleService.Base64ToBlob(data, type));
  }

  watchLocation(): Observable<any> {
    // Create an Observable that will start listening to geolocation updates
    // when a consumer subscribes.
    return new Observable((observer) => {
      // Get the next and error callbacks. These will be passed in when
      // the consumer subscribes.
      const {next, error, complete} = observer;
      let watchId;

      // Simple geolocation API check provides values to publish
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(next, error);
      } else {
        error('Geolocation not available');
      }
      complete();
      // When the consumer unsubscribes, clean up data ready for next subscription-config.
      return {unsubscribe() { navigator.geolocation.clearWatch(watchId); }};
    });
  }
  // when browser is online
  watchOnline(): Observable<any> {
    return new Observable((observer) => {
      const {next, error, complete} = observer;
      // watch online state
      try {
       // const online$ = fromEvent(window, 'online'),
       //   offline$ = fromEvent(window, 'offline');
        window.addEventListener('online', (event) => {
          next(true);
          complete();
        });
        window.addEventListener('offline', (event) => {
          next(false);
          complete();
        });
       //
      } catch (e) {
        error(e);
      }
    });
  }
}

