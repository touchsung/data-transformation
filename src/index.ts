import { UserService } from './services/userService';
import { UserTransformer } from './transformers/userTransformer';

const processUsers = async () => {
  const users = await UserService.getUsers();
  return UserTransformer.updateAgeRanges(UserTransformer.transform(users), users);
};

const main = async () => {
  try {
    const result = await processUsers();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

main(); 