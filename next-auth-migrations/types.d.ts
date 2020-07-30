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
        [key: string]: {
          type: string;
        };
      };
      indices: {
        columns: string[];
      }[];
    };
  };
};
