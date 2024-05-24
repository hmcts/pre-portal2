export interface User {
  app_access:
    | [
        {
          active: boolean;
          court_id: string;
          id: string;
          last_active: string; //"2024-05-24T11:47:36.757Z",
          role_id: string;
          user_id: string;
        },
      ]
    | [];
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  organisation: string;
  phone_number: string;
  portal_access:
    | [
        {
          id: string;
          invited_at: string; //"2024-05-24T11:47:36.757Z",
          last_access: string; //"2024-05-24T11:47:36.757Z",
          registered_at: string; //"2024-05-24T11:47:36.757Z",
          status: string;
        },
      ]
    | [];
}
