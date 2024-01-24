export class Reactive {
  constructor(obj) {
    this.data = obj;
    this.$listeners = {};
    this.$makeReactive(obj);
  }
  listen(prop, handler) {
    if (!this.$listeners[prop]) this.$listeners[prop] = [];
    this.$listeners[prop].push(handler);
  }

  $makeReactive(obj) {
    Object.keys(obj).forEach((prop) => this.$makePropReactive(obj, prop));
  }
  $makePropReactive(obj, key) {
    let value = obj[key];
    const that = this;

    Object.defineProperty(obj, key, {
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
        that.$notify(key);
      },
    });
  }
  $notify(prop) {
    if (this.$listeners[prop] == null) return;
    this.$listeners[prop].forEach((listener) => listener(this.data[prop]));
  }
}
