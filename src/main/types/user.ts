export interface User {
  app_access:
    | [
        {
          active: true;
          court: {
            court_type: string;
            id: string;
            location_code: string;
            name: string;
            regions:
              | [
                  {
                    name: string;
                  },
                ]
              | [];
            rooms:
              | [
                  {
                    id: string;
                    name: string;
                  },
                ]
              | [];
          };
          default_court: true;
          id: string;
          last_access: string;
          role: {
            description: string;
            id: string;
            name: string;
            permissions:
              | [
                  {
                    id: string;
                    name: string;
                  },
                ]
              | [];
          };
        },
      ]
    | [];
  created_at: string;
  deleted_at: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  modified_at: string;
  organisation: string;
  phone_number: string;
  portal_access:
    | [
        {
          deleted_at: string;
          id: string;
          invited_at: string;
          last_access: string;
          registered_at: string;
          status: string;
        },
      ]
    | [];
}
