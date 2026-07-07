import { Injectable } from '@angular/core';
import { User } from '../../../Models/User';
import { RegisterUserRequest } from '../../auth/models/auth';

@Injectable({
  providedIn: 'root',
})
export class UserHelper {

   toRegisterRequest(user: User): RegisterUserRequest {
    return {
      name: user.name,
      email: user.email,
      role_id: user.role_id,
      github_username: user.github_username,
      requires_github_access: user.requires_github_access,
      status: user.is_active, // boolean, not string
      projects: [], 
    };
  }
  
  static getUserInitials(user: User): string {
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

}
