import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderManagementService {
  constructor() {}

  getUserSession(): { userName: string | null; userId: string | null } {
    const sessionUserString = sessionStorage.getItem('session_user');
    console.log('sessionUserString:', sessionUserString);

    if (!sessionUserString) {
      console.log('Nenhum usuário encontrado na sessão');
      return { userName: null, userId: null };
    }

    const userData = JSON.parse(sessionUserString);
    const userName = userData.name || null;
    const userId = userData.id || null;

    return { userName, userId };
  }
}
