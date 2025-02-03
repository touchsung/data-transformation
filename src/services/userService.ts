import axios from 'axios';
import { User } from '../types/user';
import { Cache } from '../utils/cache';

const cache = new Cache<User[]>(5 * 60 * 1000); // 5 minutes cache
const API_URL = 'https://dummyjson.com/users';

export const UserService = {
  getUsers: async (): Promise<User[]> => {
    const cachedData = cache.get('users');
    if (cachedData) return cachedData;

    const response = await axios.get(API_URL);
    const users: User[] = response.data.users;
    cache.set('users', users);
    return users;
  }
}; 