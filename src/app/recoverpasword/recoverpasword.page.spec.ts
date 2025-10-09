import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverPaswordPage } from './recoverpasword.page';

describe('RecoverPaswordPage', () => {
  let component: RecoverPaswordPage;
  let fixture: ComponentFixture<RecoverPaswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverPaswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
