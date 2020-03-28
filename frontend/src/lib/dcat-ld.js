function findValue(element, wantedLang) {
	let currLang = ""
	let currVal = ""
	console.log("Finding " + typeof element)
	console.log(element)
	for(let value of element) {
		if(value["@language"] == wantedLang || currLang == "") {
			currVal = value["@value"]
			currLang = value["@language"]
		}
	}
	return currVal;
}

function parseJsonLd(ld) {
	let seenTypes = [];

	for(let element of ld["@graph"]) {
		//console.log(element);
		if(!seenTypes.includes(element["@type"])) {
			console.log(`New seen type: ${element["@type"]}`);

			seenTypes.push(element["@type"]);
		}
	}

	//Prototype extract dcat stuff

	let dcatExports = {
		mimeTypes: [],
		datasets: {},
		catalogs: {}
	}

	let distributions = {};

	let wantedLang = "no";

	//Find distributions
	for(let element of ld["@graph"]) {
		if(element["@type"] == `dcat:Distribution`) {
			let desc = typeof element["dct:description"] === "undefined" 
						? "[Ingen beskrivelse]"
						: findValue(element["dct:description"], "no");
			//let desc = findValue(element["dct:description"], "no")
			console.log(desc)
			distributions[element["@id"]] = {
				format: element["dct:format"],
				description: desc,
				url: (typeof element["dcat:downloadURL"] === "undefined" ? element["dcat:accessURL"]: element["dcat:downloadURL"]) ["@id"]
			};
		} 
	}

	for(let element of ld["@graph"]) {
		//console.log(element);
		if(element["@type"] == `dct:MediaTypeOrExtent`) {
			if(!dcatExports.mimeTypes.includes(element["@id"])) {
				dcatExports.mimeTypes.push(element["@id"])
			}
		} else if(element["@type"] == `dcat:Dataset`) {
			let title = findValue(element["dct:title"], "no")

			let distributionList = []

			element["dcat:distribution"].forEach((val) => {
				distributionList.push(distributions[val["@id"]])
			})

			dcatExports.datasets[element["@id"]] = {
				title: title,
				distributions: distributionList
			};
		} else if(element["@type"] == `dcat:Catalog`) {
			let title = findValue(element["dct:title"], "no")

			dcatExports.catalogs[element["@id"]] = {
				title,
				datasets: element["dcat:dataset"].map((val) => {return val["@id"]})
			}
		}

	}

	return dcatExports;
}

export default parseJsonLd;

//console.log("Extracted data:");
//console.log(JSON.stringify(dcatExports, null, 4));

//console.log("Extracted distributions:")
//console.log(JSON.stringify(distributions, null, 4))