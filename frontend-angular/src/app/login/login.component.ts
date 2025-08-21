import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  error: string = "";

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router) {

    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.error = "please fill in all field";
      return;
    }
    this.error = "";

    this.apiService.loginUser(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.apiService.saveToken(res.data)
          this.router.navigate(['/tasks']);
        } else {
          this.error = res.message || "Login not succesful"
        }
      },
      error: (error: any) => {
        this.error = error.error?.message || error.message
      }
    })
  }
}
