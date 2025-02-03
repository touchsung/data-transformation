import { User, GroupedData } from '../types/user';

export const UserTransformer = {
  transform: (users: User[]): GroupedData => 
    users.reduce((acc: GroupedData, user: User) => ({
      ...acc,
      [user.company.department]: {
        ...getInitialDepartmentState(acc, user.company.department),
        ...updateGenderCount(acc[user.company.department], user.gender),
        hair: updateHairCount(acc[user.company.department]?.hair || {}, user.hair.color),
        addressUser: {
          ...(acc[user.company.department]?.addressUser || {}),
          [`${user.firstName}${user.lastName}`]: user.address.postalCode
        }
      }
    }), {}),

  updateAgeRanges: (groupedData: GroupedData, users: User[]): GroupedData => 
    Object.entries(groupedData).reduce((acc, [department, data]) => ({
      ...acc,
      [department]: {
        ...data,
        ageRange: calculateAgeRange(
          users.filter(user => user.company.department === department)
        )
      }
    }), {})
};

const getInitialDepartmentState = (acc: GroupedData, department: string) => ({
  ...(acc[department] || {
    male: 0,
    female: 0,
    ageRange: '',
    hair: {},
    addressUser: {},
  })
});

const updateGenderCount = (
  departmentData: GroupedData[string] | undefined, 
  gender: string
) => ({
  male: (departmentData?.male || 0) + (gender === 'male' ? 1 : 0),
  female: (departmentData?.female || 0) + (gender === 'female' ? 1 : 0)
});

const updateHairCount = (
  currentHair: Record<string, number>, 
  hairColor: string
) => ({
  ...currentHair,
  [hairColor]: (currentHair[hairColor] || 0) + 1
});

const calculateAgeRange = (users: User[]): string => {
  if (users.length === 0) return '';
  const ages = users.map(user => user.age);
  return `${Math.min(...ages)}-${Math.max(...ages)}`;
}; 