import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { TaskService } from '../tasks/shared/task.service';
import { TaskId } from '../tasks/shared/task';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  tasks: Observable<TaskId[]>;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
  }

  addTask(): void {
    const id = this.taskService.addTask();
    this.router.navigateByUrl(`/task/${id}`)
  }
}
