import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterState: any = null;

  constructor() {}

  // Set the filter data
  setFilterState(filter: any) {
    this.filterState = filter;
  }

  // Get the filter data
  getFilterState(): any {
    return this.filterState;
  }

  // Clear the filter data
  clearFilterState() {
    this.filterState = null;
  }
}
