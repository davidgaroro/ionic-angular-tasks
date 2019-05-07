import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
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
      ref.orderBy('modified', 'desc').limit(50)
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
  addTask(): Promise<DocumentReference> {
    const timestamp = firestore.FieldValue.serverTimestamp();
    const task: Task = { description: '', created: timestamp };
    return this.tasksCollection.add(task);
  }

  /** GET: task by id from Firestore */
  getTask(id: string): Observable<TaskId> {
    return this.tasksCollection.doc<Task>(id).valueChanges().pipe(
      map(task => ({ id, ...task }))
    );
  }

  /** PUT: update the task on Firestore */
  updateTask({ id, description }): void {
    const timestamp = firestore.FieldValue.serverTimestamp();
    const task = { description, modified: timestamp };
    this.tasksCollection.doc<Task>(id).update(task);
  }
}
