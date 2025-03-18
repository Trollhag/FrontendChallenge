import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutosizeText]',
  standalone: true
})
export class AutosizeTextDirective {
  content: string

  constructor(private el: ElementRef<HTMLElement>) {
    this.el.nativeElement.style.fontSize = '0px'
    this.content = this.el.nativeElement.innerHTML
  }

  ngAfterContentChecked() {
    const content = this.el.nativeElement.innerHTML
    if (content.length > 0 && content !== this.content) {
      this.calcMaxFontSize()
    }
    this.content = content
  }

  @HostListener('window:resize')
  onResize() {
    this.calcMaxFontSize()
  }

  calcMaxFontSize() {
    // Save interfering style values.
    const lineHeight = this.el.nativeElement.style.lineHeight
    const paddingTop = this.el.nativeElement.style.paddingTop
    const paddingBottom = this.el.nativeElement.style.paddingBottom

    // Remove styles interfering with calculations.
    this.el.nativeElement.style.lineHeight = '1'
    this.el.nativeElement.style.paddingTop = '0px'
    this.el.nativeElement.style.paddingBottom = '0px'

    let fontSize = 1
    // Loop until text line breaks. Max out at 10k to prevent infinite looping.
    // By breaking it in to 3 loops, 100, 10, 1, we minimize the number of total iterations.
    // E.g. if the target font size is 270, we'd be doing 271 iterations using one loop, and 7 interations with three loops.
    while (fontSize < 10000) {
      fontSize += 100
      this.el.nativeElement.style.fontSize = `${fontSize}px`

      const height = this.el.nativeElement.clientHeight
      if (height > fontSize) {
        break;
      }
    }
    for (let i = 0; i < fontSize / 10; i++) {
      fontSize -= 10
      this.el.nativeElement.style.fontSize = `${fontSize}px`

      const height = this.el.nativeElement.clientHeight
      if (height <= fontSize) {
        break;
      }
    }
    for (let i = 0; i < 10; i++) {
      fontSize++
      this.el.nativeElement.style.fontSize = `${fontSize}px`

      const height = this.el.nativeElement.clientHeight
      if (height > fontSize) {
        fontSize--
        this.el.nativeElement.style.fontSize = `${fontSize}px`
        break;
      }
    }

    // Reset interfering styles.
    this.el.nativeElement.style.lineHeight = lineHeight
    this.el.nativeElement.style.paddingTop = paddingTop
    this.el.nativeElement.style.paddingBottom = paddingBottom
  }

}
