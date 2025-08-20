export interface UserInfo {
  id: number;
  name: string;
  email: string;
  roles: string[];
  imageUrl: string | null;
  organizationId: number;
  isEmployee: boolean;
  shopId: number;
}

export interface AuthResponse {
  token: string;
  refresh: string;
  userInfo: UserInfo;
}

