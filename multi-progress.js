const template = document.createElement('template');
template.innerHTML = `
<div class="outer" id="outerNode"><slot> cool arc bro:&nbsp;<span id="textHere"></span></div>
  <svg xmlns="http://www.w3.org/2000/svg" style="width:110; height:110;">
    <path d="M 0 6 L 3 0 L 6 6 L 0 6"/>
    <path d="" id="arc" fill="none" stroke="blue" stroke-width="3" />
  </svg>

    <div><slot>default text</slot></div>
<style>
  .host {
    background: "lightgrey";
  }
  .outer {
      color: "brown";
      border: 5px;
      align: top;
      width: 130px;
  }
</style>
`;

class MultiProgress extends HTMLElement {
   constructor() {
        super();

        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.$textHere = this._shadowRoot.querySelector('#textHere');
        this.$outerNode = this._shadowRoot.querySelector('#outerNode');
        this.$arc = this._shadowRoot.querySelector('#arc');
        this.$radius = 50;
    }

    connectedCallback() {
        this._progress = this.getAttribute('progress');
        this._id = this.getAttribute('id');
        if(this.hasAttribute('radius')) {
            this.$radius = parseInt(this.getAttribute('radius'));
            console.log("got the attribute",  this.getAttribute('radius'));
        }

        if(!this.hasAttribute('color')) {
            this.setAttribute('color', 'black');
        } else {
          this.textColor = this.attributes['color'].value;
        };
	console.log("in callback: color = ", this.textColor);

        // We set a default attribute here; if our end user hasn't provided one,
        // our element will display a "black" color instead.
       this._renderMultiProgress();
    }

    _renderMultiProgress() {
      this.$textHere.innerHTML = this.textColor;
      this.$outerNode.style = `background:grey;color:${this.textColor}`;
      this.$arc.setAttribute("stroke", this.textColor);
      this.myArc(this.$radius + 5, this.$radius + 5, this.$radius, this._progress * 360);
    }

    myArc(cx, cy, radius, max) {
       var circle = this.$arc;
       var e = circle.getAttribute("d");
       var d = " M " + (cx + radius) + " " + cy;
       var angle=0;
       if (typeof window.myTimer === 'undefined') {
         window.myTimer = []
       }
       window.myTimer[this._id]  = window.setInterval(
         () => {
           var radians= angle * (Math.PI / 180);  // convert degree to radians
           var x = cx + Math.cos(radians) * radius;
           var y = cy + Math.sin(radians) * radius;

           d += " L " + x + " " + y;
           circle.setAttribute("d", d)
           if (angle >= max) {
             window.clearInterval(window.myTimer[this._id]);
           }
           angle += 3;
         }
       , .1);
    }

    properties() {
        return {
	"color": { type: "String" },
        }
    }

    static get observedAttributes() {
        return ['color'];
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
}
window.customElements.define('multi-progress', MultiProgress);
