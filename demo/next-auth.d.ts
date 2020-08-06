declare module "next-auth" {
  const NextAuth: any;
  export default NextAuth;
}

declare module "next-auth/providers" {
  const Providers: any;
  export default Providers;
}

declare module "next-auth/client" {
  export const getSession: any;
  export const signIn: any;
  export const signOut: any;
  export const useSession: any;
  export const Provider: any;
}

declare module "next-auth/adapters" {
  export type NextAuthSchemaColumns = {
    [key: string]: {
      [hey: string]: any;
    };
  };

  export type NextAuthSchema = {
    name: string;
    columns: NextAuthSchemaColumns;
  };

  export class NextAuthModel {}

  export type NextAuthModels = {
    [key: string]: {
      schema: NextAuthSchema;
      model: NextAuthModel;
    };
  };
  export type NetxAdapter = {
    getAdapter(): Promise<{
      createUser(...args: any[]): Promise<any>;
      getUser(...args: any[]): Promise<any>;
      getUserByEmail(...args: any[]): Promise<any>;
      getUserByProviderAccountId(...args: any[]): Promise<any>;
      updateUser(...args: any[]): Promise<any>;
      deleteUser(...args: any[]): Promise<any>;
      linkAccount(...args: any[]): Promise<any>;
      unlinkAccount(...args: any[]): Promise<any>;
      createSession(...args: any[]): Promise<any>;
      getSession(...args: any[]): Promise<any>;
      updateSession(...args: any[]): Promise<any>;
      deleteSession(...args: any[]): Promise<any>;
      createVerificationRequest(...args: any[]): Promise<any>;
      getVerificationRequest(...args: any[]): Promise<any>;
      deleteVerificationRequest(...args: any[]): Promise<any>;
    }>;
  };
  const Adapters: {
    Default(...args: any[]): NetxAdapter;
    TypeORM: {
      Adapter(connectionOptions: {} | string, options: {}): NetxAdapter;
      Models: NextAuthModels;
    };
  };
  export default Adapters;
}
