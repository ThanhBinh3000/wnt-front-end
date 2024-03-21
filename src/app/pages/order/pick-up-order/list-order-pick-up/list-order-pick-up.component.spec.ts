import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrderPickUpComponent } from './list-order-pick-up.component';

describe('ListOrderPickUpComponent', () => {
  let component: ListOrderPickUpComponent;
  let fixture: ComponentFixture<ListOrderPickUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOrderPickUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOrderPickUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
