import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Task, TaskId } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksCollection: AngularFirestoreCollection<Task>;

  constructor(private readonly db: AngularFirestore) {
    this.tasksCollection = this.db.collection<Task>('tasks');
  }

  //////// Tasks methods ////////

    /** GET: tasks from Firestore */
    getTasks(): Observable<TaskId[]> {
      return this.db.collection<Task>('tasks', ref => 
        ref.orderBy('modified', 'desc').limit(30)
      )
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    }

  /** POST: add a new task to Firestore */
  addTask(description: string): void {
    const timestamp = firestore.FieldValue.serverTimestamp();
    this.tasksCollection.add({
      description,
      created: timestamp,
      modified: timestamp
    })
  }
}
