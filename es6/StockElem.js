/**
 * Pure ES6 Custom element.
 * <stock-elem title="Shadow DOM" owner="Ajinkya Default"></stock-elem>
 */
class StockElem extends HTMLElement {
  // Fires when an instance of the element is created.
  createdCallback() {
    console.log("Created a web component by title", this.attributes[0].value);
  }

  // Fires when an instance was inserted into the document.
  attachedCallback() {
    
    this.shadow = this.createShadowRoot();
    let template = document.getElementById("stock-elem").content;
    this.shadow.appendChild(template);
    bindData(this);
  }

  // Fires when an instance was removed from the document.
  detachedCallback() {}

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback(attr, oldVal, newVal) {
    console.log("\n\nAttr changed\n\n", attr);
  }
}
function bindData(el){
  
    console.log("\n*** DATA BIND", el);
    
    // Fetch all elements with an 'data-bind' attribute from the shadow DOM:
    let dataBind = el.shadow.querySelectorAll('[data-bind]');
    
    // Iterate them and assign a value from Custom Element attributes:
    for( let i = 0; i < dataBind.length; i ++ ){
      let val = (el.attributes.getNamedItem(dataBind[i].getAttribute("data-bind")));
      if(val) {
        dataBind[i].innerText = val.value; // One way; just display the value
      }
        
    }
    if(!el.dataIsBound)
      el.dataIsBound = true;
  }

// Register the Custom Element:
document.registerElement('stock-elem', StockElem);