import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task';
import { List } from '../models/list';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Initial data
  private initialLists: List[] = [
    { id: 'list-1', title: 'À faire', order: 0 },
    { id: 'list-2', title: 'En cours', order: 1 },
    { id: 'list-3', title: 'Terminé', order: 2 }
  ];

  private initialTasks: Task[] = [
    { id: '1', title: 'Faire les courses', description: 'Acheter du lait et du pain', listId: 'list-1', order: 0, createdAt: Date.now() },
    { id: '2', title: 'Réviser Angular', description: 'Étudier les concepts RxJS', listId: 'list-1', order: 1, createdAt: Date.now() },
    { id: '3', title: 'Répondre aux emails', description: 'Répondre aux emails professionnels', listId: 'list-2', order: 0, createdAt: Date.now() }
  ];

  private listsSubject = new BehaviorSubject<List[]>(this.initialLists);
  private tasksSubject = new BehaviorSubject<Task[]>(this.initialTasks);

  lists$ = this.listsSubject.asObservable();
  tasks$ = this.tasksSubject.asObservable();

  constructor() { }

  // CRUD operations for tasks
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTasksByListId(listId: string): Observable<Task[]> {
    return new Observable(observer => {
      this.tasks$.subscribe(tasks => {
        const filteredTasks = tasks.filter(task => task.listId === listId)
          .sort((a, b) => a.order - b.order);
        observer.next(filteredTasks);
      });
    });
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    const tasks = this.tasksSubject.value;
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    this.tasksSubject.next([...tasks, newTask]);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.value;
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[index] = {
        ...updatedTask,
        updatedAt: Date.now()
      };
      this.tasksSubject.next(updatedTasks);
    }
  }

  deleteTask(taskId: string): void {
    const tasks = this.tasksSubject.value;
    this.tasksSubject.next(tasks.filter(task => task.id !== taskId));
  }

  getLists(): Observable<List[]> {
    return this.lists$;
  }

  moveTask(taskId: string, targetListId: string, newOrder: number): void {
    const tasks = this.tasksSubject.value;
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
      const updatedTasks = [...tasks];
      const task = {...updatedTasks[taskIndex]};

      task.listId = targetListId;
      task.order = newOrder;
      task.updatedAt = Date.now();

      updatedTasks[taskIndex] = task;

      updatedTasks
        .filter(t => t.id !== taskId && t.listId === targetListId && t.order >= newOrder)
        .forEach(t => {
          t.order += 1;
          t.updatedAt = Date.now();
        });

      this.tasksSubject.next(updatedTasks);
    }
  }
}
