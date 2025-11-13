// Server-side constants for user filtering
export const ALLOWED_USER_IDS = [
  "user_V11eY908u8LYaB6vxZpJ4mW7Q3SgkAo0n90B5E1oumY",
  "Chad Elizonzo", // Username
  "user_n20R43onNqBm4OqckkgEHxZl8qhzd4ga91Z3UKoLGVp",
  "Dean V", // Username
  "user_WHIcZuC8IIkWM17Rfm5UewP89QBSFzvhxDLIbm4EuNk",
  "user_DUYSknnGBgl1vK9uG33rgNQ7KNjMENPUr1BzLxHZojK",
  "user_iEJapfOmigwdjC7ve4CXzCJfMB5Ty0Fb5kPMRrDi45m",
  "user_I9czbYwASjy3HaM8jzZVbECo6CQlQu2FStr0iyH68qP",
  "user_UjPIR4waZq2Tokr6JI0Dvtb8d6lM8lucaQfX6lHYkkR",
  "user_q45j6v5g74LOdiYOS9li0OQJbRxIucq3MfrcELQVCxx",
  "user_1SqN4iIf9brmrtMIxXRFgVQ26hnVzyatJSPKhzV91xN"
];

export const isUserAllowed = (userId, userName) => {
  // Check by user_id
  if (ALLOWED_USER_IDS.includes(userId)) {
    return true;
  }
  
  // Check by user_name (for cases like "Chad Elizonzo", "Dean V")
  if (userName && ALLOWED_USER_IDS.includes(userName)) {
    return true;
  }
  
  return false;
};

export const filterOpportunitiesByUser = (data) => {
  if (!data || !data.data) return data;

  const filteredData = {
    ...data,
    data: data.data.map(lead => ({
      ...lead,
      opportunities: (lead.opportunities || []).filter(opp => 
        isUserAllowed(opp.user_id, opp.user_name)
      )
    })).filter(lead => lead.opportunities && lead.opportunities.length > 0) // Only keep leads that have allowed opportunities
  };

  return filteredData;
};