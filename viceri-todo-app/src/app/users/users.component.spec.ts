import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UsersService } from '../services/users.service';
import { IUserRegister } from '../../interfaces/user.register';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockUsersService: any;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj(['register']);

    await TestBed.configureTestingModule({
      imports: [
        UsersComponent,
        CommonModule,
        FormsModule,
        RouterModule
      ],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar UsersService.register com os dados corretos', fakeAsync(() => {
    const mockUser: IUserRegister = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    };

    component.user = mockUser;
    mockUsersService.register.and.returnValue(of({ message: 'Usuário criado' }));

    component.register();
    tick();

    expect(mockUsersService.register).toHaveBeenCalledWith(mockUser);
    expect(component.messageError).toBe('');
    expect(component.isSuccess).toBeTrue();
  }));

  it('deve tratar erro corretamente ao cadastrar', fakeAsync(() => {
    const mockError = {
      error: { message: 'E-mail já existe' }
    };

    mockUsersService.register.and.returnValue(throwError(() => mockError));

    component.user = {
      name: 'Erro User',
      email: 'erro@example.com',
      password: '123'
    };

    component.register();
    tick();

    expect(mockUsersService.register).toHaveBeenCalled();
    expect(component.isSuccess).toBeFalse();
    expect(component.messageError).toBe('E-mail já existe');
  }));

  it('deve usar mensagem padrão de erro se não vier mensagem do backend', fakeAsync(() => {
    mockUsersService.register.and.returnValue(throwError(() => ({ error: {} })));

    component.register();
    tick();
    console.log('AQUI NO TESTE',component.messageError);
    expect(component.messageError).toBe('Erro ao cadastrar usuário');
  }));
});
