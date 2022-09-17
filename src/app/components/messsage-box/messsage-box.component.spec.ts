import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesssageBoxComponent } from './messsage-box.component';

describe('MesssageBoxComponent', () => {
  let component: MesssageBoxComponent;
  let fixture: ComponentFixture<MesssageBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesssageBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesssageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
