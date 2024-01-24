import { gettext } from "i18n";
import { MessageBuilder } from "../shared/message-side";

import config from "./config";
import { toBytesInt32 } from "../utils/func";

messageBuilder = new MessageBuilder();
token = null;

methods = {
  play: async function (data) {
    return await this.sendAction("AQA="); // 0x01 0x00
  },
  next: async function (data) {
    return await this.sendAction("AQI="); // 0x01 0x01
  },
  prev: async function (data) {
    return await this.sendAction("AQE="); // 0x01 0x02
  },
  sound: async function (data) {
    const soundValue = data.value;
    const binary = toBytesInt32(soundValue);
    const base = btoa(
      String.fromCharCode(...[0x02, ...new Uint8Array(binary)])
    );
    return await this.sendAction(base);
  },
  info: async function (data) {
    return await this.sendAction("Aw=="); // 0x03
  },
};

AppSideService({
  onInit() {
    messageBuilder.listen(() => {});
    messageBuilder.on("request", async (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload);
      if (jsonRpc.method in methods) {
        const method = methods[jsonRpc.method];
        const [status, data] = await method.bind(this)(jsonRpc);

        console.log("Received: ", data);

        ctx.response({
          data: {
            status,
            message: data,
          },
        });
        return;
      }
      console.error(`Unknown method: ${jsonRpc.method}`);
    });
  },

  onRun() {},

  onDestroy() {},

  async sendAction(action, repeated = false) {
    const body = {
      data: action,
    };

    try {
      if (token == null) {
        const [status, data] = await this.authenticate();
        if (!status) return [false, data];
        token = data;
      }

      const result = await fetch({
        url: config.control_url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Token": token,
        },
        body: JSON.stringify(body),
      });

      const data =
        typeof result.body === "string" ? JSON.parse(result.body) : result.body;
      if (result.status == 401 || result.status == 403) {
        if (repeated) {
          console.log("Error during sendAction - no auth", result);
          return [false, "Authorization error"];
        }
        return await this.sendAction(action, true);
      }
      if (result.status == 0) {
        return [false, "Timeout"];
      }
      if (result.status != 200) {
        console.log("Error during sendAction", result);
        return [false, data?.message ?? "Unknown error"];
      }

      return [true, data];
    } catch (e) {
      console.log("Error during sendAction", e);
      return [false, "Unknown error"];
    }
  },

  async authenticate() {
    const body = {
      username: config.login,
      password: config.password,
    };

    try {
      const result = await fetch({
        url: config.auth_url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data =
        typeof result.body === "string" ? JSON.parse(result.body) : result.body;
      if (result.status == 0) {
        return [false, "Timeout"];
      }
      if (result.status != 200) {
        console.log("Error during authentication", data);
        return [false, data?.message ?? "Unknown error"];
      }
      return [true, data.token];
    } catch (e) {
      console.log("Error during authentication", e);
      return [false, "Unknown error"];
    }
  },
});
