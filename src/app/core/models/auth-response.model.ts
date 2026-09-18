import { User } from './user.model';

export interface AuthResponse {
  user: User;
  authorization: {
    token: string;
    type: string;
  };
}
