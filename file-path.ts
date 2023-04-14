import { basename } from "./deps.ts";

const URL_RE = /^(https?:)|(file:).*/;

export class FilePath {
  #ref;

  constructor(maybePath: string | URL) {
    if (typeof maybePath === "string") {
      if (maybePath.match(URL_RE)) {
        this.#ref = new URL(maybePath);
      }
      if (maybePath.startsWith("/")) {
        this.#ref = new URL(`file://${maybePath}`);
      } else {
        this.#ref = new URL(maybePath, import.meta.url);
      }
    } else {
      this.#ref = maybePath;
    }
  }

  get url() {
    return this.#ref;
  }

  get pathname() {
    return this.#ref.pathname;
  }

  get filename() {
    return basename(this.#ref.pathname);
  }
}
