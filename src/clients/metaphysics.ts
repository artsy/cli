import fetch from "node-fetch";
import { Config } from "../config";

export class Metaphysics {
  static STAGING_URL = `https://metaphysics-staging.artsy.net/v2`;
  static PRODUCTION_URL = `https://metaphysics.artsy.net/v2`;

  static async query(query: string, variables: object = {}, staging: boolean = true) {
    const endpoint = staging ? Metaphysics.STAGING_URL : Metaphysics.PRODUCTION_URL;
    const token: string = Config.gravityToken(staging); 

    const headers = {
      'content-type': 'application/json',
      'x-access-token': `${token}`,
      'accept': '*/*',
    };

    const body = JSON.stringify({
      query,
      variables,
    });

    console.log(`Querying Metaphysics with token: ${token}`);
    console.log(`Querying Metaphysics with body: ${body}`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);

      return await response.json();
    } catch (error) {
      console.error('Error querying Metaphysics:', error);
      throw error;
    }
  }
}
