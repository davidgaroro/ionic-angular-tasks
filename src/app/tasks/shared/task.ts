import { firestore } from 'firebase/app';

export interface Task {
  description: string;
  created: firestore.FieldValue;
  modified: firestore.FieldValue;
}

export interface TaskId extends Task {
  id: string;
}
