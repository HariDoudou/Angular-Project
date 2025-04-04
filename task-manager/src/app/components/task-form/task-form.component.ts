import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  @Input() listId!: string;
  @Output() taskSubmitted = new EventEmitter<Omit<Task, 'id' | 'createdAt'>>();
  @Output() cancelled = new EventEmitter<void>();

  taskForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      // Créer un nouvel objet de tâche conforme au type attendu
      const newTask: Omit<Task, 'id' | 'createdAt'> = {
        title: formValue.title,
        description: formValue.description,
        listId: this.listId,
        order: 0 // La tâche sera ajoutée en haut de la liste
      };
      this.taskSubmitted.emit(newTask);
      this.taskForm.reset();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.taskForm.reset();
  }
}
