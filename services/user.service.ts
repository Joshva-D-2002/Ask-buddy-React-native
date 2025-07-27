import axios from 'axios';

interface User {
  username: string;
  email: string;
  phone: string;
  password: string;
}

const API_KEY = '$2a$10$hTFN2zlRALcaURYXwaBLW.3KRWgSiUMo9OcV/ZQ4TjlBumnKU.rYq';
const BIN_ID = '686b9a3d8a456b7966bcbf6e';
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY,
};

export const fetchUsers = async () => {
  try {
    const res = await axios.get(`${BIN_URL}/latest`, { headers });
    return res.data.record.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const addUser = async (newUser: {
  username: string;
  email: string;
  phone: string;
  password: string;
}) => {
  try {
    // Get current data structure
    const currentData = await axios.get(`${BIN_URL}/latest`, { headers });
    const existingData = currentData.data.record || {};
    const users = existingData.users || [];

    const existing = users.find(
      (user: User) => user.email === newUser.email || user.phone === newUser.phone
    );

    if (existing) {
      throw new Error('User already exists with this email or phone.');
    }

    const updatedUsers = [...users, newUser];
    
    // Preserve existing chat histories while updating users
    const updatedData = {
      ...existingData,
      users: updatedUsers
    };

    await axios.put(BIN_URL, updatedData, { 
      headers: {
        ...headers,
        'X-Bin-Versioning': 'false'
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    const users = await fetchUsers();
    return (
      users.find(
        (user: User) => user.email === email && user.password === password
      ) || null
    );
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
};