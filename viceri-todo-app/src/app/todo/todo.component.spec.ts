import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TodoService } from '../services/todo.service';
import { PriorityEnum } from '../enums/priority.enum';
import { Task } from '../../interfaces/todo.interface';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let mockTodoService: any;

  beforeEach(async () => {
    mockTodoService = {
      getTasks: jasmine.createSpy('getTasks'),
      addTask: jasmine.createSpy('addTask'),
      toggleTask: jasmine.createSpy('toggleTask'),
      deleteTask: jasmine.createSpy('deleteTask'),
    };

    await TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar tarefas no ngOnInit', () => {
    const tasks: Task[] = [
      { id: 1, title: 'Test task', done: false, priority: PriorityEnum.MEDIUM }
    ];

    mockTodoService.getTasks.and.returnValue(of(tasks));

    component.ngOnInit();

    expect(mockTodoService.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(tasks);
  });

  it('deve adicionar uma nova tarefa', fakeAsync(() => {
    component.newTask = 'Nova tarefa';
    component.priority = PriorityEnum.HIGH;

    mockTodoService.addTask.and.returnValue(of({ lastID: 99 }));

    component.addTask();
    tick();

    expect(mockTodoService.addTask).toHaveBeenCalledWith('Nova tarefa', PriorityEnum.HIGH);
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].title).toBe('Nova tarefa');
    expect(component.tasks[0].priority).toBe(PriorityEnum.HIGH);
    expect(component.newTask).toBe('');
  }));

  it('não deve adicionar tarefa se for string vazia', () => {
    component.newTask = '   ';
    component.addTask();
    expect(mockTodoService.addTask).not.toHaveBeenCalled();
  });

  it('deve remover tarefa', fakeAsync(() => {
    const task: Task = { id: 1, title: 'Task to delete', done: false, priority: PriorityEnum.LOW };
    component.tasks = [task];

    mockTodoService.deleteTask.and.returnValue(of({}));

    component.removeTask(0);
    tick();

    expect(mockTodoService.deleteTask).toHaveBeenCalledWith(1);
    expect(component.tasks.length).toBe(0);
  }));

  it('deve marcar tarefa como concluída', fakeAsync(() => {
    const task: Task = { id: 2, title: 'Done task', done: true, priority: PriorityEnum.LOW };
    mockTodoService.toggleTask.and.returnValue(of({}));

    component.toggleDone(task);
    tick();

    expect(mockTodoService.toggleTask).toHaveBeenCalledWith(2, true);
  }));

  it('deve atualizar prioridade ao selecionar', () => {
    const mockEvent = { target: { value: PriorityEnum.HIGH } };
    component.updatePriority(mockEvent);
    expect(component.priority).toBe(PriorityEnum.HIGH);
  });

  it('deve retornar true no canFinish se existir tarefa concluída', () => {
    component.tasks = [
      { id: 1, title: 'A', done: false, priority: PriorityEnum.LOW },
      { id: 2, title: 'B', done: true, priority: PriorityEnum.MEDIUM }
    ];
    expect(component.canFinish()).toBeTrue();
  });

  it('deve retornar false no canFinish se nenhuma tarefa estiver concluída', () => {
    component.tasks = [
      { id: 1, title: 'A', done: false, priority: PriorityEnum.LOW },
      { id: 2, title: 'B', done: false, priority: PriorityEnum.MEDIUM }
    ];
    expect(component.canFinish()).toBeFalse();
  });

  it('deve recarregar tarefas no método finish()', fakeAsync(() => {
    const tasks: Task[] = [
      { id: 10, title: 'Finalizada', done: true, priority: PriorityEnum.HIGH }
    ];

    mockTodoService.getTasks.and.returnValue(of(tasks));

    component.finish();
    tick();

    expect(mockTodoService.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(tasks);
  }));
});
