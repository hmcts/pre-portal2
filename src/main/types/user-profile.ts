export interface UserProfile {
  id: string;
  court: {
    id: string;
    name: string;
    court_type: string;
    location_code: string;
    regions: [
      {
        name: string;
      }
    ];
    rooms: [];
  };
  role: {
    id: string;
    name: string;
    description: string;
    permissions: [];
  };
  last_access: string | null;
  active: boolean;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    organisation: string | null;
  };
}
