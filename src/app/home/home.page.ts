import { Component, OnInit } from '@angular/core';
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

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
  }
}
