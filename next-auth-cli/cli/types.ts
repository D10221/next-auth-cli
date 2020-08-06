import typeorm from "typeorm";
export type ConnectionOptions = typeorm.ConnectionOptions & {
  [key: string]: any;
};
export type Models = {
  [key: string]: {
    model: any;
    schema: {
      name: string;
      columns: {
        [key: string]: any;
      };
      indices: {
        columns: string[];
      }[];
    };
  };
};

export type NextAuthAdapter = (
  ...args: any[]
) => { getAdapter(options?: {}): Promise<any> };

export interface CustomNextAuthAdapter {
  getAdapter(appOptions?: {}): Promise<any>;
}

export type Configuration = {
  adapter?: string | NextAuthAdapter;
  database?: string | ConnectionOptions;
};
