Element.prototype.isNodeList = function() {return false;};
NodeList.prototype.isNodeList = HTMLCollection.prototype.isNodeList = function(){return true;};

function Prizm(q, ctx) {
    if (!(this instanceof Prizm)) return new Prizm(q, ctx);

    if (typeof q == "function") {
        Prizm.ready(q);
    } else if (typeof q != "undefined") {

            // Check si le sélecteur est un string ou un élément DOM
        if ((typeof q==="object") && (q.nodeType===1) && (typeof q.style === "object") && (typeof q.ownerDocument ==="object")) {
            this.selector = [q];
        } else if (q.isNodeList) {
            this.selector = q;
        } else if ((typeof q === "object") && q.selector) {
            this.selector = [q.selector];
        } else {
            this.selector = (ctx || document).querySelectorAll(q) || false;
        }
    } else {
        return false;
    }

    this.log = () => {
		if (this.selector.length == 1) {
			console.log(this.selector[0]);
		} else {
			console.log(this.selector);
		}
	};

    this.each = cb =>{
        return this.selector.forEach(el => {
            return cb(el);
        });
	};

    this.first = cb =>{
		if (cb) {
			return cb(this.selector[0]);
		}

        return this.selector[0];
	};
	
	this.last = cb =>{
		if (cb) {
			return cb(this.selector[this.selector.length -1]);
		}

        return this.selector[this.selector.length -1];
    };

    this.array = cb => {
        let val = [];

        this.each(el => {
            if (cb) {
                val.push(cb(el));
            } else {
                val.push(el.innerHTML);
            }
        });

        return val;
    };

    this.addClass = (className) => {
        return this.each(el => {
            el.classList.add(className);
        });
    };

    this.removeClass = (className) => {
        return this.each(el => {
			el.classList.remove(className);
        });
	};

	this.toggleClass = (className) => {
		if (this.hasClass(className)){
			this.removeClass(className);
		} else {
			this.addClass(className);
		}
	};

    this.hasClass = (className) => {
        return this.first(el => {
            return el.classList.contains(className);
        });
    };

    this.remove = () => {
        return this.each(function (node) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });
    };

    this.attr = (name, value, data) => {
        let a;
            data = data ? 'data-' : '';

        if (value) {
            this.each(el => {
                if (value) {
                    el.setAttribute(data + name, value);
                }
            });
        }

        this.first(el => {
            a = el.getAttribute(data + name);
        });

        return a;
	};

    this.data = (name, value) => {
        this.attr(name, value, true);
    };

    this.on = (event, cb) => {
        switch(event){
            case "leave": event = "mouseleave"; break;
            case "down": event = "mousedown"; break;
            case "enter": event = "mouseenter"; break;
            case "hover": event = "mouseover"; break;
        }

        this.first(el => {
            el.addEventListener(event, e => {
                cb();
            });
        });
    };

    this.hover = (fn) => { this.on('hover', fn); };
    this.click = (fn) => { this.on('click', fn); };
    this.enter = (fn) => { this.on('enter', fn); };
    this.leave = (fn) => { this.on('leave', fn); };
    this.focus = (fn) => { this.on('focus', fn); };
    this.blur = (fn) =>{ this.on('blur', fn); };

    this.off = (event) => {
        this.each(el => {
            el.removeEventListener(event);
        });
    };

    this.html = (str) => {
        if (str) {
            this.each(el => {
                el.innerHTML = str;
            });
        } else {
            let a;
            this.first(el => {
                a = el.innerHTML;
            });
            
            return a;
        }
    };

    this.css = (property, value) => {
        if (typeof property === "object") {
            let keys = Object.keys(property);
            this.each(el => {
                for (let i = 0; i<keys.length; i++) {
                    el.style.setProperty(keys[i], property[keys[i]]);
                }
            });
        }
      
        if (typeof property === "string") {
        	if (typeof value === "undefined") {
				let a;
                this.first(el => {
        		    a = el.style[property];
                }); return a;
        	} else if (typeof value === "string"){
            this.each(function(node) {
            	node.style[property] = value;
			});
			
			return value;
        	}
        }
	};
	
	this.scrollTo = () => {
		this.first().scrollIntoView({ behavior: 'smooth' }); // Essaie le Scroll adouci si il est disponible
    };
    
    this.val = (value) => { // value: string || boolean
        if (value) {
            this.each(el => {
                el.value = value;
			});
			
			return value;
        } else {
            let a;
            this.first(el => {
                a = el.value;
            });

            return a;
        }
	};

	this.is = (selector) => {
		return this.filter(selector).length > 0;
	};

	this.filter = (selector) => {

		var callback = (node) => {
			node.matches = node.matches || node.msMatchesSelector || node.webkitMatchesSelector; // Make it compatible with some other browsers

			// Check if it's the same element (or any element if no selector was passed)
			return node.matches(selector || '*');
		}, out = [];

		if (selector instanceof Prizm) {
			return this.first() == selector.first();
		}

		for (var i = 0; i < this.selector.length; i++) {
			if (callback(this.selector[i])) {
				out.push(this.selector[i]);
			}
		}

		return out;
	};
}

const _ = Prizm;

console.log("%cRadius.js", "color: #333; font-size: 30px; padding: 5px 20px; line-height: 50px; background-color: #fff; border-radius: 6px; border: 2px solid rgba(0, 0, 0, .2);");