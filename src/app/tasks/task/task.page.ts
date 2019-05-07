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
  task: TaskId;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private navController: NavController
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.taskService.getTask(params.get('id')))
    ).subscribe(task => {
      // Check if task exists otherwise redirect to home
      if (task.created) this.task = task;
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
    description = description.trim();
    if (task.description !== description) {
      this.taskService.updateTask({ id: task.id, description });
    }
  }
  
  deleteTask(task: TaskId): void {
    this.subscription.unsubscribe();
    this.taskService.deleteTask(task);
    this.goBack();
  }
}
