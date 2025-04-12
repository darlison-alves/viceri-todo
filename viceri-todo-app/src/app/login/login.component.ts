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

  messageError:string = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  async login() {
    const sucess = this.authService.login(this.email, this.password);

    if(!sucess) {
      this.messageError = "credenciais invalidas";
      return;
    }
    await this.router.navigate(["/todo"]);
  }

}
