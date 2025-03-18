import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

const fonts = ["12px 'Open Sauce One'", "800 12px 'Open Sauce One'"]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'FrontendChallenge'
  fontsLoaded = !fonts.map(f => document.fonts.check(f)).includes(false)

  constructor() {
    Promise.all(fonts.map(f => document.fonts.load(f)))
      .then(() => {
        this.fontsLoaded = true
      })
  }
}
