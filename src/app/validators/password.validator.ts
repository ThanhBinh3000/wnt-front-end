import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

export function passwordValidator(control: AbstractControl): Promise<any> | Observable<any> {
  return new Promise(resolve => {
    const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).\\S{7,14}$');
    const valid = strongRegex.test(control.value);
    if (!valid) {
      resolve({ 'invalidPassword': true });
    } else {
      resolve(null);
    }
  });
}
