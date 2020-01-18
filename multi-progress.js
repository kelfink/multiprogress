const template = document.createElement('template');
template.innerHTML = `
<div class="outer" id="outerNode">
    <span id="textHere"></span></div>
  <svg xmlns="http://www.w3.org/2000/svg" style="width:110; height:110;">
    <path d="M 0 6 L 3 0 L 6 6 L 0 6"/>
    <path d="M 10 16 L 13 10 L 16 16 L 10 16"/>
    <path d="" id="arc" fill="none" stroke="blue" stroke-width="3" />
  </svg>

  <slot>arcs go here</slot>
</div>
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
        this.arcs = [];
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

       // this._renderMultiProgress();

       window.slots = this.shadowRoot.querySelectorAll('slot');
       const assignedNodes = this.shadowRoot.querySelectorAll('slot')[0].assignedNodes();
       
       window.aNodes = assignedNodes;

       const slot = this.shadowRoot.querySelector('slot');
       this.alreadyCaughtSlotChange = 6;
       slot.addEventListener('slotchange', e => {
         // this basically seems to work.  Not sue how safe it is for makign the event process just once
         if (!this.alreadyCaughtSlotChange > 0) {
           this.alreadyCaughtSlotChange = true;
           const arcs =  e.target.assignedElements();
           this.renderArcs(arcs);
           window.arcs = arcs;
         } else {
           console.log("skip", this.alreadyCaughtSlotChange);
           this.alreadyCaughtSlotChange--;
         };
       });
    }

    renderArcs(arcs) {
      let radius = 50
      const fprogress = arcs[0].getAttribute('progress');
      const fname = arcs[0].getAttribute('name');
      //this.myArc(radius + 5, radius + 5, radius, + fprogress * 360, "theone");
      
      var d = " M " + (radius + 5 + radius) + " " + radius;
      arcs.forEach(arc => {
        console.log("An arc named", arc.getAttribute('name'));
        const progress = arc.getAttribute('progress');
        const aName = arc.getAttribute('name');
        //const radius = arc.getAttribute('radius');
        // this.myArc(this.$arc, radius + 5, radius + 5, radius, + progress * 360, "arc" + name  );
        console.log("arc named:" + aName, this.$arc, radius + 5, radius + 5, radius, + progress * 360, progress);
        d += this.myArc(radius + 5, radius + 5, radius, + fprogress * 360, "theone");
        radius -=5
      });
      var circle = this.$arc;
      circle.setAttribute("d", d);
    }

    _renderMultiProgress() {
      this.$textHere.innerHTML = this.textColor;
      this.$outerNode.style = `background:grey;color:${this.textColor}`;
      this.$arc.setAttribute("stroke", this.textColor);
      //this.myArc(this.$arc, this.$radius + 5, this.$radius + 5, this.$radius, this._progress * 360, "arc");

      // A little example of how a nested arc might look.  Can't yet pass info to the component about size/color.
      //
    }

    myArc(cx, cy, radius, max) {
      var d = " M " + (cx + radius) + " " + cy;
      var angle=0;
      for (angle = 0; angle < max; angle += 3) {
          var radians= angle * (Math.PI / 180);  // convert degree to radians
          var x = cx + Math.cos(radians) * radius;
          var y = cy + Math.sin(radians) * radius;

          d += " L " + x + " " + y;
      }

      console.log("single arc appended");
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
