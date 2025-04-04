import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from '../../models/list';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { Observable } from 'rxjs';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, TaskFormComponent, MatCardModule, MatButtonModule, MatIconModule, DragDropModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @Input() list!: List;
  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();

  tasks$!: Observable<Task[]>;
  showAddTask = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasksByListId(this.list.id);
  }

  onDrop(event: CdkDragDrop<Task[], any>): void {
    this.taskDropped.emit(event as CdkDragDrop<Task[]>);
  }

  toggleAddTask(): void {
    this.showAddTask = !this.showAddTask;
  }

  handleAddTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    this.taskService.addTask(task);
    this.showAddTask = false;
  }
}
