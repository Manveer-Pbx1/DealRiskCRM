// Allowed users for lead filtering
export interface AllowedUser {
  id: string;
  name: string;
}

export const ALLOWED_USERS: AllowedUser[] = [
  {
    id: "user_V11eY908u8LYaB6vxZpJ4mW7Q3SgkAo0n90B5E1oumY",
    name: "Alwyn Monteiro"
  },
  {
    id: "Chad Elizonzo",
    name: "Chad Elizonzo"
  },
  {
    id: "user_n20R43onNqBm4OqckkgEHxZl8qhzd4ga91Z3UKoLGVp",
    name: "Christophe Caso"
  },
  {
    id: "Dean V",
    name: "Dean V"
  },
  {
    id: "user_WHIcZuC8IIkWM17Rfm5UewP89QBSFzvhxDLIbm4EuNk",
    name: "George Briere"
  },
  {
    id: "user_DUYSknnGBgl1vK9uG33rgNQ7KNjMENPUr1BzLxHZojK",
    name: "Grant McDonell"
  },
  {
    id: "user_iEJapfOmigwdjC7ve4CXzCJfMB5Ty0Fb5kPMRrDi45m",
    name: "Greg Geremesz"
  },
  {
    id: "user_I9czbYwASjy3HaM8jzZVbECo6CQlQu2FStr0iyH68qP",
    name: "Hamdan Asim"
  },
  {
    id: "user_UjPIR4waZq2Tokr6JI0Dvtb8d6lM8lucaQfX6lHYkkR",
    name: "Hannah Leworthy"
  },
  {
    id: "user_q45j6v5g74LOdiYOS9li0OQJbRxIucq3MfrcELQVCxx",
    name: "Sabrina Gramley"
  },
  {
    id: "user_1SqN4iIf9brmrtMIxXRFgVQ26hnVzyatJSPKhzV91xN",
    name: "Shaun Silverman"
  }
];

export const ALLOWED_USER_IDS = ALLOWED_USERS.map(user => user.id);
export const ALLOWED_USER_NAMES = ALLOWED_USERS.map(user => user.name);

// Function to get user display name by ID
export const getUserDisplayName = (userId: string, userName?: string): string => {
  // First try to find by exact user_id match
  const userById = ALLOWED_USERS.find(user => user.id === userId);
  if (userById) {
    return userById.name;
  }
  
  // Then try to find by user_name match (for cases like "Chad Elizonzo", "Dean V")
  if (userName) {
    const userByName = ALLOWED_USERS.find(user => user.id === userName || user.name === userName);
    if (userByName) {
      return userByName.name;
    }
  }
  
  // If not found, return the original name or a fallback
  return userName || userId || 'Unknown User';
};

// Function to check if a user is allowed
export const isUserAllowed = (userId: string, userName?: string): boolean => {
  // Check by user_id
  if (ALLOWED_USER_IDS.includes(userId)) {
    return true;
  }
  
  // Check by user_name (for cases like "Chad Elizonzo", "Dean V")
  if (userName && (ALLOWED_USER_IDS.includes(userName) || ALLOWED_USER_NAMES.includes(userName))) {
    return true;
  }
  
  return false;
};