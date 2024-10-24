function jsonToTableHead(json) {
  let deep = 1;
  let maxDeep = 1;
  let container = [];

  function maping(json) {
    let cols = 0;
    json.forEach((e) => {
      if (typeof e === "object" && !Array.isArray(e) && e !== null) {
        deep++;
        if (deep > maxDeep) {
          maxDeep = deep;
        }
        let element = e[Object.keys(e)[0]];
        let childColl = maping(element);
        cols += childColl;
        deep--;
        let data = {
          cols: childColl,
          name: Object.keys(e)[0],
          deep,
          hasChild: true,
        };
        container.push(data);
      } else if (typeof e === "string") {
        cols++;
        let data = {
          cols: 1,
          name: e,
          deep,
          hasChild: false,
        };
        container.push(data);
      }
    });
    return cols;
  }

  let cols = maping(json);

  // Create <thead> element
  let thead = document.createElement("thead");

  for (let i = 1; i <= maxDeep; i++) {
    let tr = document.createElement("tr");
    container.forEach((e) => {
      if (e.deep === i) {
        let th = document.createElement("th");
        th.setAttribute("colspan", e.cols);
        th.setAttribute("rowspan", 1);
        let name = e.name;

        // Apply Custom ColSpan
        let colMatch = name.match(/\{(.*?)\}/);
        if (colMatch) {
          let colList = parseInt(colMatch[1]);
          name = name.replace(/\{.*?\}/, "");
          if (colList > 1) {
            th.setAttribute("colspan", colList);
          }
        }

        // Apply Class name
        let classMatch = name.match(/\[(.*?)\]/);
        if (classMatch) {
          let classList = classMatch[1];
          th.className = classList;
          th.innerHTML = name.replace(/\[.*?\]/, "");
        } else {
          th.innerHTML = name;
        }

        let isSymbol = name.match(/\&(.*?)/);
        if (isSymbol) {
          th.classList.add("symbol");
        }

        //Regular Rowspan
        if (!e.hasChild) {
          th.setAttribute("rowspan", maxDeep - e.deep + 1);
        }
        if (name != "noCell") {
          tr.appendChild(th);
        }
      }
    });
    thead.appendChild(tr);
  }

  return thead;
}

function jsonToTableBody(json) {
  let tbody = document.createElement("tbody");
  if (typeof json === "object" && Array.isArray(json) && json !== null) {
    json.forEach((e) => {
      if (typeof e === "object" && Array.isArray(e) && e !== null) {
        let tr = document.createElement("tr");
        e.forEach((i) => {
          let data;
          if (typeof i !== "string") {
            data = JSON.stringify(i);
          } else {
            data = i;
          }
          let td = document.createElement("td");

          // Apply Colspan
          let colMatch = data.match(/\{(.*?)\}/);
          if (colMatch) {
            let colList = parseInt(colMatch[1]);
            data = data.replace(/\{.*?\}/, "");
            if (colList > 1) {
              td.setAttribute("colspan", colList);
            }
          }

          // Apply ClassName
          let classMatch = data.match(/\[(.*?)\]/);

          if (classMatch) {
            // If special format is detected
            let classList = classMatch[1];
            td.className = classList;
            td.innerHTML = data.replace(/\[.*?\]/, "");
          } else {
            // If regular format
            td.innerHTML = data;
          }

          let isSymbol = data.match(/\&(.*?)/);
          if (isSymbol) {
            td.classList.add("symbol");
          }

          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }
    });
  }
  return tbody;
}
