import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

import { AppModule } from '../../../app.module';
import { TermsAndConditionsFormComponent } from './terms-and-conditions-form.component';

describe('TermsAndConditionsFormComponent', () => {
  let component: TermsAndConditionsFormComponent;
  let fixture: ComponentFixture<TermsAndConditionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsAndConditionsFormComponent],
      imports: [AppModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit error message when form is submitted without agreeing to terms', () => {
    const emitSpy = spyOn(component.errorMessageEvent, 'emit');

    component.onSubmit({
      value: {
        agree: false,
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const expectedErrorMessage = [
      {
        elementId: '#agree',
        message:
          'You must accept the terms and conditions to use this service.',
      },
    ];
    expect(emitSpy).toHaveBeenCalledWith(expectedErrorMessage);
  });

  it('should not emit error message when form is submitted after agreeing to terms', () => {
    const emitSpy = spyOn(component.errorMessageEvent, 'emit');
    component.onSubmit({
      value: {
        agree: true,
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith([]);
  });
});
