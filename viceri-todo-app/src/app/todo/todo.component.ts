import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { Task } from '../../interfaces/todo.interface';
import { PriorityEnum } from '../enums/priority.enum';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {

  tasks: Task[] = [];
  priorities = [
    { value: PriorityEnum.LOW, label: 'Baixa' },
    { value: PriorityEnum.MEDIUM, label: 'Média' },
    { value: PriorityEnum.HIGH, label: 'Alta' }
  ];

  newTask = '';
  priority = PriorityEnum.LOW

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.todoService.getTasks()?.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  addTask() {
    if (this.newTask.trim()) {

      this.todoService.addTask(this.newTask, this.priority).subscribe((res) => {
        console.log('Task added', res);
        this.tasks.push({
          id: res.lastID,
          title: this.newTask,
          done: false,
          priority: this.priority
        } as Task);
        this.newTask = '';
      })

    }
  }

  toggleDone(task: Task) {
    this.todoService.toggleTask(task.id!, task.done).subscribe((res) => {
      console.log('Task marked as done');
    });
  }

  removeTask(index: number) {
    const task = this.tasks[index];
    this.todoService.deleteTask(task.id!).subscribe((res) => {
      console.log('Task deleted');
      this.tasks.splice(index, 1);
    });
  }

  logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  updatePriority(event: any) {
    console.log(event.target.value);
    this.priority = event.target.value;
  }

  canFinish(): boolean {
    return this.tasks.some(task => task.done);
  }

  finish() {
    this.todoService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

}
