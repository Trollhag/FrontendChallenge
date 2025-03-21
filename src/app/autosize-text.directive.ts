import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAutosizeText]',
  standalone: true
})
export class AutosizeTextDirective {
  @Input() cacheKey?: string

  constructor(private el: ElementRef<HTMLElement>) { }

  ngAfterContentChecked() {
    this.calcMaxFontSize()
  }

  setSize(size: number) {
    this.el.nativeElement.style.fontSize = `${size}vw`
  }

  get isMaxed() {
    return this.el.nativeElement.clientWidth >= window.innerWidth
  }

  calcMaxFontSize() {
    if (this.cacheKey) {
      const cachedFontSize = localStorage.getItem(`autosizetext.${this.cacheKey}`)
      if (cachedFontSize) {
        this.setSize(parseFloat(cachedFontSize))
        return
      }
    }

    // Prepare element for calculations, save original values for reset later.
    const textWrap = this.el.nativeElement.style.textWrap
    this.el.nativeElement.style.textWrap = 'nowrap'

    let fontSize = 0
    // Loop until element width is higher than window width. Max out at 100 to prevent infinite looping.
    // By breaking it in to 3 loops, 1, 0.1, 0.01, we minimize the number of total iterations.
    while (fontSize < 100) {
      fontSize++
      this.setSize(fontSize)

      if (this.isMaxed) {
        break;
      }
    }
    for (let i = 0; i < 10; i++) {
      fontSize -= 0.1
      this.setSize(fontSize)

      if (!this.isMaxed) {
        break;
      }
    }
    for (let i = 0; i < 10; i++) {
      fontSize += 0.01
      this.setSize(fontSize)

      if (this.isMaxed) {
        // Set size back to the last non-breaking size.
        fontSize -= 0.01
        this.setSize(fontSize)
        break;
      }
    }

    if (this.cacheKey) {
      localStorage.setItem(`autosizetext.${this.cacheKey}`, String(fontSize))
    }

    // Reset modified style values.
    this.el.nativeElement.style.textWrap = textWrap
  }

}
