export enum User {
  Markus = 'Markus',
  Diana = 'Diana',
}

export interface Cork {
  user: User;
  id: string;
  timestamp: number;
}
