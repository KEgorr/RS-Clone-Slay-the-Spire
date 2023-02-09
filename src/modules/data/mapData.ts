import { ILocation, keyForConnection } from '../types/types';

export default class MapData {
  locations: ILocation[] = [];
  currentFlor = '';
  florNumber = 0;

  public addLoc(name: string, type: string) {
    this.locations.push({ name: name, type: type, connected: { upper: [], lower: [] } });
  }

  public setConnection(key: keyForConnection, name: string, location: string) {
    const locationToSet = this.locations.find((loc) => loc.name === name);
    if (key === 'upper') {
      locationToSet?.connected?.upper.push(location);
    } else if (key === 'lower') {
      locationToSet?.connected?.lower?.push(location);
    }
  }

  public getConnections(name: string) {
    const location = this.locations.find((loc) => loc.name === name);

    return location?.connected;
  }

  public isConnected(key: keyForConnection, locFirst: string, locSecond: string) {
    const connections = this.getConnections(locFirst);
    if (key === 'lower') {
      if (connections?.lower.length === 0) {
        return true;
      }
      return connections?.lower.includes(locSecond);
    }
    return false;
  }

  public setFlor(flor: string) {
    this.currentFlor = flor;
    this.florNumber = Number(flor.split('_').at(-1));
  }

  public getFlorName() {
    return this.currentFlor;
  }

  public getFlorNumber() {
    return this.florNumber;
  }

  public getType(name: string) {
    return this.locations.find((loc) => loc.name === name)?.type;
  }
}
