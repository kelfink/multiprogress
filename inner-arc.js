class InnerArc  extends HTMLElement {
   constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
//        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this._progress = this.getAttribute('progress');
        this._color = this.getAttribute('color');
    }

    properties() {
        return {
	"color": { type: "String" },
	"progress": { type: "String" },
        }
    }

    static get observedAttributes() {
        return ['color', 'progress'];
    }

    disconnectedCallback() {
        console.log('disconnected!');
    }

    attributeChangedCallback(name, oldVal, newVal) {
        console.log(`Attribute: ${name} changed!`, newVal);
    }

    adoptedCallback() {
        console.log('adopted!');
    }


    static get observedAttributes() {
        return ['textColor'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
	console.log("Callback attribute changed", name);
        this._textColor = newValue;
    }
    _onSlotChange() {
      console.log("_onSlotChange");
    }
}
window.customElements.define('inner-arc', InnerArc);

