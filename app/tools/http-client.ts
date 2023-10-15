export type HttpClient = {
  post: <T>(route: string, data: T) => Promise<Response>
  get: (route: string) => Promise<Response>
};

const httpClient: HttpClient = {
  post: async <T>(route: string, data: T) => {
    const response = await fetch(route, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! ${response.status} (code: ${response.status}`);
    }

    return response;
  },
  get: async (route: string): Promise<Response> => {
    const response = await fetch(route, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! ${response.status} (code: ${response.status}`);
    }

    return response;
  },
};
export default httpClient;
