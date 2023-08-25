import {Injectable} from '@angular/core';
import {Auth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import {Observable} from 'rxjs';
import {User} from 'firebase/auth';
import {initializeApp} from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth: Auth;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyDd9aMY2RjlJgCnMOTgYmt439zWZqwqLQ0",
      authDomain: "genospace.firebaseapp.com",
      projectId: "genospace",
      storageBucket: "genospace.appspot.com",
      messagingSenderId: "413952996644",
      appId: "1:413952996644:web:3873e2197ae6d9d3912fb1",
      measurementId: "G-W1YQ8PQ6WR"
    };

    initializeApp(firebaseConfig);
    this.auth = getAuth();
  }

  signInWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  getUser(): Observable<User | null> {
    return new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
    });
  }
}
