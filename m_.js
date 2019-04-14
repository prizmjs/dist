var Prizm = {};

/* 02 / Without DOM functions
================================= */

Prizm.ajax = ({ url, method, async, success, error, progress}) => { // url: string, method: string, async: boolean, success: function, error: function, progress: function
    method = method || "GET";
    async = async || false;

    var xhr = new XMLHttpRequest();
    xhr.open(method, url, async);
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          success(xhr.response);
        } else {
          error(xhr.status);
        }
      }
    };
    xhr.onerror = function () {
      error(xhr.status);
    };

    if (progress) {
        xhr.addEventListener('progress', function(e) {
			if (e.lengthComputable) {
				progress((e.loaded / e.total)*100);
			}
        });
    }

    xhr.send(null);
};

Prizm.get = param => { // param: string
    var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
};

Prizm.setCookie = (cname, cvalue, exdays) => { // cname: string, cvalue: string, exdays: number
    let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));

    let expires = "expires="+ d.toUTCString();

    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

Prizm.getCookie = cname => { // cname: string
    let name = cname + "=",
		decodedCookie = decodeURIComponent(document.cookie),
		ca = decodedCookie.split(';');

	for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}

		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}

	return "";
};

Prizm.log = (message, state) => { // message: string, state: string (success || error)
	if (typeof message === "string") {
		switch (state){
			case 'error': console.log("%c  • "+message+"    ", "font-family: 'Arial', sans-serif; color: #fff; background-color: #e54e4e; font-size: 1.8em;"); break;
			case 'success': console.log("%c  • "+message+"    ", "font-family: 'Arial', sans-serif; color: #fff; background-color: #37c667; font-size: 1.7em;"); break;
			default: console.log("%c  • "+message+"    ", "font-family: 'Arial', sans-serif; color: #111; background-color: #fff; border-radius: 4px; font-size: 1.7em;"); break;
		}
	} else if (typeof message === "number") {
		switch (state){
			case 'error': console.log("%c  • "+message+"    ", "font-family: 'Arial', sans-serif; color: #fff; background-color: #e54e4e; font-size: 1.8em;"); break;
			case 'success': console.log("%c  • "+message+"    ", "font-family: 'Arial', sans-serif; color: #fff; background-color: #37c667; font-size: 1.7em;"); break;
			default: console.log("%c  • "+message+"    ", "font-family: 'Arial', sans-serif; color: #017a3d; background-color: #abfcc1; border-radius: 4px; font-size: 1.7em;"); break;
		}
	} else {
	  switch (state){
		case 'error': console.error(message); break;
		case 'success': console.log(message); break;
		default:
		
			if (typeof message == "object") {
				if (message.selector != undefined) {
					message.log();
					return;
				} else if ((typeof message==="object") && (message.nodeType===1) && (typeof message.style === "object") && (typeof message.ownerDocument ==="object")) {
					Prizm(message).log();
				}
			}

			console.log(message);
		break;
	  }
	}
},

Prizm.browser = (request) => { // request: string
	let browserName;
	
	if ((window.opr&&opr.addons) || window.opera || (navigator.userAgent.indexOf(' OPR/') >= 0 )) browserName = "Opera";
	if (typeof InstallTrigger !== 'undefined') browserName="Firefox";
	if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) browserName="Safari";
	if ((/*@cc_on!@*/false) || (document.documentMode)) browserName="IE";
	if (!(document.documentMode) && window.StyleMedia) browserName = "Edge";
	if (window.chrome && window.chrome.webstore) browserName="Chrome";

	if (request){
		return request.toLowerCase() == browserName.toLowerCase();
	} else {
		return browserName;
	}
};

Prizm.screen = length => { // length: string (width || height)
	if (length == 'width'){
		return window.innerWidth;
	} else if (length == 'height'){
		return window.innerHeight;
	} else {
		return window.innerWidth+"*"+window.innerHeight;
	}
};

Prizm.lang = request => { // request: string
	let lang = navigator.language || navigator.userLanguage;
		lang = lang.toLowerCase();
		
	if (request != undefined){
		return request.toLowerCase() == lang;
	} else {
		return lang;
	}
};

Prizm.os = request => { // request: string
	let os;
	
	if (navigator.appVersion.indexOf('Win')!=-1) os = 'Windows';
	if (navigator.appVersion.indexOf('Mac')!=-1) os = 'MacOS';
	if (navigator.appVersion.indexOf('X11')!=-1) os = 'UNIX';
	if (navigator.appVersion.indexOf('Linux')!=-1) os = 'Linux';

	if (request != undefined){
		return request.toLowerCase() == os.toLowerCase();
	} else {
		return os;
	}
};

Prizm.date = (request, addZero) => { // request: string, addZero: boolean
	let t = new Date();

	switch (request) {
		case "year": return t.getFullYear();
		case "date": return t.getDate();
		case "month": return addZero ? t.getMonth() +1 < 10 ? "0"+(t.getMonth() +1) : t.getMonth() +1 : t.getMonth() +1;
		case "utc": return t.toUTCString();
		case "iso": return t.toISOString();
		case "hours": return  addZero ? t.getHours() < 10 ? "0"+t.getHours() : t.getHours() : t.getHours();
		case "minutes": return  addZero ? t.getMinutes() < 10 ? "0"+t.getMinutes() : t.getMinutes() : t.getMinutes();
		case "seconds": return  addZero ? t.getSeconds() < 10 ? "0"+t.getSeconds() : t.getSeconds() : t.getSeconds();
		case "day": return  addZero ? t.getDay() < 10 ? "0"+t.getDay() : t.getDay() : t.getDay();
		case "milliseconds": return t.getMilliseconds();
		case "time": return t.getTime();
		default: return t.getTime();
	}
};

Prizm.isMobile = request => { // request: boolean
	let isMobile = /^AndroidPrizm|^webOSPrizm|^iPhonePrizm|^iPadPrizm|^iPodPrizm|^BlackBerryPrizm|^Windows PhonePrizm/i.test(navigator.userAgent);

	if (request != undefined){
		return request == isMobile;
	} else { 
		return isMobile;
	}
};

Prizm.title = title => { // title: string || number
	if (title){ // Si le paramètre "title" existe
		document.title = title; // Modification du titre de la fenêtre
	}

		// De toute façon
	return document.title; // On retourne la titre actuel
};

Prizm.print = () => {
	if (window.print){ // Si "window.print" existe
		window.print(); // Alors on affiche la boîte de dialogue pour imprimer la page
	}
};

Prizm.history = go => { // go: number || string
	if (go == 'back'){ // Si le paramètre go est égal à "back"
		window.history.back(); // On recule dans l'historique
	} else if (go == 'forward'){ // Sinon si le paramètre go est égal à "forward"
		window.history.forward(); // On avance dans l'historique
	} else if (typeof go === "number"){ // Sinon si le paramètre go est un nombre
		window.history.go(go); // On se déplace dans l'historique de "go" fois
	}
};

Prizm.popup = (url, name, height, width) => { // url: string, name: string, height: number || string, width: number || string
	if (url && name && height && width){ // Si tous les paramètres sont présents
		window.open(url, name,+"menubar=no, status=no, scrollbars=no, menubar=no, width="+width+", height="+height); // Alors lancement de la fenêtre popup
	}
};

Prizm.url = url => { // url: string
	if (url){ // Si le paramètre "url" est défini
		document.location.href = url; // Alors on redirige vers l'url précisée
	}
		// De toute façon
	return document.location.href; // On retourne l'url actuelle
};

Prizm.ready = cb => { // cb: function
	document.addEventListener('DOMContentLoaded', cb); // Quand la page est chargée, lance le callback "cb()"
};

var _ = Prizm;

console.log("%cRadius.js", "color: #333; font-size: 30px; padding: 5px 20px; line-height: 50px; background-color: #fff; border-radius: 6px; border: 2px solid rgba(0, 0, 0, .2);");