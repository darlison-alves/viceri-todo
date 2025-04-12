import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Task {
  title: string;
  done: boolean;
}

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  newTask = '';
  tasks: Task[] = [];

  addTask() {
    if (this.newTask.trim()) {
      this.tasks.push({ title: this.newTask.trim(), done: false });
      this.newTask = '';
    }
  }

  toggleDone(task: Task) {
    task.done = !task.done;
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
  }
}
