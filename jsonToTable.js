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
        th.innerHTML = e.name;

        if (!e.hasChild) {
          th.setAttribute("rowspan", maxDeep - e.deep + 1);
        }

        tr.appendChild(th);
      }
    });
    thead.appendChild(tr);
  }

  return thead;
}
