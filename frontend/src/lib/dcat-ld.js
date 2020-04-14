function findValue(element, wantedLang) {
  let currLang = '';
  let currVal = '';
  for (const value of element) {
    if (value['@language'] === wantedLang || currLang === '') {
      currVal = value['@value'];
      currLang = value['@language'];
    }
  }
  return currVal;
}

function parseJsonLd(ld) {
  const seenTypes = [];

  for (const element of ld['@graph']) {
    // console.log(element);
    if (!seenTypes.includes(element['@type'])) {
      seenTypes.push(element['@type']);
    }
  }

  // Prototype extract dcat stuff

  const dcatExports = {
    mimeTypes: [],
    datasets: {},
    catalogs: {},
    concepts: {},
  };

  const distributions = {};

  // const wantedLang = 'no';

  // Find distributions
  for (const element of ld['@graph']) {
    if (element['@type'] === 'dcat:Distribution') {
      const desc = typeof element['dct:description'] === 'undefined'
        ? '[No description]'
        : findValue(element['dct:description'], 'no');
      // let desc = findValue(element["dct:description"], "no")
      // console.log(desc)
      distributions[element['@id']] = {
        format: element['dct:format'],
        description: desc,
        url: (typeof element['dcat:downloadURL'] === 'undefined' ? element['dcat:accessURL'] : element['dcat:downloadURL'])['@id'],
      };
    }
  }

  for (const element of ld['@graph']) {
    // console.log(element);
    if (element['@type'] === 'dct:MediaTypeOrExtent') {
      if (!dcatExports.mimeTypes.includes(element['@id'])) {
        dcatExports.mimeTypes.push(element['@id']);
      }
    } else if (element['@type'] === 'dcat:Dataset') {
      // console.log(JSON.stringify(element, null, 4))
      const title = findValue(element['dct:title'], 'no');

      const distributionList = [];

      element['dcat:distribution'].forEach((val) => {
        distributionList.push(distributions[val['@id']]);
      });

      dcatExports.datasets[element['@id']] = {
        title,
        distributions: distributionList,
      };
    } else if (element['@type'] === 'dcat:Catalog') {
      // console.log(JSON.stringify(element, null, 4))
      const title = findValue(element['dct:title'], 'no');

      dcatExports.catalogs[element['@id']] = {
        title,
        datasets: element['dcat:dataset'].map((val) => val['@id']),
      };
    } else if (element['@type'] === 'skos:Concept') {
      // console.log(element)
      dcatExports.concepts[element['@id']] = {
        id: element['@id'],
        label: element['skos:prefLabel'],
      };
    }
  }

  return dcatExports;
}

export default parseJsonLd;