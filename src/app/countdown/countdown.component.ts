import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
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
  title = new FormControl('')
  selectedDate: Moment | null = null
  minDate = moment().add(1, 'd')

  ngOnInit() {
    this.title.setValue(localStorage.getItem('countdown.title') || '')
    this.title.valueChanges.subscribe(() => {
      localStorage.setItem('countdown.title', this.title.value ?? '')
    })
    this.selectedDate = null
    const persistedDate = localStorage.getItem('countdown.date')
    if (persistedDate) {
      this.selectedDate = moment.unix(parseInt(persistedDate))
    }
  }

  get displayTitle() {
    // Show formated title or no breakspace to keep element line height.
    return this.title.value ? `Time to ${this.title.value}` : ''
  }

  get displayCountdown() {
    if (!this.selectedDate) return ''
    // Get duration until midnight selected date.
    const duration = this.selectedDate.diff(moment())
    const days = Math.floor(duration / DAY_IN_MS)
    const hours = Math.floor((duration - days * DAY_IN_MS) / HOUR_IN_MS)
    const minutes = Math.floor((duration - days * DAY_IN_MS - hours * HOUR_IN_MS) / MINUTE_IN_MS)
    const seconds = Math.floor((duration - days * DAY_IN_MS - hours * HOUR_IN_MS - minutes * MINUTE_IN_MS) / 1000)

    return `${days} days, ${hours} h, ${minutes}m, ${seconds}s`
  }

  onDateChange(event: MatDatepickerInputEvent<Moment>) {
    localStorage.setItem('countdown.date', String(event.value?.unix() ?? ""))
    if (!event.value || event.value.unix() === this.selectedDate?.unix()) return
    this.selectedDate = event.value
  }
}
