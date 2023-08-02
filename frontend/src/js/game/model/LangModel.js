import Model from "../../mvc/Model";
import { TYPE_LANG_CHANGED } from "../Constants";

export default class LangModel extends Model {

  constructor(data = null) {
    super(data);
    this.data.lang = 'cn';
  }

  get lang() { return this.data.lang; }

  set lang(value) {
    if (this.data.lang !== value) {
      this.data.lang = value;
      this.sendEvent(TYPE_LANG_CHANGED);
    }
  }
}
