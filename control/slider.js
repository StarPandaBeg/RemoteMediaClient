import { createWidget, widget } from "@zos/ui";

import { getDeviceInfo } from "@zos/device";
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();

export const createSlider = (args) => {
  const components = [];

  let x = args.x;
  let y = args.y;
  let w = args.w;
  let h = args.h;

  const background = createWidget(widget.FILL_RECT, {
    x,
    y,
    w,
    h,
    color: 0x333333,
    radius: 36,
  });
  components.push(background);
};
