import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';

import { TaskService } from '../shared/task.service';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TaskId } from '../shared/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit, OnDestroy {

  private subscription: Subscription;
  private delete: boolean;
  task: TaskId;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private navController: NavController
  ) { }

  ngOnInit(): void {
    this.delete = false;
    this.subscription = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.taskService.getTask(params.get('id')))
    ).subscribe(task => {
      // Check if task exists otherwise redirect to home
      if (task.created !== undefined) this.task = task;
      else this.goBack();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goBack(): void {
    this.navController.navigateBack('home');
  }
  
  updateTask(task: TaskId, description: string): void {
    // Prevent update task onBlur when the Delete button is clicked
    setTimeout(() => {
      if (this.delete) { return; }
      description = description.trim();
      if (task.description !== description) {
        this.taskService.updateTask({ id: task.id, description });
      }
    }, 100);
  }
  
  deleteTask(task: TaskId): void {
    this.delete = true;
    this.subscription.unsubscribe();
    this.taskService.deleteTask(task);
    this.goBack();
  }
}
