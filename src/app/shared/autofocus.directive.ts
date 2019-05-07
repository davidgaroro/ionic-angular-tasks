import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective {

  constructor(private el: ElementRef) {
    setTimeout(() => {
      this.el.nativeElement.setFocus();
    }, 200);
  }

}
