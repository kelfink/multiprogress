const template = document.createElement('template');
template.innerHTML = `
<div class="outer" id="outerNode">
    <span id="textHere"></span></div>
    <svg class="fadein-arc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" version="1.1"></svg>
  <slot>arcs go here</slot>
</div>
<style>
  .host {
    background: "green";
  }
  .outer {
      color: "brown";
      padding: 0em;
      align: top;
      width: 2em;
  }

  @keyframes hideshow {
    0% {  transform: rotate(270deg); }
    100% {  transform: rotate(360deg);}
  }
  .fadein-arc {
    animation: hideshow 1s ease 1;
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
        this.$svg = this._shadowRoot.querySelector('svg');
        this.$radius = 50;
        this.arcs = [];
    }

    connectedCallback() {
        this._progress = this.getAttribute('progress');
        this._id = this.getAttribute('id');
        if(this.hasAttribute('radius')) {
            this.$radius = parseInt(this.getAttribute('radius'));
        }

        if(!this.hasAttribute('color')) {
            this.setAttribute('color', 'grey');
        } else {
          this.textColor = this.attributes['color'].value;
        };

       window.slots = this.shadowRoot.querySelectorAll('slot');
       const assignedNodes = this.shadowRoot.querySelectorAll('slot')[0].assignedNodes();
       
       window.aNodes = assignedNodes;

       const slot = this.shadowRoot.querySelector('slot');

       slot.addEventListener('slotchange', e => {
           this.alreadyCaughtSlotChange = true;
           const arcs =  e.target.assignedElements();
           this.renderArcs(arcs);

       });
    }

    renderArcs(arcs) {
      let origial_radius = 50;
      let radius = origial_radius - 2; // add a gap on the left.
      arcs.forEach(arc => {
        const progress = arc.getAttribute('progress');
        const aName = arc.getAttribute('name');
        const color = arc.getAttribute("color")

        var d = " M " + (radius + 5 + radius) + " " + radius;
        d += this.myArc(origial_radius, origial_radius, radius, + progress * 360);
        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
        newElement.setAttribute("d", d); //Set path's data
        newElement.setAttribute("my-name", aName);
        newElement.setAttribute("stroke-width", "0.3rem");
        newElement.setAttribute("fill", "transparent");
        newElement.setAttribute("stroke", arc.getAttribute("color")); //Set stroke colour
        this.$svg.appendChild(newElement);
        radius -= 6;
      });
      var circle = this.$arc;
//      circle.setAttribute("d", d);
    }

    myArc(cx, cy, radius, max) {
      var d = " M " + (cx + radius) + " " + cy;
      var angle=0;
      for (angle = 0; angle < max; angle += 6) {
          var radians= angle * (Math.PI / 180);  // convert degree to radians
          var x = cx + Math.cos(radians) * radius;
          var y = cy + Math.sin(radians) * radius;

          d += " L " + x + " " + y;
      }
      return d;
    }

    myArcMoves(cx, cy, radius, max) {
      var d = " M " + (cx + radius) + " " + cy;
      var angle=0;
      for (angle = 0; angle < max; angle += 3) {
          var radians= angle * (Math.PI / 180);  // convert degree to radians
          var x = cx + Math.cos(radians) * radius;
          var y = cy + Math.sin(radians) * radius;

          d += " L " + x + " " + y;
      }

      return d;
    }

    myArcInterval(cx, cy, radius, max) {
      var circle = this.$arc;
      var e = circle.getAttribute("d");
      var d = " M " + (cx + radius) + " " + cy;
      var angle=0;
      window.myTimer  = window.setInterval(
        () => {
          var radians= angle * (Math.PI / 180);  // convert degree to radians
          var x = cx + Math.cos(radians) * radius;
          var y = cy + Math.sin(radians) * radius;

          d += " L " + x + " " + y;
          circle.setAttribute("d", d)
          if (angle >= max) {
            window.clearInterval(window.myTimer);
            console.log("clear");
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
