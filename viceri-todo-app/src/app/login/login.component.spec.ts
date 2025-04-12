import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';


@Component({ template: '' })
class DummyTodoComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jasmine.createSpy('login')
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        RouterTestingModule.withRoutes([
          { path: 'todo', component: DummyTodoComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve logar com sucesso', fakeAsync(async () => {
    const mockResponse = { token: '123abc' };
    mockAuthService.login.and.returnValue(of(mockResponse));

    component.email = 'teste@email.com';
    component.password = 'senha123';

    await component.login();
    tick(); // simula passagem de tempo assíncrono

    expect(mockAuthService.login).toHaveBeenCalledWith('teste@email.com', 'senha123');
    expect(localStorage.getItem('token')).toBe('123abc');
    expect(component.messageError).toBe('');
  }));

  it('deve exibir mensagem de erro ao falhar login', fakeAsync(async () => {
    const mockError = { error: { message: 'Credenciais inválidas' } };
    mockAuthService.login.and.returnValue(throwError(() => mockError));

    component.email = 'errado@email.com';
    component.password = 'senhaerrada';

    await component.login();
    tick();

    expect(mockAuthService.login).toHaveBeenCalled();
    expect(component.messageError).toBe('Credenciais inválidas');
  }));

  it('deve exibir mensagem padrão se erro não tiver message', fakeAsync(async () => {
    const mockError = {};
    mockAuthService.login.and.returnValue(throwError(() => mockError));

    await component.login();
    tick();

    expect(component.messageError).toBe('credenciais invalidas');
  }));
});
