import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appRandomColor]'
})
export class RandomColorDirective {

  constructor(el: ElementRef) {
    const _letter = '0123456789'.split('');
    let _color = '#';
    for (let i = 0; i < 6; i++) {
      _color += _letter[Math.floor(Math.random() * 10)];
    }
    el.nativeElement.style.backgroundColor = _color;
  }

}
