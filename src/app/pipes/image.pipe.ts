import { Pipe, PipeTransform } from '@angular/core';
import * as fs from 'fs';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(path: any, placeholder?: string): any {
    try {
      const data = fs.readFileSync(path);
      let ext = path.split('.');
      ext = ext[ext.length - 1];
      if (ext === 'svg') { ext = 'svg+xml'; }
      // insert image
      return 'data:image/' + ext + ';base64,' + data.toString('base64');
    } catch (e) {
      // TODO: Logger
      if (placeholder === 'placeholder') {
        return 'assets/images/uploadUserImg.png';
      }
      return 'assets/images/nav-user-avatar.png';
    }
  }

}
