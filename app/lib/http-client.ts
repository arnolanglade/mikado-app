export const post = async <T>(route: string, data: T) => {
  await fetch(route, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data,
    }),
  });
};

export const get = async (route: string) => {
  await fetch(route, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  });
};
