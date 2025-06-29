import {
  notifyError,
  notifySuccess,
} from '../components/util-components/Notify';
import { useAuth } from '../hooks/useAuth';

export function handleUnauthorized() {
  const { logout } = useAuth();
  logout();
}

export async function fetchWithBodyData(
  token: string | null,
  api: string,
  data: any,
  method = 'POST',
) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${api}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) return handleUnauthorized();
    return response;
  } catch (error) {
    console.error('Error fetching with body data:', error);
  }
}

// GENERIC FETCHING METHOD WITH FORM DATA
export async function handleFetchingWithFormData(
  formData: any,
  authToken: string,
  uri: string,
  method: string,
) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${uri}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
      body: formData,
    });

    return response;
  } catch (error) {
    console.error('Network error details:', {
      message: error.message,
      stack: error.stack,
      details: error.toString(),
    });
    throw error;
  }
}

/**
 * @param token - Authentication token
 * @param api - API Address
 * @returns - Response data or false if !response.ok
 */
export async function fetchData(
  token: string | null,
  api: string,
  method: string = 'GET',
) {
  try {
    if (token === null)
      return notifyError('Auth token nedostaje kako bi se izvršio fetch.');

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${api}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      if (response.status === 401) return handleUnauthorized();
      const parsedResponse = await response.json();
      notifyError(parsedResponse?.message);
      return false;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was an error while fetching data: ', error);
    notifyError('Error while fetching data');
    return false;
  }
}
