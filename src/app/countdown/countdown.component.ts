import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import moment, { Moment } from 'moment';
import { AutosizeTextDirective } from '../autosize-text.directive';

const MINUTE_IN_MS = 1000 * 60
const HOUR_IN_MS = MINUTE_IN_MS * 60
const DAY_IN_MS = HOUR_IN_MS * 24

@Component({
  selector: 'app-countdown',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatIconModule, AutosizeTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent {
  displayTitle = ''
  displayCountdown = ''

  title = new FormControl('')
  datepicker = new FormControl<Moment | null>(null)
  minDate = moment().add(1, 'd')

  ngOnInit() {
    this.title.valueChanges.subscribe(() => this.onTitleChange())
    this.datepicker.valueChanges.subscribe(() => this.onDateChange())

    this.title.setValue(localStorage.getItem('countdown.title') || '')

    const persistedDate = localStorage.getItem('countdown.date')
    if (persistedDate) {
      this.datepicker.setValue(moment.unix(parseInt(persistedDate)))
    }
  }

  onTitleChange() {
    localStorage.setItem('countdown.title', this.title.value ?? '')
    this.displayTitle = this.title.value ? `Time to ${this.title.value}` : ''
  }

  onDateChange() {
    localStorage.setItem('countdown.date', String(this.datepicker.value?.unix() ?? ""))

    if (this.datepicker.value) {
      // Get duration until midnight selected date.
      const duration = this.datepicker.value.diff(moment())
      const days = Math.floor(duration / DAY_IN_MS)
      const hours = Math.floor((duration - days * DAY_IN_MS) / HOUR_IN_MS)
      const minutes = Math.floor((duration - days * DAY_IN_MS - hours * HOUR_IN_MS) / MINUTE_IN_MS)
      const seconds = Math.floor((duration - days * DAY_IN_MS - hours * HOUR_IN_MS - minutes * MINUTE_IN_MS) / 1000)

      this.displayCountdown = `${days} days, ${hours} h, ${minutes}m, ${seconds}s`
    } else {
      this.displayCountdown = ''
    }
  }
}
