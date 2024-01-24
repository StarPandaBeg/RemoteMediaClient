import {
  createWidget,
  prop,
  redraw,
  setStatusBarVisible,
  widget,
} from "@zos/ui";
import { showToast } from "@zos/interaction";
import { log as Logger } from "@zos/utils";
import { addListener, connectStatus, removeListener } from "@zos/ble";
import { getText } from "@zos/i18n";

import { STATUS_COLORS } from "../../utils/colors";
import {
  STATUS_CONNECTED,
  STATUS_DISCONNECTED,
  STATUS_LOCALE_KEYS,
} from "../../utils/constants";
import {
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  SOUND_BAR,
  SOUND_RECT,
  STATUS_CIRCLE,
  STATUS_TEXT,
} from "./index.style";
import { nativeSlider } from "../../control/nativeSlider";
import { createProgressBar } from "../../control/progressBar";
import { createSlider } from "../../control/slider";
import { setScrollLock } from "@zos/page";
import { back } from "@zos/router";
import { sessionStorage } from "@zos/storage";

const logger = Logger.getLogger("eyeofgod-page-sound");
const { messageBuilder } = getApp()._options.globalData;

Page({
  state: {
    soundSlider: null,
    lastTimeoutID: null,
    init: false,
    volume: 50,
    params: null,
  },

  onInit(params) {
    if (!connectStatus()) back();

    setStatusBarVisible(false);
    setScrollLock({
      lock: true,
    });
    addListener(this.onBLEStatusChange.bind(this));

    params = JSON.parse(params);

    console.log("GOT VOLUME: ", params.volume);

    this.state.init = true;
    this.state.params = params;
    this.state.volume = params.volume ?? 50;
  },

  onDestroy() {
    if (!this.state.init) return;

    setScrollLock({
      lock: false,
    });
    removeListener(this.onBLEStatusChange);
    this.state.params.volume = this.state.volume;

    sessionStorage.setItem("media", this.state.params);
  },

  build() {
    const state = this.state;

    this.state.soundSlider = nativeSlider({
      ctx: this,
      backColor: 0x333333,
      frontColor: 0xffffff,
      stateImages: [
        "volume_min_1.png",
        "volume_min_2.png",
        "volume_mid.png",
        "volume_mid.png",
        "volume_max.png",
        "volume_max.png",
      ],
      button: null,
      onSliderMove: (ctx, floatpos, isUserInput) => {
        state.volume = Math.round(floatpos * 100);

        clearTimeout(ctx.state.lastTimeoutID);
        ctx.state.lastTimeoutID = setTimeout(() => {
          this.sendCommand("sound", state.volume);
        }, 200);
      },
    });
    this.state.soundSlider.show();
    this.state.soundSlider.setPosition(state.volume / 100.0);
  },

  sendCommand(command, value) {
    messageBuilder
      .request({
        method: command,
        value: value,
      })
      .then((data) => {
        const { status, message } = data;
        logger.log(status, message);
        if (!status) {
          showToast({
            content: message,
          });
        }
      });
  },

  onBLEStatusChange(status) {
    if (!status) back();
  },
});
