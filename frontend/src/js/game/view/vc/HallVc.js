import BaseVc from "./BaseVc";

export default class HallVc extends BaseVc {

  constructor() {
    super();
  }

  onLoaded() {
    this.rankBtn = this.$getChild('rankBtn');
    this.warehouseBtn = this.$getChild('warehouseBtn');
    this.mixtureBtn = this.$getChild('mixtureBtn');
    this.shopBtn = this.$getChild('shopBtn');
    this.allianceBtn = this.$getChild('allianceBtn');
    this.battleBtn = this.$getChild('battleBtn');
    this.gardenBtn = this.$getChild('gardenBtn');
    this.territoryBtn = this.$getChild('territoryBtn');
    this.taskBtn = this.$getChild('taskBtn');
    this.manualBtn = this.$getChild('manualBtn');
    this.mineBtn = this.$getChild('mineBtn');
    this.nightHunt = this.$getChild('nightHunt');
    this.zombieHuntBtn = this.$getChild('zombieHuntBtn');
    this.personalHunt = this.$getChild('personalHunt');
  }

  dispose() {
    super.dispose();
    this.rankBtn = null;
    this.warehouseBtn = null;
    this.mixtureBtn = null;
    this.shopBtn = null;
    this.allianceBtn = null;
    this.battleBtn = null;
    this.gardenBtn = null;
    this.territoryBtn = null;
    this.taskBtn = null;
    this.manualBtn = null;
    this.mineBtn = null;
    this.nightHunt = null;
    this.zombieHuntBtn = null;
    this.personalHunt = null;
  }
}
