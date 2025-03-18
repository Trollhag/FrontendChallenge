import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideMomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideMomentDateAdapter({
      ...MAT_MOMENT_DATE_FORMATS,
      parse: {
        ...MAT_MOMENT_DATE_FORMATS.parse,
        dateInput: ['YYYY-MM-DD'],
      },
      display: {
        ...MAT_MOMENT_DATE_FORMATS.display,
        dateInput: 'YYYY-MM-DD',
      },
    })
  ],
}
