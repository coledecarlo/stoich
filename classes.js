
const ONE_WAY = "→";
const EQUILIBRIUM = "⇌";


/**@returns {string}*/ function get_raw(/*string*/ url){
    /**@type {XMLHttpRequest}*/ const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    return request.responseText
}

const periodic_table_data = /*{"elements": []}*/JSON.parse(get_raw("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json"));

let elementsMap = new Map();
for(let element of periodic_table_data.elements){
    elementsMap.set(element.symbol, element);
}


/*immutable*/class IntegerValue{
    /**@returns {void}*/constructor(/*number*/ x) {
        /**@type {number}*/this.value = Math.trunc(x);
        /**@type {string}*/this.type = "integer";
    }
    /**@returns {IntegerValue}*/negative(){
        return new IntegerValue(-this.value);
    }
    /**@returns {IntegerValue}*/add(/*IntegerValue*/ x){
        return new IntegerValue(this.value + x.value);
    }
    /**@returns {IntegerValue}*/subtract(/*IntegerValue*/ x){
        return new IntegerValue(this.value - x.value);
    }
    /**@returns {IntegerValue}*/multiply(/*IntegerValue*/ x){
        return new IntegerValue(this.value * x.value);
    }
    /**@returns {IntegerValue}*/divide(/*IntegerValue*/ x){
        if(this.value % x.value === 0)
            return new IntegerValue(this.value / x.value);
        return null;
    }
    /**@returns {IntegerValue}*/modulo(/*IntegerValue*/ x){
        return new IntegerValue(this.value % x.value);
    }
    /**@returns {RationalValue}*/getRational(){
        return new RationalValue(this, new IntegerValue(1));
    }
    /**@returns {string}*/toString(){
        return Number(this.value).toString();
    }
}

/*immutable*/class RationalValue{
    /**@returns {void}*/constructor(/*IntegerValue*/x, /*IntegerValue*/y) {
        /**@type {IntegerValue}*/this.numerator = x;
        /**@type {IntegerValue}*/this.denominator = y;
        /**@type {string}*/this.type = "rational";
    }
    /**@returns {RationalValue}*/inverse(){
        return new RationalValue(this.denominator, this.numerator);
    }
    /**@returns {RationalValue}*/negative(){
        return new RationalValue(this.numerator.negative(), this.denominator);
    }
    /**@returns {RationalValue}*/simplify(){
        /**@type {IntegerValue}*/let gcdValue = gcd(this.numerator.getRational(), this.denominator.getRational()).getInt();
        return new RationalValue(this.numerator.divide(gcdValue), this.denominator.divide(gcdValue));
    }
    /**@returns {RationalValue}*/add(/*IntegerValue|RationalValue*/x){
        switch(x.type){
            case "integer":
                return new RationalValue(this.numerator.add(x.multiply(this.denominator)), this.denominator);
            case "rational":
                return new RationalValue(this.numerator.multiply(x.denominator).add(x.numerator.multiply(this.denominator)), this.denominator.multiply(x.denominator));
        }
    }
    /**@returns {RationalValue}*/subtract(/*IntegerValue|RationalValue*/x){
        return this.add(x.negative());
    }
    /**@returns {RationalValue}*/multiply(/*IntegerValue|RationalValue*/x){
        switch(x.type){
            case "integer":
                return new RationalValue(this.numerator.multiply(x), this.denominator);
            case "rational":
                return new RationalValue(this.numerator.multiply(x.numerator), this.denominator.multiply(x.denominator));
        }
    }
    /**@returns {RationalValue}*/divide(/*IntegerValue|RationalValue*/x){
        switch(x.type){
            case "integer":
                return new RationalValue(this.numerator, this.denominator.multiply(x));
            case "rational":
                return this.multiply(x.inverse());
        }
    }
    /**@returns {RationalValue}*/modulo(/*IntegerValue|RationalValue*/x){
        switch(x.type){
            case "integer":
                return this.modulo(new RationalValue(x, new IntegerValue(1)));
            case "rational":
                return new RationalValue(this.numerator.multiply(x.denominator).modulo(x.numerator.multiply(this.denominator)), this.denominator.multiply(x.denominator));
        }
    }
    /**@returns {boolean}*/isInt(){
        return this.numerator.value % this.denominator.value === 0;
    }
    /**@returns {IntegerValue}*/getInt(){
        return this.numerator.divide(this.denominator);
    }
    /**@returns {string}*/toString(){
        return this.numerator.toString() + "/" + this.denominator.toString();
    }
}

/*mutable*/class Matrix{
    /**@returns {void}*/constructor(/*Array<Array<RationalValue>>*/x){
        /**@type {Array<Array<RationalValue>>}*/this.data = x;
    }
    /*
    INPUT: n×m matrix A.
    OUTPUT: n×m matrix in reduced row echelon form.
        Set j←1.
        For each row i from 1 to n do
            While column j has all zero elements, set j←j+1. If j>m return A.
            If element aij is zero, then interchange row i with a row x>i that has axj≠0.
            Divide each element of row i by aij, thus making the pivot aij equal to one.
            For each row k from 1 to n, with k≠i, subtract row i multiplied by akj from row k.
        Return transformed matrix A.
     */
    /**@returns {void}*/toReducedRowEchelonForm(){
        let n = this.data.length;
        let m = this.data[0].length;
        let j = 0;
        for(let i = 0; i < n; i++){
            let isZero = true;
            for(let k = i; k < n; k++)
                if(this.data[k][j].numerator.value !== 0)
                    isZero = false;
            while(isZero){
                j++;
                if(j >= m)
                    return;
                for(let k = i; k < n; k++)
                    if(this.data[k][j].numerator.value !== 0)
                        isZero = false;
            }
            if(this.data[i][j].numerator.value === 0)
                for(let x = i; x < n; x++)
                    if(this.data[x][j].numerator.value !== 0){
                        /**@type {Array<RationalValue>}*/let temp = this.data[i];
                        this.data[i] = this.data[x];
                        this.data[x] = temp;
                        break;
                    }
            /**@type {RationalValue}*/let temp = this.data[i][j];
            for(let l = 0; l < m; l++)
                this.data[i][l] = this.data[i][l].divide(temp).simplify();
            for(let k = 0; k < n; k++)
                if(k !== i) {
                    temp = this.data[k][j];
                    for (let l = 0; l < m; l++)
                        this.data[k][l] = this.data[k][l].subtract(this.data[i][l].multiply(temp)).simplify();
                }
            console.log(this.toString());
        }
    }
    /**@returns {string}*/toString(){
        /**@type {string}*/let result = "";
        for(let i = 0; i < this.data.length; i++){
            for(let j = 0; j < this.data[i].length; j++){
                result += this.data[i][j] + " ";
            }
            result += "\n";
        }
        return result;
    }

}

/*immutable*/class Element{
    /**@returns {void}*/constructor(/*string*/str){
        /**@type {string}*/this.symbol = str;
        /**@type {string}*/this.type = "element";
    }
    getMass(){
        return elementsMap.get(this.symbol).atomic_mass;
    }
    /**@returns {HTMLSpanElement}*/getHTML(){
        /**@returns {HTMLSpanElement}*/let result = document.createElement("span");
        result.append(this.symbol);
        return result;
    }
}

/*immutable*/class Molecule{
    /**@returns {void}*/constructor(/*string*/str){
        /**@type {Array<Molecule|Element>}*/this.parts = [];
        /**@type {Array<number>}*/this.counts = [];
        /**@type {Set<string>}*/this.elements = new Set();
        /**@type {string}*/this.type = "molecule";
        /**@type {string}*/let word = "";
        /**@type {string}*/let wordCount = "";
        /**@type {string}*/let wordType = "new";
        /**@type {boolean}*/let counting = false;
        /**@returns {string}*/function charType(/*string*/c){
            /**@type {number}*/let code = c.charCodeAt(0);
            if(code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0))
                return "lower";
            if(code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0))
                return "upper";
            if(code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0))
                return "digit";
            if(c === "(")
                return "open";
            if(c === ")")
                return "close";
            return "other;"
        }
        str += "_";
        for(let i = 0; i < str.length; i++){
            switch(wordType){
                case "new":
                    switch(charType(str.charAt(i))){
                        case "upper":
                            word += str.charAt(i);
                            wordType = "element";
                            break;
                        case "open":
                            wordType = "molecule";
                            break;
                        default:
                    }
                    break;
                case "element":
                    switch(charType(str.charAt(i))){
                        case "lower":
                            word += str.charAt(i);
                            break;
                        case "digit":
                            wordCount += str.charAt(i);
                            break;
                        default:
                            this.parts.push(new Element(word));
                            this.elements.add(word);
                            if(wordCount.length === 0)
                                this.counts.push(1);
                            else
                                this.counts.push(parseInt(wordCount));
                            word = "";
                            wordCount = "";
                            wordType = "new";
                            i--;
                    }
                    break;
                case "molecule":
                    if(!counting) {
                        /**@type {number}*/let parIndex = 1;
                        while (parIndex !== 0) {
                            word += str.charAt(i);
                            i++;
                            if (str.charAt(i) === "(")
                                parIndex++;
                            if (str.charAt(i) === ")")
                                parIndex--;
                        }
                        i++;
                        counting = true;
                    }
                    switch(charType(str.charAt(i))){
                        case "digit":
                            wordCount += str.charAt(i);
                            break;
                        default:
                            this.parts.push(new Molecule(word));
                            this.elements = new Set([...this.elements, ...new Molecule(word).elements]);
                            if(wordCount.length === 0)
                                this.counts.push(1);
                            else
                                this.counts.push(parseInt(wordCount));
                            word = "";
                            wordCount = "";
                            wordType = "new";
                            i--;
                            counting = false;
                    }
                    break;
                default:
            }
        }
        /**@type {Map<string, number>}*/this.elementCounts = new Map();
        for(let x of this.elements){
            this.elementCounts.set(x, 0);
        }
        for(let i = 0; i < this.parts.length; i++){
            if(this.parts[i].type === "molecule"){
                for(let k of this.parts[i].elementCounts.keys()){
                    this.elementCounts.set(k, this.elementCounts.get(k) + this.parts[i].elementCounts.get(k) * this.counts[i]);
                }
            }
            else{
                this.elementCounts.set(this.parts[i].symbol, this.elementCounts.get(this.parts[i].symbol) + this.counts[i]);
            }
        }



    }

    /**@returns {HTMLSpanElement}*/getHTML(){
        /**@returns {HTMLSpanElement}*/let result = document.createElement("span");
        for(let i = 0; i < this.parts.length; i++){
            /**@returns {HTMLSpanElement}*/let part = document.createElement("span");
            if(this.parts[i].type === "molecule")
                part.append("(");
            part.appendChild(this.parts[i].getHTML());
            if(this.parts[i].type === "molecule")
                part.append(")");
            result.appendChild(part);
            if(this.counts[i] > 1) {
                /**@returns {HTMLElement}*/let count = document.createElement("sub");
                count.append(this.counts[i].toString());
                result.appendChild(count);
            }
        }
        return result;
    }

    /**@returns {number}*/getElementCount(/*string*/symbol){
        if(this.elementCounts.has(symbol))
            return this.elementCounts.get(symbol);
        return 0;
    }

    getMass(){
        let mass = 0;
        for(let symbol of this.elementCounts.keys())
            mass += this.elementCounts.get(symbol) * new Element(symbol).getMass();
        return mass;
    }

}

/*mutable*/class Reaction{
    /**@returns {void}*/constructor(){
        /**@type {Array<Molecule>}*/this.reactants = [];
        /**@type {Array<Molecule>}*/this.products = [];
        /**@type {Array<number>}*/this.reactantCounts = [];
        /**@type {Array<number>}*/this.productCounts = [];
        /**@type {Array<boolean>}*/this.reactantLimits = [];
        /**@type {Array<boolean>}*/this.productLimits = [];
        /**@type {Array<number>}*/this.reactantAmounts = [];
        /**@type {Array<number>}*/this.productAmounts = [];
        /**@type {Array<string>}*/this.reactantUnits = [];
        /**@type {Array<string>}*/this.productUnits = [];
        /**@type {Set<string>}*/this.elements = new Set();
        /**@type {string}*/this.type = "one-directional";

    }
    /**@returns {void}*/addReactant(/*Molecule*/molecule, /*boolean*/isLimited, /*number?*/amount, /*string?*/unit){
        this.reactants.push(molecule);
        this.reactantCounts.push(0);
        this.reactantLimits.push(isLimited);
        this.elements = new Set([...this.elements, ...molecule.elements]);
        if(isLimited){
            this.reactantAmounts.push(amount);
            this.reactantUnits.push(unit);
        }
        else{
            this.reactantAmounts.push(0);
            this.reactantUnits.push("");
        }
    }
    /**@returns {void}*/addProduct(/*Molecule*/molecule, /*boolean*/isLimited, /*number*/amount, /*string*/unit){
        this.products.push(molecule);
        this.productCounts.push(0);
        this.productLimits.push(isLimited);
        this.elements = new Set([...this.elements, ...molecule.elements]);
        if(isLimited){
            this.productAmounts.push(amount);
            this.productUnits.push(unit);
        }
        else{
            this.productAmounts.push(0);
            this.productUnits.push("");
        }
    }
    /**@returns {void}*/balance(){
        /**@type {Array<Array<RationalValue>>}*/let data = [];
        for(let element of this.elements){
            /**@type {Array<RationalValue>}*/let row = [];
            for(let reactant of this.reactants){
                row.push(new RationalValue(new IntegerValue(reactant.getElementCount(element)), new IntegerValue(1)));
            }
            for(let product of this.products){
                row.push(new RationalValue(new IntegerValue(-product.getElementCount(element)), new IntegerValue(1)));
            }
            row.push(new RationalValue(new IntegerValue(0), new IntegerValue(1)));
            data.push(row);
        }
        /**@type {Array<RationalValue>}*/let row = [];
        row.push(new RationalValue(new IntegerValue(1), new IntegerValue(1)));
        for(let i = 1; i < this.reactants.length; i++){
            row.push(new RationalValue(new IntegerValue(0), new IntegerValue(1)));
        }
        for(let i = 0; i < this.products.length; i++){
            row.push(new RationalValue(new IntegerValue(0), new IntegerValue(1)));
        }
        row.push(new RationalValue(new IntegerValue(1), new IntegerValue(1)));
        data.push(row);
        /**@type {Matrix}*/let A = new Matrix(data);
        console.log(A.toString());
        A.toReducedRowEchelonForm();
        console.log(A.toString());
        let gcdValue = new RationalValue(new IntegerValue(0), new IntegerValue(1));
        for(let i = 0; i < A.data.length; i++){
            gcdValue = gcd(gcdValue, A.data[i][A.data[i].length - 1]);
        }

        for(let i = 0; i < A.data.length; i++){
            console.log(A.data[i][A.data[i].length - 1].divide(gcdValue).getInt().value)
        }

        let i = 0;
        for(let j = 0; j < this.reactantCounts.length; j++, i++){
            this.reactantCounts[j] = A.data[i][A.data[i].length - 1].divide(gcdValue).getInt().value;
        }
        for(let j = 0; j < this.productCounts.length; j++, i++){
            this.productCounts[j] = A.data[i][A.data[i].length - 1].divide(gcdValue).getInt().value;
        }
    }

    /**@returns {void}*/react(){
        this.balance();
        switch(this.type){
            case "one-directional":
                let reactantMoles = [];
                let reactantMolesRxN = [];
                for(let i = 0; i < this.reactants.length; i++){
                    switch(this.reactantUnits[i]){
                        case "kg":
                            reactantMoles.push(this.reactantAmounts[i] / this.reactants[i].getMass() * 1000);
                            break;
                        case "g":
                            reactantMoles.push(this.reactantAmounts[i] / this.reactants[i].getMass());
                            break;
                        case "mol":
                            reactantMoles.push(this.reactantAmounts[i]);
                            break;
                        case "L":
                            reactantMoles.push(this.reactantAmounts[i] / 22.4);
                            break;
                        case "particles":
                            reactantMoles.push(this.reactantAmounts[i] / 6.022e23);
                            break;
                    }
                    reactantMolesRxN.push(reactantMoles[i] / this.reactantCounts[i]);
                }
                let productMoles = [];
                let productMolesRxN = [];
                for(let i = 0; i < this.products.length; i++){
                    switch(this.productUnits[i]){
                        case "kg":
                            productMoles.push(this.productAmounts[i] / this.products[i].getMass() * 1000);
                            break;
                        case "g":
                            productMoles.push(this.productAmounts[i] / this.products[i].getMass());
                            break;
                        case "mol":
                            productMoles.push(this.productAmounts[i]);
                            break;
                        case "L":
                            productMoles.push(this.productAmounts[i] / 22.4);
                            break;
                        case "particles":
                            productMoles.push(this.productAmounts[i] / 6.022e23);
                            break;
                    }
                    productMolesRxN.push(productMoles[i] / this.productCounts[i]);
                }
                if(reactantMolesRxN.length === 0)
                    return;
                let molesRxN = reactantMolesRxN[0];
                for(let i = 1; i < reactantMolesRxN.length; i++)
                    if(reactantMolesRxN[i] < molesRxN)
                        molesRxN = reactantMolesRxN[i];
                for(let i = 0; i < reactantMolesRxN.length; i++)
                    if(this.reactantLimits[i])
                        reactantMolesRxN[i] -= molesRxN;
                for(let i = 0; i < productMolesRxN.length; i++)
                    if(this.productLimits[i])
                        productMolesRxN[i] += molesRxN;
                for(let i = 0; i < this.reactants.length; i++){
                    reactantMoles[i]  = reactantMolesRxN[i] * this.reactantCounts[i];
                    switch(this.reactantUnits[i]){
                        case "kg":
                            this.reactantAmounts[i] = reactantMoles[i] / 1000 * this.reactants[i].getMass();
                            break;
                        case "g":
                            this.reactantAmounts[i] = reactantMoles[i] * this.reactants[i].getMass();
                            break;
                        case "mol":
                            this.reactantAmounts[i] = reactantMoles[i];
                            break;
                        case "L":
                            this.reactantAmounts[i] = reactantMoles[i] * 22.4;
                            break;
                        case "particles":
                            this.reactantAmounts[i] = reactantMoles[i] * 6.022e23;
                            break;
                    }
                }
                for(let i = 0; i < this.products.length; i++){
                    productMoles[i]  = productMolesRxN[i] * this.productCounts[i];
                    switch(this.productUnits[i]){
                        case "kg":
                            this.productAmounts[i] = productMoles[i] / 1000 * this.products[i].getMass();
                            break;
                        case "g":
                            this.productAmounts[i] = productMoles[i] * this.products[i].getMass();
                            break;
                        case "mol":
                            this.productAmounts[i] = productMoles[i];
                            break;
                        case "L":
                            this.productAmounts[i] = productMoles[i] * 22.4;
                            break;
                        case "particles":
                            this.productAmounts[i] = productMoles[i] * 6.022e23;
                            break;
                    }
                }
                break;
        }
    }

    /**@returns {void}*/reverse(){
        this.balance();
        switch(this.type){
            case "one-directional":
                let productMoles = [];
                let productMolesRxN = [];
                for(let i = 0; i < this.products.length; i++){
                    switch(this.productUnits[i]){
                        case "kg":
                            productMoles.push(this.productAmounts[i] / this.products[i].getMass() * 1000);
                            break;
                        case "g":
                            productMoles.push(this.productAmounts[i] / this.products[i].getMass());
                            break;
                        case "mol":
                            productMoles.push(this.productAmounts[i]);
                            break;
                        case "L":
                            productMoles.push(this.productAmounts[i] / 22.4);
                            break;
                        case "particles":
                            productMoles.push(this.productAmounts[i] / 6.022e23);
                            break;
                    }
                    productMolesRxN.push(productMoles[i] / this.productCounts[i]);
                }
                break;
        }
    }

    /**@returns {HTMLSpanElement}*/getReactantsHTML(){
        /**@returns {HTMLSpanElement}*/let result = document.createElement("span");
        for(let i = 0; i < this.reactants.length; i++){
            if(this.reactantCounts[i] > 1)
                result.append(this.reactantCounts[i].toString());
            result.appendChild(this.reactants[i].getHTML());
            if(i < this.reactants.length - 1)
                result.append(" + ");
        }
        return result;
    }
    /**@returns {HTMLSpanElement}*/getProductsHTML(){
        /**@returns {HTMLSpanElement}*/let result = document.createElement("span");
        for(let i = 0; i < this.products.length; i++){
            if(this.productCounts[i] > 1)
                result.append(this.productCounts[i].toString());
            result.appendChild(this.products[i].getHTML());
            if(i < this.products.length - 1)
                result.append(" + ");
        }
        return result;
    }
    /**@returns {HTMLSpanElement}*/getArrowHTML(){
        /**@returns {HTMLSpanElement}*/let result = document.createElement("span");
        switch(this.type){
            case "one-directional":
                result.append(" " + ONE_WAY + " ");
                break;
        }
        return result;
    }

    /**@returns {HTMLDivElement}*/getTableHTML(){
        /**@returns {HTMLDivElement}*/let result = document.createElement("div");

        let table = document.createElement("table");
        table.innerHTML += `<tr><td>Reactants</td></tr>`;
        for(let i = 0; i < this.reactants.length; i++){
            let row = document.createElement("tr");
            let name = document.createElement("td");
            name.appendChild(this.reactants[i].getHTML());
            row.appendChild(name);
            row.innerHTML += "<td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>";
            let value = document.createElement("td");
            if(this.reactantLimits[i]){
                value.append(this.reactantAmounts[i].toFixed(3));
                value.append(" " + this.reactantUnits[i]);
            }
            else
                value.append("excess");
            row.appendChild(value);
            table.appendChild(row);
        }
        table.innerHTML += `<tr><td>&nbsp;</td></tr><tr><td>Products</td></tr>`;
        for(let i = 0; i < this.products.length; i++){
            let row = document.createElement("tr");
            let name = document.createElement("td");
            name.appendChild(this.products[i].getHTML());
            row.appendChild(name);
            row.innerHTML += "<td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>";
            let value = document.createElement("td");
            if(this.productLimits[i]){
                value.append(this.productAmounts[i].toFixed(3));
                value.append(" " + this.productUnits[i]);
            }
            else
                value.append("excess");
            row.appendChild(value);
            table.appendChild(row);
        }
        result.appendChild(table);
        return result;
    }

}

/**@returns {boolean}*/function isZeros(/*Array<RationalValue>*/ x){
    /**@type {boolean}*/let result = true;
    for(let y of x)
        if(y.numerator.value !== 0)
            result = false;
    return result;
}

/**@returns {RationalValue}*/function gcd(/*RationalValue*/ x, /*RationalValue*/ y){
    if(y.numerator.value === 0)
        return x;
    return gcd(y, x.modulo(y));
}


