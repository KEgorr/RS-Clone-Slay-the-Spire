export interface ILocation {
  name: string;
  type: string;
  connected?: {
    upper: string[];
    lower: string[];
  };
}

export type keyForConnection = 'upper' | 'lower';
