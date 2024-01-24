import "./shared/device-polyfill";
import { MessageBuilder } from "./shared/message";

import { getPackageInfo } from "@zos/app";
import { log as Logger } from "@zos/utils";
import * as ble from "@zos/ble";

const logger = Logger.getLogger("eyeofgod-app");

App({
  globalData: {
    messageBuilder: null,
  },
  onCreate(options) {
    const { appId } = getPackageInfo();
    logger.log(`Loading application. App ID: ${appId}`);

    const messageBuilder = new MessageBuilder({
      appId,
      appDevicePort: 20,
      appSidePort: 0,
      ble,
    });
    this.globalData.messageBuilder = messageBuilder;
    messageBuilder.connect();
  },

  onDestroy(options) {
    logger.log("Destroying application");
    this.globalData.messageBuilder &&
      this.globalData.messageBuilder.disConnect();
  },
});
