import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TodoComponent } from './todo/todo.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
    
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: "todo",
        component: TodoComponent,
        canActivate: [authGuard]
    },
    {
        path: "register",
        component: UsersComponent
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    },
];
