import { AuthProviderConfig } from "Constants/AuthProviders.config";

export class AuthProviders {
  static getProviders() {
    return Object.entries(AuthProviderConfig).map(([id, config]) => ({
      id,
      name: config.name,
    }));
  }
}
