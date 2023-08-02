import BaseVc from "./BaseVc";

export default class SystemPromptVc extends BaseVc {

  constructor() {
    super();
  }

  onLoaded() {
    this.closeBtn = this.$getChild('closeBtn');
    this.cancelBtn = this.$getChild('cancelBtn');
    this.confirmBtn = this.$getChild('confirmBtn');
    this.msg = this.$getChild('msg');
  }

  dispose() {
    super.dispose();
    this.closeBtn = null;
    this.cancelBtn = null;
    this.confirmBtn = null;
    this.msg = null;
  }
}
