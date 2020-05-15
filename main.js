
document.body.style.fontSize = "24pt"

let addReactant = document.createElement("button");
addReactant.type = "button";
addReactant.style.fontSize = "24pt";
addReactant.append("Add Reactant");
//addReactant.style.display = "block";
//addReactant.style.textAlign = "left";
//addReactant.style.marginLeft = "0px";
addReactant.style.position = "fixed";
addReactant.style.top = "10%";
addReactant.style.right = "60%";
document.body.appendChild(addReactant);


let addProduct = document.createElement("button");
addProduct.type = "button";
addProduct.style.fontSize = "24pt";
addProduct.append("Add Product");
//addProduct.style.display = "block";
//addProduct.style.textAlign = "right";
//addProduct.style.marginRight = "0px";
addProduct.style.position = "fixed";
addProduct.style.top = "10%";
addProduct.style.left = "60%";
document.body.appendChild(addProduct);

document.body.appendChild(document.createElement("br"));

let reactionContainer = document.createElement("div");
//reactionContainer.style.textAlign = "center";
reactionContainer.style.position = "fixed";
reactionContainer.style.top = "20%";
reactionContainer.style.left = "50%";
let reaction = new Reaction();
let reactants = document.createElement("span");
let products = document.createElement("span");
let arrow = document.createElement("span");
arrow.appendChild(reaction.getArrowHTML());
reactionContainer.appendChild(reactants);
reactionContainer.appendChild(arrow);
reactionContainer.appendChild(products);

document.body.appendChild(reactionContainer);

reactionContainer.style.marginLeft = `-${reactants.offsetWidth + arrow.offsetWidth / 2}px`;

let reactButton = document.createElement("button");
reactButton.type = "button";
reactButton.style.fontSize = "24pt";
reactButton.append("React");
reactButton.style.position = "fixed";
reactButton.style.top = "30%";
reactButton.style.left = "60%";
document.body.appendChild(reactButton);


let reverseButton = document.createElement("button");
reverseButton.type = "button";
reverseButton.style.fontSize = "24pt";
reverseButton.append("Reverse");
reverseButton.style.position = "fixed";
reverseButton.style.top = "30%";
reverseButton.style.right = "60%";
document.body.appendChild(reverseButton);


let reactionTable = document.createElement("div");
reactionTable.style.position = "fixed";
reactionTable.style.top = "40%";
reactionTable.style.left = "10%";
reactionTable.appendChild(reaction.getTableHTML());

document.body.appendChild(reactionTable);

let modal = document.createElement("div");
modal.style.display = "none";
modal.style.position  = "fixed";
modal.style.zIndex = "1";
modal.style.paddingTop = "100px";
modal.style.top = "0";
modal.style.left = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.overflow = "auto";
modal.style.backgroundColor = "rgba(0,0,0,0.4)";

let modalContent = document.createElement("div");
modalContent.style.backgroundColor = "#fefefe";
modalContent.style.margin = "auto";
modalContent.style.padding = "20px";
modalContent.style.border = "1px solid #888";
modalContent.style.width = "80%";

let close = document.createElement("span");
close.className = "close";
close.innerHTML = "&times;";

modalContent.appendChild(close);

let modalContainer = document.createElement("div");

modalContent.appendChild(modalContainer);

let style = document.createElement('style');

style.innerHTML = `
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
`;

document.head.appendChild(style);

modalContainer.append("hello there");

window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
        modalContainer.childNodes[0].clearInput();
    }
});

close.addEventListener("click", function(){
    modal.style.display = "none";
    modalContainer.childNodes[0].clearInput();
});

modal.append(modalContent);

document.body.append(modal);

let addReactantScreen = document.createElement("div");
addReactantScreen.append("New Reactant");
addReactantScreen.appendChild(document.createElement("br"));
addReactantScreen.appendChild(document.createElement("br"));
addReactantScreen.append("Molecule: ");
let reactantName = document.createElement("input");
reactantName.type = "text";
reactantName.style.fontSize = "24pt";
addReactantScreen.appendChild(reactantName);
addReactantScreen.appendChild(document.createElement("br"));
addReactantScreen.appendChild(document.createElement("br"));
let radioLimitedReactant =  document.createElement("input");
radioLimitedReactant.id = "radioLimitedReactant";
radioLimitedReactant.type = "radio";
radioLimitedReactant.name = "reactantAmount";
radioLimitedReactant.value = "limited";
radioLimitedReactant.checked = true;
addReactantScreen.appendChild(radioLimitedReactant);
let radioLimitedReactantLabel = document.createElement("label");
radioLimitedReactantLabel.htmlFor = "radioLimitedReactant";
radioLimitedReactantLabel.append("Amount: ");
let reactantAmount = document.createElement("input");
reactantAmount.type = "text";
reactantAmount.style.fontSize = "24pt";
reactantAmount.value = "0";
radioLimitedReactantLabel.appendChild(reactantAmount);
let reactantUnit =  document.createElement("select");
reactantUnit.innerHTML = `
<option value="g">g</option>
<option value="kg">kg</option>
<option value="mol">mol</option>
<option value="L">L (gas)</option>
<option value="particles">particles</option>
`;
reactantUnit.style.fontSize =  "24pt";
radioLimitedReactantLabel.appendChild(reactantUnit);
addReactantScreen.appendChild(radioLimitedReactantLabel);
addReactantScreen.appendChild(document.createElement("br"));
let radioExcessReactant = document.createElement("input");
radioExcessReactant.id = "radioExcessReactant";
radioExcessReactant.type = "radio";
radioExcessReactant.name = "reactantAmount";
radioExcessReactant.value = "excess";
addReactantScreen.appendChild(radioExcessReactant);
let radioExcessReactantLabel = document.createElement("label");
radioExcessReactantLabel.htmlFor = "radioExcessReactant";
radioExcessReactantLabel.append("Excess Reactant");
addReactantScreen.appendChild(radioExcessReactantLabel);
addReactantScreen.appendChild(document.createElement("br"));
addReactantScreen.appendChild(document.createElement("br"));
let addReactantButton = document.createElement("button");
addReactantButton.style.fontSize = "24pt";
addReactantButton.append("Add");
addReactantScreen.appendChild(addReactantButton);
addReactantScreen.clearInput = function(){
    reactantName.value = "";
    reactantAmount.value = "0";
    reactantUnit.selectedIndex = 0;
    radioLimitedReactant.checked = true;
};
addReactantButton.addEventListener("click", function(){
    if(radioLimitedReactant.checked)
        reaction.addReactant(new Molecule(reactantName.value), true, parseFloat(reactantAmount.value), reactantUnit.value);
    else
        reaction.addReactant(new Molecule(reactantName.value), false);
    modal.style.display = "none";
    modalContainer.childNodes[0].clearInput();
    reaction.balance();
    reactants.innerHTML = "";
    reactants.appendChild(reaction.getReactantsHTML());
    products.innerHTML = "";
    products.appendChild(reaction.getProductsHTML());
    reactionContainer.style.marginLeft = `-${reactants.offsetWidth + arrow.offsetWidth / 2}px`;
    reactionTable.innerHTML = "";
    reactionTable.appendChild(reaction.getTableHTML());
});

let addProductScreen = document.createElement("div");
addProductScreen.append("New Product");
addProductScreen.appendChild(document.createElement("br"));
addProductScreen.appendChild(document.createElement("br"));
addProductScreen.append("Molecule: ");
let productName = document.createElement("input");
productName.type = "text";
productName.style.fontSize = "24pt";
addProductScreen.appendChild(productName);
addProductScreen.appendChild(document.createElement("br"));
addProductScreen.appendChild(document.createElement("br"));
let radioLimitedProduct =  document.createElement("input");
radioLimitedProduct.id = "radioLimitedProduct";
radioLimitedProduct.type = "radio";
radioLimitedProduct.name = "productAmount";
radioLimitedProduct.value = "limited";
radioLimitedProduct.checked = true;
addProductScreen.appendChild(radioLimitedProduct);
let radioLimitedProductLabel = document.createElement("label");
radioLimitedProductLabel.htmlFor = "radioLimitedProduct";
radioLimitedProductLabel.append("Amount: ");
let productAmount = document.createElement("input");
productAmount.type = "text";
productAmount.style.fontSize = "24pt";
productAmount.value = "0";
radioLimitedProductLabel.appendChild(productAmount);
let productUnit =  document.createElement("select");
productUnit.innerHTML = `
<option value="g">g</option>
<option value="kg">kg</option>
<option value="mol">mol</option>
<option value="L">L (gas)</option>
<option value="particles">particles</option>
`;
productUnit.style.fontSize =  "24pt";
radioLimitedProductLabel.appendChild(productUnit);
addProductScreen.appendChild(radioLimitedProductLabel);
addProductScreen.appendChild(document.createElement("br"));
let radioExcessProduct = document.createElement("input");
radioExcessProduct.id = "radioExcessProduct";
radioExcessProduct.type = "radio";
radioExcessProduct.name = "productAmount";
radioExcessProduct.value = "excess";
addProductScreen.appendChild(radioExcessProduct);
let radioExcessProductLabel = document.createElement("label");
radioExcessProductLabel.htmlFor = "radioExcessProduct";
radioExcessProductLabel.append("Excess Product");
addProductScreen.appendChild(radioExcessProductLabel);
addProductScreen.appendChild(document.createElement("br"));
addProductScreen.appendChild(document.createElement("br"));
let addProductButton = document.createElement("button");
addProductButton.style.fontSize = "24pt";
addProductButton.append("Add");
addProductScreen.appendChild(addProductButton);
addProductScreen.clearInput = function(){
    productName.value = "";
    productAmount.value = "0";
    productUnit.selectedIndex = 0;
    radioLimitedProduct.checked = true;
};
addProductButton.addEventListener("click", function(){
    if(radioLimitedProduct.checked)
        reaction.addProduct(new Molecule(productName.value), true, parseFloat(productAmount.value), productUnit.value);
    else
        reaction.addProduct(new Molecule(productName.value), false);
    modal.style.display = "none";
    modalContainer.childNodes[0].clearInput();
    reaction.balance();
    reactants.innerHTML = "";
    reactants.appendChild(reaction.getReactantsHTML());
    products.innerHTML = "";
    products.appendChild(reaction.getProductsHTML());
    reactionContainer.style.marginLeft = `-${reactants.offsetWidth + arrow.offsetWidth / 2}px`;
    reactionTable.innerHTML = "";
    reactionTable.appendChild(reaction.getTableHTML());
});


addReactant.addEventListener("click", function(){
    modalContainer.innerHTML = "";
    modalContainer.appendChild(addReactantScreen);
    modal.style.display = "block";
});

addProduct.addEventListener("click", function(){
    modalContainer.innerHTML = "";
    modalContainer.appendChild(addProductScreen);
    modal.style.display = "block";
});




