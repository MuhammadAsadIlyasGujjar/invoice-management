import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveBulkStockFormComponent } from './receive-bulk-stock-form.component';

describe('ReceiveBulkStockFormComponent', () => {
  let component: ReceiveBulkStockFormComponent;
  let fixture: ComponentFixture<ReceiveBulkStockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiveBulkStockFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceiveBulkStockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
