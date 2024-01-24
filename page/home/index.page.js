import * as hmBle from "@zos/ble";
import * as hmUI from "@zos/ui";
import { getText } from "@zos/i18n";
import { log as Logger } from "@zos/utils";
import { sessionStorage } from "@zos/storage";

import * as customWidgets from "./index.style";
import { STATUS_COLORS } from "../../utils/colors";
import * as constants from "../../utils/constants";
import { Reactive } from "../../utils/reactive";
import { secondsToHms } from "../../utils/func";
import { push } from "@zos/router";

const Log = Logger.getLogger("eyeofgod-page-home");
const { messageBuilder: MessageBuilder } = getApp()._options.globalData;

Page({
  state: {
    isConnected: false,
    widgets: [],
    mediaInfo: new Reactive({
      playing: false,
      title: "",
      subtitle: "",
      volume: 0,

      hasNext: false,
      hasPrev: false,
    }),
    statusInfo: new Reactive({
      connectedToService: false,
    }),
    infoIntervalId: null,
  },

  onInit() {
    hmUI.setStatusBarVisible(false);
    hmBle.addListener(this.onConnectionStatusChange.bind(this));

    this.state.isConnected = hmBle.connectStatus();
    this.onConnectionStatusChange(this.state.isConnected);
  },

  onDestroy() {
    hmBle.removeListener(this.onConnectionStatusChange.bind(this));
  },

  build() {
    this.buildStatusBar();
    this.buildMain();
    this.buildDisconnected();

    this.reloadFromSession();
    this.onConnectionStatusChange(this.state.isConnected);
  },

  onConnectionStatusChange(status) {
    this.state.statusInfo.data.connectedToService = status;
    hmUI.redraw();
    this.reinitInfoInterval(status);
  },

  onReload() {
    Log.debug("Reload click!");
    this.reinitInfoInterval(this.state.statusInfo.data.connectedToService);
  },

  onApplicationMessage(method, data) {
    const media = this.state.mediaInfo;
    const { status, message } = data;

    if (!status) {
      hmUI.showToast({ content: message });
      return;
    }

    if (method == "info") {
      const mediaData = JSON.parse(message.message);

      // Issue with song position on server - always 00:00
      // let timeline = "--";
      // if (mediaData.song_duration > 0) {
      //   const position = Math.round(mediaData.song_position);
      //   const duration = Math.round(mediaData.song_duration);
      //   timeline = `${secondsToHms(position)} / ${secondsToHms(duration)}`;
      // }

      media.data.playing = mediaData.is_playing;
      media.data.title = mediaData.song_title;
      media.data.subtitle = mediaData.song_author;
      media.data.hasPrev = mediaData.has_prev;
      media.data.hasNext = mediaData.has_next;
      media.data.volume = mediaData.volume;
    }
  },

  onInfoIntervalTick() {
    this.sendMessageToApp("info");
  },

  createWidget(...args) {
    const widget = hmUI.createWidget(...args);
    this.state.widgets.push(widget);
    return widget;
  },

  sendMessageToApp(method, data = {}) {
    MessageBuilder.request({
      ...data,
      method,
    }).then((response) => this.onApplicationMessage(method, response));
  },

  buildStatusBar() {
    const status = this.state.statusInfo;
    const reloadButtonParams = {
      ...customWidgets.RELOAD_BUTTON,
      click_func: (widget) => this.onReload(),
    };
    const icon = this.createWidget(
      hmUI.widget.CIRCLE,
      customWidgets.STATUS_CIRCLE
    );
    const label = this.createWidget(
      hmUI.widget.TEXT,
      customWidgets.STATUS_TEXT
    );
    const reloadButton = this.createWidget(
      hmUI.widget.BUTTON,
      reloadButtonParams
    );

    status.listen("connectedToService", (value) => {
      const state = value
        ? constants.STATUS_CONNECTED
        : constants.STATUS_DISCONNECTED;
      icon.setProperty(hmUI.prop.COLOR, STATUS_COLORS[state]);
      label.setProperty(
        hmUI.prop.TEXT,
        getText(constants.STATUS_LOCALE_KEYS[state])
      );
    });
  },

  buildMain() {
    const status = this.state.statusInfo;
    const media = this.state.mediaInfo;
    const group = this.createWidget(
      hmUI.widget.GROUP,
      customWidgets.MAIN_GROUP
    );

    const title = group.createWidget(
      hmUI.widget.TEXT,
      customWidgets.TITLE_TEXT
    );
    const subtitle = group.createWidget(
      hmUI.widget.TEXT,
      customWidgets.SUBTITLE_TEXT
    );
    const prev = group.createWidget(hmUI.widget.BUTTON, {
      ...customWidgets.PREV_BUTTON,
      click_func: (widget) => this.sendMessageToApp("prev"),
    });
    const prevDisabled = group.createWidget(
      hmUI.widget.BUTTON,
      customWidgets.PREV_DISABLED_BUTTON
    );
    const play = group.createWidget(hmUI.widget.BUTTON, {
      ...customWidgets.PLAY_BUTTON,
      click_func: (widget) => {
        if (this.state.statusInfo.data.connectedToService) {
          this.state.mediaInfo.data.playing = true;
        }

        this.sendMessageToApp("play");
      },
    });
    const pause = group.createWidget(hmUI.widget.BUTTON, {
      ...customWidgets.PAUSE_BUTTON,
      click_func: (widget) => {
        if (this.state.statusInfo.data.connectedToService) {
          this.state.mediaInfo.data.playing = false;
        }

        this.sendMessageToApp("play");
      },
    });
    const next = group.createWidget(hmUI.widget.BUTTON, {
      ...customWidgets.NEXT_BUTTON,
      click_func: (widget) => this.sendMessageToApp("next"),
    });
    const nextDisabled = group.createWidget(
      hmUI.widget.BUTTON,
      customWidgets.NEXT_DISABLED_BUTTON
    );
    const volume = group.createWidget(hmUI.widget.BUTTON, {
      ...customWidgets.SOUND_BUTTON,
      click_func: (widget) => {
        sessionStorage.setItem("media", this.state.mediaInfo.data);
        push({
          url: "page/sound/index.page",
          params: this.state.mediaInfo.data,
        });
      },
    });

    prevDisabled.setProperty(hmUI.prop.VISIBLE, false);
    nextDisabled.setProperty(hmUI.prop.VISIBLE, false);
    pause.setProperty(hmUI.prop.VISIBLE, false);

    media.listen("title", (value) => {
      title.setProperty(hmUI.prop.TEXT, value);
    });
    media.listen("subtitle", (value) => {
      subtitle.setProperty(hmUI.prop.TEXT, value);
    });
    media.listen("playing", (value) => {
      pause.setProperty(hmUI.prop.VISIBLE, value);
      play.setProperty(hmUI.prop.VISIBLE, !value);
    });
    media.listen("hasPrev", (value) => {
      prev.setProperty(hmUI.prop.VISIBLE, value);
      prevDisabled.setProperty(hmUI.prop.VISIBLE, !value);
    });
    media.listen("hasNext", (value) => {
      next.setProperty(hmUI.prop.VISIBLE, value);
      nextDisabled.setProperty(hmUI.prop.VISIBLE, !value);
    });
    status.listen("connectedToService", (value) => {
      group.setProperty(hmUI.prop.VISIBLE, value);
    });
  },

  buildDisconnected() {
    const status = this.state.statusInfo;
    const group = this.createWidget(
      hmUI.widget.GROUP,
      customWidgets.NO_CONNECTION_GROUP
    );

    const icon = group.createWidget(
      hmUI.widget.IMG,
      customWidgets.NO_CONNECTION_ICON
    );
    const label = group.createWidget(
      hmUI.widget.TEXT,
      customWidgets.NO_CONNECTION_TEXT
    );

    status.listen("connectedToService", (value) => {
      group.setProperty(hmUI.prop.VISIBLE, !value);
    });
  },

  reinitInfoInterval(run = true) {
    if (this.state.infoIntervalId != null) {
      clearInterval(this.state.infoIntervalId);
      this.state.infoIntervalId = null;
    }

    if (!run) return;
    this.onInfoIntervalTick();
    this.state.infoIntervalId = setInterval(
      this.onInfoIntervalTick.bind(this),
      5000
    );
  },

  reloadFromSession() {
    const media = this.state.mediaInfo;
    let loadedMedia = sessionStorage.getItem("media", media.data);
    if (typeof loadedMedia === "string" || loadedMedia instanceof String) {
      loadedMedia = JSON.parse(loadedMedia);
    }

    Object.keys(media.data).forEach((key) => {
      if (loadedMedia[key] !== null && loadedMedia[key] !== undefined) {
        media.data[key] = loadedMedia[key];
      }
    });
  },
});