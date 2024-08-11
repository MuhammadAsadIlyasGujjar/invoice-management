import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() options: any[] = [
      { name: 'Monthly', value: 'monthly' },
      { name: 'Weekly', value: 'weekly' },
      { name: 'Daily', value: 'daily' }
  ];
  @Input() defaultOption: string = 'monthly';

  @Input() type: string | null = null;

  @Input() sortOrder: string = 'desc';
  
  @Output('filterParamsChanged') filterParams: any = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    // Initialize the reactive form
    this.filterForm = this.fb.group({
      rangeDates: [[], [dateRangeValidator()]],  // Use an array to hold start and end dates
      option: ['', Validators.required],   // Form control for option
      sortOrder: 'desc'
    });
  }

  ngOnInit(): void {
    // Set default date range using Moment.js
    const currentYear = moment().year();
    const startDate = moment(`${currentYear}-01-01`).toDate();
    const endDate = moment(`${currentYear}-12-31`).toDate();

    // Set default values in the form
    this.filterForm.patchValue({
      rangeDates: [startDate, endDate],
      option: this.defaultOption,
      sortOrder: this.sortOrder
    });

    this.filterParams.emit({
      startDate: moment(startDate).startOf('day').toDate(),
      endDate: moment(endDate).endOf('day').toDate(),
      option: this.defaultOption,
      sortOrder: this.sortOrder
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
            option: filterFormData.option,
            sortOrder: filterFormData.sortOrder
          })
        }
      }
    })
  }

  onSubmit(): void {
    console.log(this.filterForm.value);
  }

  get selectedSortOrder() {
    return this.filterForm.get('sortOrder')?.value;
  }

  onToggleSort() {
    const newSortOrder = this.selectedSortOrder === 'asc' ? 'desc' : 'asc'
    this.filterForm.patchValue({
      sortOrder: newSortOrder
    })
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
