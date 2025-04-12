import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IUserRegister } from '../../interfaces/user.register';

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

  messageError: string = ""

  cadastrar() {
    console.log('Usuário cadastrado:', this.user);
    // Aqui você pode chamar um service para enviar os dados para uma API
  }
}
