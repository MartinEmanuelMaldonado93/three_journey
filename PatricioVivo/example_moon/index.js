let canvas = document.getElementById("glslCanvas");
let sandbox = new GlslCanvas(canvas);
let texCounter = 0;
let sandbox_content = "";
let sandbox_title = "";
let sandbox_author = "";
let sandbox_thumbnail = "";
canvas.style.width = "100%";
canvas.style.height = "100%";

function parseQuery(qstr) {
	let query = {};
	let a = qstr.split("&");
	for (let i in a) {
		let b = a[i].split("=");
		query[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
	}
	return query;
}

function load(url) {
	// Make the request and wait for the reply
	fetch(url)
		.then(function (response) {
			// If we get a positive response...
			if (response.status !== 200) {
				console.log("Error getting shader. Status code: " + response.status);
				return;
			}
			// console.log(response);
			return response.text();
		})
		.then(function (content) {
			sandbox_content = content;
			sandbox.load(content);

			let title = addTitle();
			let author = addAuthor();
			if (title === "unknown" && author === "unknown") {
				document.getElementById("credits").style.visibility = "hidden";
			} else {
				document.getElementById("credits").style.visibility = "visible";
			}

			addMeta({
				title: title + " by " + author,
				type: "website",
				url: window.location.href,
				image: sandbox_thumbnail,
			});
		});
}

function addTitle() {
	let result = sandbox_content.match(
		/\/\/\s*[T|t]itle\s*:\s*([\w|\s|\@|\(|\)|\-|\_]*)/i
	);
	if (result && !(result[1] === " " || result[1] === "")) {
		sandbox_title = result[1].replace(/(\r\n|\n|\r)/gm, "");
		let title_el = (document.getElementById("title").innerHTML = sandbox_title);
		return sandbox_title;
	} else {
		return "unknown";
	}
}

function addAuthor() {
	let result = sandbox_content.match(
		/\/\/\s*[A|a]uthor\s*[\:]?\s*([\w|\s|\@|\(|\)|\-|\_]*)/i
	);
	if (result && !(result[1] === " " || result[1] === "")) {
		sandbox_author = result[1].replace(/(\r\n|\n|\r)/gm, "");
		document.getElementById("author").innerHTML = sandbox_author;
		return sandbox_author;
	} else {
		return "unknown";
	}
}

function addMeta(obj) {
	for (let key in obj) {
		let meta = document.createElement("meta");
		meta.setAttribute("og:" + key, obj[key]);
		document.getElementsByTagName("head")[0].appendChild(meta);
	}
}

let query = parseQuery(window.location.search.slice(1));
if (query && query.log) {
	sandbox_thumbnail = "https://thebookofshaders.com/log/" + query.log + ".png";
	load("https://thebookofshaders.com/log/" + query.log + ".frag");
}

if (window.location.hash !== "") {
	let hashes = location.hash.split("&");
	for (let i in hashes) {
		let ext = hashes[i].substr(hashes[i].lastIndexOf(".") + 1);
		let path = hashes[i];

		// Extract hash if is present
		if (path.search("#") === 0) {
			path = path.substr(1);
		}

		if (ext === "frag") {
			load(path);
		} else if (
			ext === "png" ||
			ext === "jpg" ||
			ext === "PNG" ||
			ext === "JPG"
		) {
			sandbox.setUniform("u_tex" + texCounter.toString(), path);
			texCounter++;
		}
	}
}
