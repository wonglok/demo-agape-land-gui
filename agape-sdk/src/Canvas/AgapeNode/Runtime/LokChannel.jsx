export class LokChannel {
  constructor(name) {
    this.name = name;

    this.calls = [];
    this.onMessage = (hh) => {
      this.calls.push(hh);
    };
    this.handleMessage = ({ detail }) => {
      this.calls.forEach((c) => {
        c(detail);
      });
    };
    window.addEventListener(this.name, this.handleMessage);

    this.postMessage = (data) => {
      window.dispatchEvent(new CustomEvent(this.name, { detail: data }));
    };
    this.close = () => {
      window.removeEventListener(this.name, this.handleMessage);
      this.calls = [];
    };
  }
}
