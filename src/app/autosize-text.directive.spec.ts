import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutosizeTextDirective } from './autosize-text.directive';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  template: `
    <h2 appAutosizeText style="font-family: Helvetica; width: 700px;">Testing</h2>
  `,
  imports: [AutosizeTextDirective],
})
class TestComponent { }

describe('TestDirective', () => {
  let fixture: ComponentFixture<TestComponent>
  let el: DebugElement

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [AutosizeTextDirective],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding
    // all elements with an attached HighlightDirective
    el = fixture.debugElement.query(By.directive(AutosizeTextDirective));
  });

  it('should create an instance', () => {

    // fixture.detectChanges();
    console.log(el.nativeElement.style.fontSize)
  });
});
