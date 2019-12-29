const template = document.createElement('template');
template.innerHTML = `
<span id="outerNode"> cool arc bro:&nbsp;<span id="textHere"></span></span>

<svg xmlns="http://www.w3.org/2000/svg" style="width:220; height:220;"> 
    <path d="" id="arc" fill="none" stroke="blue" stroke-width="2" />
</svg>
`;

class MultiProgress extends HTMLElement {
   constructor() {
        super(); 

        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.$textHere = this._shadowRoot.querySelector('#textHere');
        this.$outerNode = this._shadowRoot.querySelector('#outerNode');
        this.$arc = this._shadowRoot.querySelector('#arc');
    }

    connectedCallback() {
        console.log("Callback!");
        this._progress = this.getAttribute('progress');
        this._id = this.getAttribute('id');
        if(!this.hasAttribute('color')) {
            console.log("set default to black");
            this.setAttribute('color', 'black');
        } else {
          this.textColor = this.attributes['color'].value;
          console.log("text color ", this.textColor);
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
      this.myArc(110, 110, 100, this._progress * 360);
    }

    myArc(cx, cy, radius, max) {
       //var circle = document.getElementById("arc");
       var circle = this.$arc;
       var e = circle.getAttribute("d");
       var d = " M "+ (cx + radius) + " " + cy;
       var angle=0;
       if (typeof window.myTimer === 'undefined') {
         window.myTimer = [] 
       }
       console.log("this id is ", this._id);
       window.myTimer[this._id]  = window.setInterval(
         () => {
           var radians= angle * (Math.PI / 180);  // convert degree to radians
           var x = cx + Math.cos(radians) * radius;  
           var y = cy + Math.sin(radians) * radius;
          
           d += " L "+x + " " + y;
           circle.setAttribute("d", d)
           if (angle >= max) {
             console.log("clear timer " + angle, this._id);
             window.clearInterval(window.myTimer[this._id]);
           }
           angle++;
         }
       , 5);
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
