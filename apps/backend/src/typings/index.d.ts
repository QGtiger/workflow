interface JwtUserData {
  id: number;

  username: string;

  email: string;

  isAdmin: boolean;

  createTime: number;

  roles: string[];

  permissions: string[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
    headers: {
      authorization: `Bearer ${string}`;
    };
  }
}
