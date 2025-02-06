import { User, GroupedData, DepartmentSummary } from '../types/user';

const UserTransformer = {
  transform: (users: User[]): GroupedData => {
    const departments = [...new Set(users.map(user => user.company.department))];
    return departments.reduce((acc: GroupedData, department: string) => {
      const departmentUsers = filterByDepartment(users, department);      
      return {
        ...acc,
        [department]: {
          male: countGender(departmentUsers).male || 0,
          female: countGender(departmentUsers).female || 0,
          ageRange: calculateAgeRange(departmentUsers).ageRange || '',
          hair: processHair(departmentUsers).hair || {},
          addressUser: processAddressUser(departmentUsers).addressUser || {}
        }
      };
    }, {});
  }
};

const filterByDepartment = (users: User[], department: string): User[] => users.filter(u => u.company.department === department);

const countGender = (users: User[]): Partial<DepartmentSummary> => ({
  male: users.filter(u => u.gender === 'male').length,
  female: users.filter(u => u.gender === 'female').length,
});

const calculateAgeRange = (
  users: User[]
): Partial<DepartmentSummary> => ({
  ageRange: users.length ? `${Math.min(...users.map(u => u.age))}-${Math.max(...users.map(u => u.age))}` : ''
});

const processHair = (
  users: User[]
): Partial<DepartmentSummary> => ({
  hair: users.reduce((acc: Record<string, number>, user) => ({
    ...acc,
    [user.hair.color]: (acc[user.hair.color] || 0) + 1
  }), {})
});

const processAddressUser = (
  users: User[]
): Partial<DepartmentSummary> => ({
  addressUser: users.reduce((acc: Record<string, string>, user) => ({
    ...acc,
    [`${user.firstName}${user.lastName}`]: user.address.postalCode
  }), {})
}); 

export { UserTransformer, filterByDepartment, countGender, calculateAgeRange, processHair, processAddressUser };