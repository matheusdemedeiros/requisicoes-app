import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable, ObservedValueOf } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public usuarioLogado: Observable<firebase.User | null>;

  constructor(private auth: AngularFireAuth) {
    this.usuarioLogado = auth.authState;
  }

  public login(
    email: string,
    senha: string
  ): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, senha);
  }

  public logout(): Promise<void> {
    return this.auth.signOut();
  }

  public resetarsenha(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email);
  }

  public cadastrar(
    email: string,
    senha: string
  ): Promise<firebase.auth.UserCredential> {
    return this.auth.createUserWithEmailAndPassword(email, senha);
  }

  public getUsuario():Promise<firebase.User | null>{
    return this.auth.currentUser;
  }

  public atualizarUsuario(usuario:firebase.User | null){
    return this.auth.updateCurrentUser(usuario);
  }

}
