import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/** A hero's name can't match the hero's alter ego */
export const duplicateEmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const name = control.get('email');
    const newEmail = control.get('newEmail');
  
    return name && newEmail && name.value === newEmail.value ? { duplicateMail: true } : null;
  };