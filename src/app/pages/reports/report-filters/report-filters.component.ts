import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectButtonModule, CalendarModule],
  templateUrl: './report-filters.component.html',
  styleUrl: './report-filters.component.scss'
})
export class ReportFiltersComponent {
filterForm: FormGroup;    
  granularityOptions: any[] = [
      { name: 'Monthly', value: 'monthly' },
      { name: 'Weekly', value: 'weekly' },
      { name: 'Daily', value: 'daily' }
  ];
  
  @Output('filterParamsChanged') filterParams: any = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    // Initialize the reactive form
    this.filterForm = this.fb.group({
      rangeDates: [[], [dateRangeValidator()]],  // Use an array to hold start and end dates
      granularity: ['', Validators.required]   // Form control for granularity
    });
  }

  ngOnInit(): void {
    // Set default date range using Moment.js
    const currentYear = moment().year();
    const startDate = moment(`${currentYear}-01-01`).toDate();
    const endDate = moment(`${currentYear}-12-31`).toDate();

    const defaultGranularity: string = 'monthly';

    // Set default values in the form
    this.filterForm.patchValue({
      rangeDates: [startDate, endDate],
      granularity: 'monthly'  // Default granularity
    });

    this.filterParams.emit({
      startDate: moment(startDate).startOf('day').toDate(),
      endDate: moment(endDate).endOf('day').toDate(),
      granularity: defaultGranularity
    })

    this.filterForm.valueChanges.subscribe({
      next: (filterFormData) => {
        if(this.filterForm.valid) {
          const [fromDate, toDate] = filterFormData.rangeDates;
          const startDate = moment(fromDate).startOf('day').toDate();
          const endDate = moment(toDate).endOf('day').toDate();

          this.filterParams.emit({
            startDate,
            endDate,
            granularity: filterFormData.granularity
          })
        }
      }
    })
  }

  onSubmit(): void {
    console.log(this.filterForm.value);
  }

}

// Custom validator to check if the length of rangeDates is 2 and both are valid dates
export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dates = control.value;

    // Check if dates is an array of length 2
    if (Array.isArray(dates) && dates.length === 2) {
      const [startDate, endDate] = dates;

      // Check if both entries are valid dates using Moment.js
      const isStartDateValid = moment(startDate, moment.ISO_8601, true).isValid();
      const isEndDateValid = moment(endDate, moment.ISO_8601, true).isValid();

      if (isStartDateValid && isEndDateValid) {
        return null; // Valid
      }
    }

    return { invalidDateRange: true }; // Invalid
  };
}
