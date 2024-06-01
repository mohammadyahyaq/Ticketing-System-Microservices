import nats, { Stan } from "node-nats-streaming";

class SingletonNatsClient {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("NATS client is not connected");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, {
      url,
    });

    return new Promise<void>((resolve, reject) => {
      // on connect show success message and resolve the promise
      this.client.on("connect", () => {
        console.log("Connected to NATS Streaming");
        resolve();
      });
      // on error reject the promise
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const singletonNatsClient = new SingletonNatsClient();
