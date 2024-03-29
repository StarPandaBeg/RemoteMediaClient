import * as hmUI from "@zos/ui";

/**
 * @param {object} args {
 *                          h: number, //height of thickest part or height of image
 *                          w: number,
 *                          x: number,
 *                          y: number,
 *                          src: string, //image name
 *                          ctx: object,
 *                          onClick: function(ctx), //if this set, progressBar will act as button
 *                          frontColor: number,
 *                          backColor: number,
 *                      }
 * @returns {object} {
 *                      setPosition(floatpos),
 *                      components: array[Widget],
 *                   }
 */
export const createProgressBar = (args) => {
  const components = [];

  let progressBarBg = hmUI.createWidget(hmUI.widget.FILL_RECT, {
    x: args.x,
    y: args.y,
    w: args.w,
    h: args.h,
    color: 0x000000,
  });

  if (args.src) {
    const img = hmUI.createWidget(hmUI.widget.IMG, {
      x: args.x,
      y: args.y,
      w: args.h,
      h: args.h,
      src: args.src,
    });

    args.x += args.h + 5;
    args.y += args.h / 4;
    args.w -= args.h + 5;
    args.h /= 2;

    components.push(img);
  }

  const progressBarRow = hmUI.createWidget(hmUI.widget.FILL_RECT, {
    x: args.x,
    y: args.y,
    w: args.w,
    h: args.h,
    radius: args.h / 2,
    color: args.backColor,
  });

  const progressBarPoint = hmUI.createWidget(hmUI.widget.FILL_RECT, {
    x: args.x,
    y: args.y,
    w: args.h / 2,
    h: args.h,
    radius: args.h / 2,
    color: args.frontColor,
  });

  const setPosition = (floatvalue) => {
    progressBarPoint.setProperty(hmUI.prop.MORE, { w: floatvalue * args.w });
  };

  components.push(progressBarBg, progressBarRow, progressBarPoint);

  components.forEach((component) => component.setEnable(false));

  if (args.onClick) {
    progressBarBg.setEnable(true);
    progressBarBg.addEventListener(hmUI.event.CLICK_UP, () => {
      args.onClick(args.ctx);
    });
  }

  return { setPosition, components };
};
