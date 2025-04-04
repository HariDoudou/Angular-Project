import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { List } from '../../models/list';
import { Task } from '../../models/task';
import { Observable } from 'rxjs';
import { TaskListComponent } from '../task-list/task-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskListComponent, MatButtonModule, MatIconModule, DragDropModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  lists$: Observable<List[]>;

  constructor(private taskService: TaskService) {
    this.lists$ = this.taskService.getLists();
  }

  ngOnInit(): void {
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, targetListId: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      event.container.data.forEach((task, index) => {
        this.taskService.updateTask({...task, order: index});
      });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTask = event.container.data[event.currentIndex];
      this.taskService.updateTask({
        ...movedTask,
        listId: targetListId,
        order: event.currentIndex
      });

      event.previousContainer.data.forEach((task, index) => {
        this.taskService.updateTask({...task, order: index});
      });

      event.container.data.forEach((task, index) => {
        if (index !== event.currentIndex) {
          this.taskService.updateTask({...task, order: index});
        }
      });
    }
  }
}
