export interface UserProfile {
  userId: string;          // e.g. "@alex_fit"
  identifier: string;      // Email or Phone Number
  password: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  weight: number;          // kg
  height: number;          // cm
  bmi: number;
  bmiCategory: string;
  primaryGoal: 'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Endurance';
  dietaryPreference: 'Standard' | 'High-Protein' | 'Vegetarian' | 'Vegan' | 'Keto';
  createdAt: string;
}

const STORAGE_USERS_KEY = 'fitnut_registered_users_v1';
const STORAGE_CURRENT_USER_KEY = 'fitnut_active_user_v1';

// Default demo user
const DEMO_USER: UserProfile = {
  userId: '@alex_fit',
  identifier: 'demo@fitnut.ai',
  password: 'demo123',
  name: 'Alex Johnson',
  gender: 'Female',
  age: 26,
  weight: 64,
  height: 168,
  bmi: 22.7,
  bmiCategory: 'Normal Weight',
  primaryGoal: 'Weight Loss',
  dietaryPreference: 'High-Protein',
  createdAt: new Date().toISOString(),
};

// In-memory fallback
let memoryUsers: UserProfile[] = [DEMO_USER];
let memoryCurrentUser: UserProfile | null = DEMO_USER;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string } {
  if (heightCm <= 0 || weightKg <= 0) return { bmi: 22.0, category: 'Normal Weight' };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  let category = 'Normal Weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal Weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi, category };
}

export function getAllUsers(): UserProfile[] {
  if (isBrowser()) {
    try {
      const data = window.localStorage.getItem(STORAGE_USERS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
  }
  return memoryUsers;
}

function saveUsers(users: UserProfile[]): void {
  memoryUsers = users;
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  }
}

export function getCurrentUser(): UserProfile {
  if (isBrowser()) {
    try {
      const data = window.localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
  }
  return memoryCurrentUser || DEMO_USER;
}

export function setCurrentUser(user: UserProfile | null): void {
  memoryCurrentUser = user;
  if (isBrowser()) {
    try {
      if (user) {
        window.localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
      }
    } catch {
      // ignore
    }
  }
}

export function registerUser(userData: Omit<UserProfile, 'bmi' | 'bmiCategory' | 'createdAt'>): { success: boolean; error?: string; user?: UserProfile } {
  const users = getAllUsers();
  
  const cleanId = userData.userId.startsWith('@') ? userData.userId.trim() : `@${userData.userId.trim()}`;
  const cleanIdentifier = userData.identifier.trim().toLowerCase();

  // Check if identifier or userId exists
  const exists = users.some(u => 
    u.identifier.toLowerCase() === cleanIdentifier || 
    u.userId.toLowerCase() === cleanId.toLowerCase()
  );

  if (exists) {
    return { success: false, error: 'A user with this Email/Phone or User ID already exists.' };
  }

  const { bmi, category } = calculateBMI(userData.weight, userData.height);

  const newUser: UserProfile = {
    ...userData,
    userId: cleanId,
    identifier: cleanIdentifier,
    bmi,
    bmiCategory: category,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

export function loginUser(identifier: string, password: string): { success: boolean; error?: string; user?: UserProfile } {
  const cleanIdentifier = identifier.trim().toLowerCase();
  const users = getAllUsers();

  // Also support phone numbers without format differences
  const user = users.find(u => 
    (u.identifier.toLowerCase() === cleanIdentifier || u.userId.toLowerCase() === cleanIdentifier) &&
    u.password === password
  );

  if (user) {
    setCurrentUser(user);
    return { success: true, user };
  }

  // Check demo user match
  if (
    (cleanIdentifier === 'demo@fitnut.ai' || cleanIdentifier === '@alex_fit' || cleanIdentifier === '01700000000') &&
    password === 'demo123'
  ) {
    setCurrentUser(DEMO_USER);
    return { success: true, user: DEMO_USER };
  }

  return { success: false, error: 'Invalid Email/Phone or password. Please try again.' };
}

export function logoutUser(): void {
  setCurrentUser(null);
}
