import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule
  ]
})
export class LoginComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(private fb: FormBuilder,) {
    this.formGroup = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
  }

  login() {
    console.log(this.formGroup.value)
  }
}
