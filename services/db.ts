
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc,
  Timestamp,
  Firestore
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { FocusSession, Tag, Todo, TimerPreset } from '../types';

// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "kairu-app.firebaseapp.com",
  projectId: "kairu-app",
  storageBucket: "kairu-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

/**
 * FirebaseDB Service
 * Handles all remote data persistence via Google Cloud Firestore.
 */
class FirebaseDB {
  
  // Helper to get collection reference scoped by user
  private getUserCollection(email: string, subPath: string) {
    return collection(db, 'users', email, subPath);
  }

  async getSessions(email: string): Promise<FocusSession[]> {
    try {
      const q = query(this.getUserCollection(email, 'sessions'), orderBy('startTime', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as FocusSession);
    } catch (e) {
      console.error("Firebase getSessions error:", e);
      return [];
    }
  }

  async saveSession(email: string, session: FocusSession): Promise<void> {
    const docRef = doc(this.getUserCollection(email, 'sessions'), session.id);
    await setDoc(docRef, session);
  }

  async getTags(email: string): Promise<Tag[]> {
    try {
      const querySnapshot = await getDocs(this.getUserCollection(email, 'tags'));
      return querySnapshot.docs.map(doc => doc.data() as Tag);
    } catch (e) {
      console.error("Firebase getTags error:", e);
      return [];
    }
  }

  async saveTags(email: string, tags: Tag[]): Promise<void> {
    // For simplicity, we overwrite the collection by saving individual tags
    // In a production app, we might use a single document for tags or a batch write
    for (const tag of tags) {
      const docRef = doc(this.getUserCollection(email, 'tags'), tag.id);
      await setDoc(docRef, tag);
    }
  }

  async deleteTag(email: string, tagId: string): Promise<void> {
    const docRef = doc(this.getUserCollection(email, 'tags'), tagId);
    await deleteDoc(docRef);
  }

  async getTodos(email: string): Promise<Todo[]> {
    try {
      const querySnapshot = await getDocs(this.getUserCollection(email, 'todos'));
      return querySnapshot.docs.map(doc => doc.data() as Todo);
    } catch (e) {
      return [];
    }
  }

  async saveTodos(email: string, todos: Todo[]): Promise<void> {
    // In Firestore, it's often better to save each todo as a doc
    for (const todo of todos) {
      const docRef = doc(this.getUserCollection(email, 'todos'), todo.id);
      await setDoc(docRef, todo);
    }
  }

  async getPresets(email: string): Promise<TimerPreset[]> {
    try {
      const querySnapshot = await getDocs(this.getUserCollection(email, 'presets'));
      return querySnapshot.docs.map(doc => doc.data() as TimerPreset);
    } catch (e) {
      return [];
    }
  }

  async savePresets(email: string, presets: TimerPreset[]): Promise<void> {
    for (const preset of presets) {
      const docRef = doc(this.getUserCollection(email, 'presets'), preset.id);
      await setDoc(docRef, preset);
    }
  }
}

export const cloudDB = new FirebaseDB();
