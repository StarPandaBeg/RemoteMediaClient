import { px } from "@zos/utils";
import { getDeviceInfo } from "@zos/device";
import { TEXT_DEFAULT, TEXT_HIGHLIGHT } from "../../utils/colors";
import { align } from "@zos/ui";

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

export const SOUND_RECT = {
  x: DEVICE_WIDTH / 2 - px(36),
  y: px(100),
  w: 72,
  h: DEVICE_HEIGHT - px(150),
  color: 0x333333,
  radius: 36,
};

export const SOUND_BAR = {
  x: DEVICE_WIDTH / 2 - px(36),
  y: px(100),
  w: 72,
  h: DEVICE_HEIGHT - px(150),
  color: 0xffffff,
  radius: 36,
};
