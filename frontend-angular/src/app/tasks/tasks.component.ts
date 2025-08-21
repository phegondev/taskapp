import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // Array to store all tasks
  tasks: any[] = [];
  
  // Array to store filtered tasks for display
  filteredTasks: any[] = [];
  
  // Variable to store error messages
  error: string = '';
  
  // Current priority filter setting
  priorityFilter: string = 'ALL';
  
  // Current completion status filter setting
  completionFilter: string = 'ALL';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Redirect to login if user is not authenticated
    if (!this.apiService.isAthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Fetch tasks when component initializes
    this.fetchTasks();
  }

  /**
   * Fetches all tasks for the current user
   */
  fetchTasks(): void {
    this.apiService.getAllMyTasks().subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          // Store tasks and initialize filtered list
          this.tasks = res.data;
          this.filteredTasks = res.data;
        } else {
          this.error = res.message || 'Failed to fetch tasks';
        }
      },
      error: (error) => {
        this.error = error.error?.message || error.message || 'Error fetching tasks';
      }
    });
  }

  /**
   * Applies the current filters to the task list
   */
  applyFilters(): void {
    // Start with all tasks
    let result = [...this.tasks];

    // First filter by completion status if not 'ALL'
    if (this.completionFilter !== 'ALL') {
      this.apiService.getMyTasksByCompletionStatus(
        this.completionFilter === 'COMPLETED'
      ).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            result = res.data;
            
            // Then filter by priority if not 'ALL'
            if (this.priorityFilter !== 'ALL') {
              this.applyPriorityFilter(result);
            } else {
              this.filteredTasks = result;
            }
          }
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error applying completion filter';
        }
      });
    } else if (this.priorityFilter !== 'ALL') {
      // Only filter by priority if completion filter is 'ALL'
      this.applyPriorityFilter(result);
    } else {
      // No filters applied - show all tasks
      this.filteredTasks = result;
    }
  }

  /**
   * Helper method to apply priority filter
   * @param currentResult The current filtered task list
   */
  private applyPriorityFilter(currentResult: any[]): void {
    this.apiService.getMyTasksByPriority(this.priorityFilter).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          if (this.completionFilter !== 'ALL') {
            // Combine both filters by finding intersection
            const priorityTasks = res.data;
            currentResult = currentResult.filter(task => 
              priorityTasks.some((pt: any) => pt.id === task.id)
            );
          } else {
            currentResult = res.data;
          }
          this.filteredTasks = currentResult;
        }
      },
      error: (error) => {
        this.error = error.error?.message || error.message || 'Error applying priority filter';
      }
    });
  }

  /**
   * Toggles the completion status of a task
   * @param task The task to update
   */
  toggleComplete(task: any): void {
    this.apiService.updateTask({
      id: task.id,
      completed: !task.completed
    }).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          // Update local task list and reapply filters
          this.tasks = this.tasks.map(t =>
            t.id === task.id ? { ...t, completed: !t.completed } : t
          );
          this.applyFilters();
        }
      },
      error: (error) => {
        this.error = error.error?.message || error.message || 'Error updating task';
      }
    });
  }

  /**
   * Resets all filters to their default values
   */
  resetFilters(): void {
    this.priorityFilter = 'ALL';
    this.completionFilter = 'ALL';
    this.applyFilters();
  }
}