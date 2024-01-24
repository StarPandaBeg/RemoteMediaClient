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

const logger = Logger.getLogger("eyeofgod-page-sound");
const { messageBuilder } = getApp()._options.globalData;

Page({
  state: {
    soundSlider: null,
    lastTimeoutID: null,
  },

  onInit() {
    setStatusBarVisible(false);
    setScrollLock({
      lock: true,
    });
    addListener(this.onBLEStatusChange.bind(this));
  },

  onDestroy() {
    setScrollLock({
      lock: false,
    });
    removeListener(this.onBLEStatusChange);
  },

  build() {
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
        clearTimeout(ctx.state.lastTimeoutID);
        ctx.state.lastTimeoutID = setTimeout(() => {
          this.sendCommand("sound", floatpos * 100);
        }, 200);
      },
    });
    this.state.soundSlider.show();
    // this.state.soundRect = nativeSlider({
    //   ctx: this,
    //   backColor: 0x303030,
    //   frontColor: 0xf0f0f0,
    //   stateImages: [
    //     "volume_min_1.png",
    //     "volume_min_2.png",
    //     "volume_mid.png",
    //     "volume_mid.png",
    //     "volume_max.png",
    //     "volume_max.png",
    //   ],
    //   button: null,
    //   onSliderMove: (ctx, floatpos, isUserInput) => {
    //     logger.log("nativeslider input", floatpos);
    //     ctx.state.soundBar.setPosition(floatpos);
    //   },
    // });
    // this.state.soundRect.show();
    // this.state.soundBar = createProgressBar({
    //   x: 10,
    //   y: DEVICE_HEIGHT - 130,
    //   h: 24,
    //   w: DEVICE_WIDTH - 20,
    //   backColor: 0x262626,
    //   frontColor: 0xffffff,
    //   src: "volume_up.png",
    //   ctx: this,
    //   onClick: (ctx) => {
    //     // if (!ctx.state.rendered) return;
    //     ctx.state.soundRect.show();
    //     // ctx.state.soundBar.setPosition(ctx.state.item.attributes.volume_level);
    //     // ctx.state.nativeSlider.setButtonToggle(
    //     //   ctx.state.item.attributes.is_volume_muted
    //     // );
    //   },
    // });
    // this.state.soundRect = createWidget(widget.FILL_RECT, SOUND_RECT);
    // this.state.soundBar = createWidget(widget.FILL_RECT, SOUND_BAR);
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
