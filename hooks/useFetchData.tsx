import { notifyError } from '../components/util-components/Notify';
import { useAuth } from '../store/auth-context';

export function useFetchData() {
  const { token, logout } = useAuth();

  async function fetchWithBodyData(api: string, data: any, method = 'POST') {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${api}`,
        {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      if (response.status === 401) return logout();
      return response;
    } catch (error) {
      console.error('Error fetching with body data:', error);
    }
  }

  // GENERIC FETCHING METHOD WITH FORM DATA
  async function handleFetchingWithFormData(
    formData: any,
    uri: string,
    method: string,
  ) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${uri}`,
        {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'content-type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      if (response.status === 401) return logout();
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
  async function fetchData(api: string, method: string = 'GET') {
    try {
      if (token === null)
        return notifyError('Auth token nedostaje kako bi se izvršio fetch.');

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${api}`,
        {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        },
      );

      if (!response.ok) {
        if (response.status === 401) return logout();
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

  return { fetchData, handleFetchingWithFormData, fetchWithBodyData };
}
