import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  regForm: FormGroup;
  error: string = "";

  constructor(private fb:FormBuilder, 
    private apiService: ApiService,
  private router: Router ){

    this.regForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  onSubmit(){
    if (this.regForm.invalid) {
      this.error = "please fill in all field";
      return;
    }
    this.error = "";

    this.apiService.registerUser(this.regForm.value).subscribe({
      next: (res:any) =>{
        if (res.statusCode === 200) {
          this.router.navigate(['/login']);
        }else{
          this.error = res.message || "Register not succesful" 
        }
      },
      error:(error: any) =>{
        this.error = error.error?.message || error.message
      }
    })
  }

}
