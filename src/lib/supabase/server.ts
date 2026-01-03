export const createClient = () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => {},
    },
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
};
