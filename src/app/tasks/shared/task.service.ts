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

  /** POST: add a new task to Firestore */
  addTask(): string {
    const timestamp = firestore.FieldValue.serverTimestamp();
    const task: Task = { description: '', created: timestamp };
    const id = this.db.createId();
    this.tasksCollection.doc<Task>(id).set(task);
    return id;
  }

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

  /** DELETE: delete the task from Firestore */
  deleteTask({ id }: TaskId): void {
    this.tasksCollection.doc<Task>(id).delete();
  }
}
