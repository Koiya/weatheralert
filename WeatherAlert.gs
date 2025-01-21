const weatherAlerts = () => {
  let url = parseYAML();
  return parseXml(url);
}

function parseYAML(){
  // your YAML string
  var string =
`url: `
  // JSON object
  var obj = YAML.eval(string);
  //remove quotes from string
  var url = JSON.stringify(obj['url']).replace(/['"]+/g, '');
  Logger.log(url);
  return url
}

function parseXml(url) {
  let xml = UrlFetchApp.fetch(url).getContentText();
  let document = XmlService.parse(xml);
  let root = document.getRootElement();
  const atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
  const entries = root.getChildren('entry', atom);
  let res = []

  for (let i = 0; i < entries.length; i++) {
    const title = entries[i].getChild('title', atom).getText();
    const summary = entries[i].getChild('summary', atom).getText();
    Logger.log(title + "\n" + summary );
    res.push( 
    { 
      "header" : title, 
      "collapsible": false,
      "widgets" : [{ 
        "textParagraph":{ 
          "text": summary
        }
      }]  
    },);
  }
  let card = 
  {
  "header": {
    "title": "Weather Alerts in LA"
  },
  "sections": [ res ]
  }
  Logger.log(card);
  return card
}
