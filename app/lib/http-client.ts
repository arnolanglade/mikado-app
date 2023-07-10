export type HttpClient = {
  post: <T>(route: string, data: T) => Promise<Response>
  get: (route: string) => Promise<Response>
};

const httpClient: HttpClient = {
  post: async <T>(route: string, data: T) => fetch(route, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  get: async (route: string): Promise<Response> => fetch(route, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  }),
};
export default httpClient;
