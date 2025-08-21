import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskformComponent } from './taskform/taskform.component';

export const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},

    {path: 'tasks', component: TasksComponent},
    {path: 'tasks/add', component: TaskformComponent},
    {path: 'tasks/edit/:id', component: TaskformComponent},


    // DEFAULT FALLBACK URL
    {path: '', redirectTo: '/tasks', pathMatch: 'full'},
    {path: '**', redirectTo: '/tasks', pathMatch: 'full'}
];
