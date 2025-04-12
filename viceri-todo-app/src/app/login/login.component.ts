import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  messageError: string = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  async login() {
    console.log('this.authService', this.authService)
    this.authService.login(this.email, this.password)?.subscribe(
        {
          next: async (value) => {
            this.messageError = "";
            
            localStorage.setItem("token", value?.token);
            await this.router.navigate(["/todo"]);
          },
          error: (error) => {
            console.log(error);
            this.messageError = error?.error?.message || "credenciais invalidas";
          }
        }
      );
  }

}
