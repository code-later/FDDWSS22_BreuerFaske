/* eslint-env browser */

function rejectIfNotOK (response) {
  return response.ok ? response : Promise.reject(new Error(response.statusText));
}

class EmbedLink extends HTMLElement {
  connectedCallback () {
    this.loadContent();
  }

  loadContent () {
    this.classList.add("is-loading");

    fetch(this.url, { credentials: "include" })
      .then(rejectIfNotOK)
      .then(response => response.text())
      .then(text => {
        this.classList.remove("is-loading");

        // To ensure a correct loading of custom elements (and pony fills) it
        // is necessary to invoke the fetched data via an html element object
        this.outerHTML = text;

        return null;
      })
      .catch((e) => {
        this.remove();
        console.error(`Failed to embed link ${this.url}`, e);
      });
  }

  get url () {
    return this.querySelector("a").getAttribute("href");
  }
}

customElements.define("embed-link", EmbedLink);
