import CodeFlask from 'CodeFlask';

export default class Flask extends CodeFlask {
  updateSilent(string) {
    this.textarea.value = string;
    this.renderOutput(this.highlightCode, this.textarea);
    this.highlight(this.highlightCode);
  }
}
