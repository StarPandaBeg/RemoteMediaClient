import { px } from "@zos/utils";
import { getDeviceInfo } from "@zos/device";
import {
  TEXT_DEFAULT,
  TEXT_HIGHLIGHT,
  TEXT_SECONDARY,
} from "../../utils/colors";
import { align, text_style } from "@zos/ui";
import { getText } from "@zos/i18n";

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();

export const STATUS_CIRCLE = {
  center_x: px(20),
  center_y: px(70),
  radius: 8,
  color: 0xffffff,
};

export const STATUS_TEXT = {
  x: px(36),
  y: px(50),
  w: DEVICE_WIDTH - px(36),
  h: px(36),
  text_size: 24,
  color: TEXT_DEFAULT,
  align_h: align.LEFT,
  align_v: align.CENTER_V,
};

export const RELOAD_BUTTON = {
  x: DEVICE_WIDTH - 56,
  y: px(51),
  w: px(36),
  h: px(36),
  normal_src: "button_reload_normal.png",
  press_src: "button_reload_press.png",
};

export const MAIN_GROUP = {
  x: px(0),
  y: px(0),
  w: DEVICE_WIDTH,
  h: DEVICE_HEIGHT,
};

export const TITLE_TEXT = {
  x: px(40),
  y: px(110),
  w: DEVICE_WIDTH - px(80),
  h: px(36),
  text_size: 32,
  color: TEXT_HIGHLIGHT,
  text: "--",
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
};

export const SUBTITLE_TEXT = {
  x: px(40),
  y: px(143),
  w: DEVICE_WIDTH - px(80),
  h: px(36),
  text_size: 20,
  color: TEXT_DEFAULT,
  text: "--",
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
};

export const PREV_BUTTON = {
  x: DEVICE_WIDTH / 2 - px(140),
  y: px(232),
  w: px(64),
  h: px(64),
  normal_src: "button_prev_normal.png",
  press_src: "button_prev_press.png",
};

export const PREV_DISABLED_BUTTON = {
  x: DEVICE_WIDTH / 2 - px(140),
  y: px(232),
  w: px(64),
  h: px(64),
  normal_src: "button_prev_disabled.png",
  press_src: "button_prev_disabled.png",
};

export const PLAY_BUTTON = {
  x: DEVICE_WIDTH / 2 - px(64),
  y: px(200),
  w: px(128),
  h: px(128),
  normal_src: "button_play_normal.png",
  press_src: "button_play_press.png",
};

export const PAUSE_BUTTON = {
  x: DEVICE_WIDTH / 2 - px(64),
  y: px(200),
  w: px(128),
  h: px(128),
  normal_src: "button_pause_normal.png",
  press_src: "button_pause_press.png",
};

export const NEXT_BUTTON = {
  x: DEVICE_WIDTH / 2 + px(76),
  y: px(232),
  w: px(64),
  h: px(64),
  normal_src: "button_next_normal.png",
  press_src: "button_next_press.png",
};

export const NEXT_DISABLED_BUTTON = {
  x: DEVICE_WIDTH / 2 + px(76),
  y: px(232),
  w: px(64),
  h: px(64),
  normal_src: "button_next_disabled.png",
  press_src: "button_next_disabled.png",
};

export const SOUND_BUTTON = {
  x: DEVICE_WIDTH / 2 - px(32),
  y: DEVICE_HEIGHT - px(82),
  w: px(64),
  h: px(64),
  normal_src: "button_sound_normal.png",
  press_src: "button_sound_press.png",
};

export const NO_CONNECTION_GROUP = {
  x: px(0),
  y: px(0),
  w: DEVICE_WIDTH,
  h: DEVICE_HEIGHT,
};

export const NO_CONNECTION_ICON = {
  x: DEVICE_WIDTH / 2 - px(64),
  y: px(160),
  w: px(128),
  h: px(128),
  src: "disconnected.png",
};

export const NO_CONNECTION_TEXT = {
  x: px(32),
  y: px(268),
  w: DEVICE_WIDTH - px(64),
  h: px(128),
  text: getText("error_no_connection"),
  text_size: 20,
  text_style: text_style.WRAP,
  color: TEXT_SECONDARY,
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
};
