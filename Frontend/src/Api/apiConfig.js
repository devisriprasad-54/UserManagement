// Determine API base URL based on environment
const API_BASE_URL = import.meta.env.MODE === 'production'
  ? '/user-api' // In production, use relative path (same domain)
  : 'http://localhost:4000/user-api'

export const API_ENDPOINTS = {
  getAllUsers: `${API_BASE_URL}/users`,
  getUserById: (id) => `${API_BASE_URL}/users/${id}`,
  createUser: `${API_BASE_URL}/users`,
  updateUser: (id) => `${API_BASE_URL}/users/${id}`,
  deleteUser: (id) => `${API_BASE_URL}/users/${id}`,
  activateUser: (id) => `${API_BASE_URL}/users/${id}`,
  getAllUsersIncludeDeleted: `${API_BASE_URL}/all-users`
}

// Fetch helper function with error handling
export const fetchAPI = async (url, options = {}) => {
  try {
    console.log('Fetching from:', url)
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    })
    
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', data)
    
    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
