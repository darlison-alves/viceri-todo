import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IUserRegister } from '../../interfaces/user.register';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  user: IUserRegister = {
    email: "",
    name: "",
    password: ""
  }

  messageError: string = "";
  isSuccess: boolean = false;

  constructor(private userService: UsersService) { }

  register() {
    console.log('Usuário cadastrado:', this.user);

    this.userService.register(this.user)
      .subscribe({
        next: (value) => {
          this.messageError = "";
          this.isSuccess = true;
          console.log(value);
        }
        , error: (error) => {
          console.log(error);
          this.messageError = error?.error?.message || "Erro ao cadastrar usuário";
          this.isSuccess = false;
        }
      });
  }
}
