import { describe, it, expect } from 'vitest';
import { UserTransformer, countGender, calculateAgeRange, processHair, processAddressUser, filterByDepartment } from '../userTransformer';
import { User } from '../../types/user';

describe('UserTransformer', () => {
  const mockUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      gender: 'male',
      email: 'john.doe@example.com',
      phone: '555-0123',
      username: 'johndoe',
      password: 'password123',
      birthDate: '1994-03-15',
      image: 'https://example.com/john.jpg',
      bloodGroup: 'O+',
      height: 180,
      weight: 80,
      eyeColor: 'blue',
      hair: { 
        color: 'brown',
        type: 'straight'
      },
      domain: 'example.com',
      ip: '192.168.1.1',
      address: {
        address: '123 Main St',
        city: 'Boston',
        coordinates: {
          lat: 42.3601,
          lng: -71.0589
        },
        postalCode: '12345',
        state: 'MA'
      },
      university: 'MIT',
      bank: {
        cardExpire: '06/2025',
        cardNumber: '4532********1234',
        cardType: 'visa',
        currency: 'USD',
        iban: 'US45***********1234'
      },
      company: {
        address: {
          address: '456 Corp Ave',
          city: 'Boston',
          coordinates: {
            lat: 42.3601,
            lng: -71.0589
          },
          postalCode: '12345',
          state: 'MA'
        },
        department: 'Engineering',
        name: 'Tech Corp',
        title: 'Senior Developer'
      }
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      age: 25,
      gender: 'female',
      email: 'jane.smith@example.com',
      phone: '555-0124',
      username: 'janesmith',
      password: 'password456',
      birthDate: '1999-06-20',
      image: 'https://example.com/jane.jpg',
      bloodGroup: 'A+',
      height: 165,
      weight: 60,
      eyeColor: 'green',
      hair: {
        color: 'blonde',
        type: 'wavy'
      },
      domain: 'example.com',
      ip: '192.168.1.2',
      address: {
        address: '789 Oak St',
        city: 'Boston',
        coordinates: {
          lat: 42.3601,
          lng: -71.0589
        },
        postalCode: '67890',
        state: 'MA'
      },
      university: 'Harvard',
      bank: {
        cardExpire: '08/2026',
        cardNumber: '5678********5678',
        cardType: 'mastercard',
        currency: 'USD',
        iban: 'US45***********5678'
      },
      company: {
        address: {
          address: '456 Corp Ave',
          city: 'Boston',
          coordinates: {
            lat: 42.3601,
            lng: -71.0589
          },
          postalCode: '12345',
          state: 'MA'
        },
        department: 'Engineering',
        name: 'Tech Corp',
        title: 'Software Engineer'
      }
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Wilson',
      age: 45,
      gender: 'male',
      email: 'bob.wilson@example.com',
      phone: '555-0125',
      username: 'bobwilson',
      password: 'password789',
      birthDate: '1979-09-10',
      image: 'https://example.com/bob.jpg',
      bloodGroup: 'B+',
      height: 175,
      weight: 85,
      eyeColor: 'brown',
      hair: {
        color: 'brown',
        type: 'curly'
      },
      domain: 'example.com',
      ip: '192.168.1.3',
      address: {
        address: '321 Pine St',
        city: 'Boston',
        coordinates: {
          lat: 42.3601,
          lng: -71.0589
        },
        postalCode: '11111',
        state: 'MA'
      },
      university: 'Boston University',
      bank: {
        cardExpire: '10/2024',
        cardNumber: '9012********9012',
        cardType: 'amex',
        currency: 'USD',
        iban: 'US45***********9012'
      },
      company: {
        address: {
          address: '789 Sales Ave',
          city: 'Boston',
          coordinates: {
            lat: 42.3601,
            lng: -71.0589
          },
          postalCode: '11111',
          state: 'MA'
        },
        department: 'Sales',
        name: 'Tech Corp',
        title: 'Sales Manager'
      }
    }
  ];

  describe('transform', () => {
    it('should correctly group users by department', () => {
      const result = UserTransformer.transform(mockUsers);
      
      expect(result).toEqual({
        Engineering: {
          male: 1,
          female: 1,
          ageRange: '25-30',
          hair: {
            brown: 1,
            blonde: 1
          },
          addressUser: {
            JohnDoe: '12345',
            JaneSmith: '67890'
          }
        },
        Sales: {
          male: 1,
          female: 0,
          ageRange: '45-45',
          hair: {
            brown: 1
          },
          addressUser: {
            BobWilson: '11111'
          }
        }
      });
    });

    it('should handle empty user array', () => {
      const result = UserTransformer.transform([]);
      expect(result).toEqual({});
    });
  });

  describe('helper functions', () => {

    describe('filterByDepartment', () => {
      it('should correctly filter users by department', () => {
        const result = filterByDepartment(mockUsers, 'Engineering');
        expect(result).toEqual(mockUsers.filter(u => u.company.department === 'Engineering'));
      });
    }); 

    describe('countGender', () => {
      it('should correctly count gender distribution', () => {
        const result = countGender(mockUsers.filter(u => u.company.department === 'Engineering'));
        expect(result).toEqual({
          male: 1,
          female: 1
        });
      });

      it('should handle empty users array', () => {
        const result = countGender([]);
        expect(result).toEqual({
          male: 0,
          female: 0
        });
      });
    });

    describe('calculateAgeRange', () => {
      it('should calculate correct age range for multiple users', () => {
        const result = calculateAgeRange(mockUsers.filter(u => u.company.department === 'Engineering'));
        expect(result.ageRange).toBe('25-30');
      });

      it('should handle single user', () => {
        const result = calculateAgeRange([mockUsers[0]]);
        expect(result.ageRange).toBe('30-30');
      });

      it('should handle empty users array', () => {
        const result = calculateAgeRange([]);
        expect(result.ageRange).toBe('');
      });
    });

    describe('processHair', () => {
      it('should correctly count hair colors', () => {
        const result = processHair(mockUsers.filter(u => u.company.department === 'Engineering'));
        expect(result.hair).toEqual({
          brown: 1,
          blonde: 1
        });
      });

      it('should handle empty users array', () => {
        const result = processHair([]);
        expect(result.hair).toEqual({});
      });
    });

    describe('processAddressUser', () => {
      it('should correctly map users to postal codes', () => {
        const result = processAddressUser(mockUsers.filter(u => u.company.department === 'Engineering'));
        expect(result.addressUser).toEqual({
          JohnDoe: '12345',
          JaneSmith: '67890'
        });
      });

      it('should handle empty users array', () => {
        const result = processAddressUser([]);
        expect(result.addressUser).toEqual({});
      });
    });
  });

}); 