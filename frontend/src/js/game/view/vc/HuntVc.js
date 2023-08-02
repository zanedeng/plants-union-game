import BaseVc from "./BaseVc";

export default class HuntVc extends BaseVc {

  constructor() {
    super();
  }

  onLoaded() {
    this.backBtn = this.$getChild('backBtn');
    this.nextHuntBtn = this.$getChild('nextHuntBtn');
    this.nextPageBtn = this.$getChild('nextPageBtn');
    this.prevPageBtn = this.$getChild('prevPageBtn');
    this.hole0 = this.$getChild('hole0');
    this.hole1 = this.$getChild('hole1');
    this.hole2 = this.$getChild('hole2');
    this.hole3 = this.$getChild('hole3');
    this.hole4 = this.$getChild('hole4');
    this.hole5 = this.$getChild('hole5');
    this.hole6 = this.$getChild('hole6');
    this.hole7 = this.$getChild('hole7');
    this.hole8 = this.$getChild('hole8');
    this.hole9 = this.$getChild('hole9');
    this.hole10 = this.$getChild('hole10');
    this.hole11 = this.$getChild('hole11');

  }

  dispose() {
    super.dispose();
    this.backBtn = null;
    this.nextHuntBtn = null;
    this.nextPageBtn = null;
    this.prevPageBtn = null;
    this.hole0 = null;
    this.hole1 = null;
    this.hole2 = null;
    this.hole3 = null;
    this.hole4 = null;
    this.hole5 = null;
    this.hole6 = null;
    this.hole7 = null;
    this.hole8 = null;
    this.hole9 = null;
    this.hole10 = null;
    this.hole11 = null;
  }
}
