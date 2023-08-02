import BaseVc from "./BaseVc";

export default class NumberVc extends BaseVc {

  constructor(url) {
    super();
    this.initUiFromURL(url);
  }

  get num() { return this._num; }

  set num(value) {
    if (value !== this._num) {
      this._num = value;
      this._updateNum();
    }
  }

  onLoaded() {
    this.n0 = this.$getChild('n0');
    this.n1 = this.$getChild('n1');
    this.n2 = this.$getChild('n2');
    this.n3 = this.$getChild('n3');
    this.n4 = this.$getChild('n4');

    this.c1 = this.$getController('c1');
    this.c2 = this.$getController('c2');
    this._num = 0;
    this._updateNum();
  }

  dispose() {
    super.dispose();
    this.n0 = null;
    this.n1 = null;
    this.n2 = null;
    this.n3 = null;
    this.n4 = null;
  }

  _updateNum() {
    let num = this._num;
    if (this._num >= 10000) {
      num = Math.round(this._num / 10000);
    }
    this.c1.setSelectedIndex(this._num >= 10000 ? 1 : 0);
    this.n0.visible = true;
    this.n1.visible = false;
    this.n2.visible = false;
    this.n3.visible = false;
    this.n4.visible = false;

    const str = num.toString();
    for (let i = 0, len = str.length; i < len; i++) {
      const n = Number(str[i]);
      const nComp = this[`n${i}`];
      nComp.visible = true;
      const nCompC1 = nComp.getController('c1');
      nCompC1.setSelectedIndex(n);
    }
    this.c2.setSelectedIndex(str.length - 1);
  }
}
