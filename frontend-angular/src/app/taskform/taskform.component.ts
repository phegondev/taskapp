import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-taskform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './taskform.component.html',
  styleUrls: ['./taskform.component.css']
})
export class TaskformComponent implements OnInit {
  // Form group to handle task data
  taskForm: FormGroup;
  
  // Variable to store error messages
  error: string = '';
  
  // Flag to determine if we're in edit mode
  isEdit: boolean = false;
  
  // Stores the task ID if in edit mode
  taskId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize the form with default values and validations
    this.taskForm = this.fb.group({
      title: ['', Validators.required],  // Title is required
      description: [''],
      dueDate: [''],
      priority: ['MEDIUM'],  // Default priority
      completed: [false]     // Default completion status
    });
  }

  ngOnInit(): void {
    // Get task ID from route parameters
    this.taskId = this.route.snapshot.paramMap.get('id');
    
    // Set edit mode flag based on whether we have an ID
    this.isEdit = !!this.taskId;

    // If in edit mode and ID exists, fetch the task details
    if (this.isEdit && this.taskId) {
      this.fetchTask(this.taskId);
    }
  }

  /**
   * Fetches task details by ID and populates the form
   * @param id The task ID to fetch
   */
  fetchTask(id: string): void {
    this.apiService.getTaskById(id).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          // Populate form with fetched task data
          this.taskForm.patchValue({
            title: res.data.title,
            description: res.data.description,
            dueDate: this.formatDateForInput(res.data.dueDate),
            priority: res.data.priority,
            completed: res.data.completed
          });
        } else {
          // Handle API response error
          this.error = res.message || 'Failed to fetch task';
        }
      },
      error: (error) => {
        // Handle HTTP or other errors
        this.error = error.error?.message || error.message || 'Error fetching task';
      }
    });
  }

  /**
   * Formats a date string for HTML date input
   * @param dateString The date string to format
   * @returns Formatted date string (YYYY-MM-DD) or empty string if invalid
   */
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  /**
   * Handles form submission for both create and update operations
   */
  onSubmit(): void {
    // Validate form
    if (this.taskForm.invalid) {
      this.error = 'Title is required';
      return;
    }

    // Prepare form data
    const formData = this.taskForm.value;
    
    // Clear previous errors
    this.error = '';

    if (this.isEdit && this.taskId) {
      // Edit mode - update existing task
      formData.id = this.taskId;
      this.apiService.updateTask(formData).subscribe({
        next: (res) => {
          // On successful update, navigate back to task list
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error updating task';
        }
      });
    } else {
      // Create mode - add new task
      this.apiService.createTask(formData).subscribe({
        next: (res) => {
          // On successful creation, navigate back to task list
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error creating task';
        }
      });
    }
  }

  /**
   * Handles task deletion with confirmation
   */
  onDelete(): void {
    if (!this.taskId) return;
    
    // Confirm deletion with user
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      this.apiService.deleteTask(this.taskId).subscribe({
        next: () => {
          // On successful deletion, navigate back to task list
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error deleting task';
        }
      });
    }
  }
}