import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { TaskService } from '../../../core/services/task.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Catégories</h1>
        <button 
          [routerLink]="['/categories/new']"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Nouvelle catégorie
        </button>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        @for (category of categoriesWithCount$ | async; track category.id) {
          <div class="p-4 border rounded-lg shadow hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-lg">{{ category.name }}</h3>
                <p class="text-gray-600">{{ category.taskCount }} tâches</p>
              </div>
              <div class="flex gap-2">
                <button 
                  [routerLink]="['/categories', category.id, 'edit']"
                  class="text-blue-500 hover:text-blue-700">
                  Modifier
                </button>
                <button 
                  (click)="deleteCategory(category.id)"
                  class="text-red-500 hover:text-red-700">
                  Supprimer
                </button>
              </div>
            </div>
            @if (category.color) {
              <div 
                class="mt-2 w-6 h-6 rounded-full"
                [style.backgroundColor]="category.color">
              </div>
            }
          </div>
        } @empty {
          <div class="text-center py-8 text-gray-500 col-span-full">
            Aucune catégorie trouvée
          </div>
        }
      </div>
    </div>
  `
})
export class CategoryListComponent {
  categoriesWithCount$ = this.categoryService.getCategories().pipe(
    switchMap(categories => {
      const tasks$ = this.taskService.getTasks();
      return tasks$.pipe(
        map(tasks => {
          return categories.map(category => ({
            ...category,
            taskCount: tasks.filter(task => task.categoryId === category.id).length
          }));
        })
      );
    })
  );

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService
  ) {}

  deleteCategory(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id);
    }
  }
}
