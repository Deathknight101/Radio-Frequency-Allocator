serviceInput = document.getElementById("servName");
startFreqInput = document.getElementById("startFreq");
sfUnitInput = document.getElementById("sfUnit");
endFreqInput = document.getElementById("endFreq");
efUnitInput = document.getElementById("efUnit");
colorInput = document.getElementById("color");
addServiceButton = document.getElementById("btn-add");
deleteNameInput = document.getElementById("deleteName");
deleteServiceButton = document.getElementById("btn-delete");
clearAllButton = document.getElementById("btn-clear");

let allServices = [];

function draw_services() {
  // CREATING ELEMENT
  for (service of allServices) {
    const serviceBox = document.createElement("div");
    serviceBox.setAttribute("id", service.serviceName);
    serviceBox.classList.add("bg-[" + service.color + "]");
    serviceBox.classList.add("w-[" + service.width.toString() + "px" + "]");
    // serviceBox.classList.add("h-[" + service.height.toString() + "px" + "]");
    serviceBox.classList.add("h-[" + service.height.toString() + "px" + "]");
    serviceBox.classList.add("absolute");
    serviceBox.classList.add(
      "left-[" + service.startFreq.toString() + "px" + "]"
    );
    // serviceBox.classList.add("bg-opacity-90");
    serviceBox.classList.add("border-2");
    serviceBox.classList.add("rounded-md");
    serviceBox.classList.add("border-black");
    serviceBox.classList.add("flex");
    serviceBox.classList.add("items-end");
    serviceBox.innerText = service.serviceName;
    let graphContainer = document.getElementById("graph");
    graphContainer.appendChild(serviceBox);
  }
}

function sortByStartFreq(array) {
  array.sort((a, b) => a.startFreq - b.startFreq);
  return array;
}

function overlapHeightAdjustment() {
  allServices = sortByStartFreq(allServices);
  for (let i = 0; i < allServices.length; i++) {
    for (let j = i + 1; j < allServices.length; j++) {
      if (allServices[j].startFreq < allServices[i].endFreq) {
        allServices[j].height = 0.7 * allServices[i].height;
      }
    }
  }
}

addServiceButton.addEventListener("click", function () {
  // ERROR CHECKING
  if (sfUnitInput.value !== efUnitInput.value) {
    alert("The units for the starting and ending frequency must be same.");
    return;
  }

  if (parseInt(startFreqInput.value) >= parseInt(endFreqInput.value)) {
    alert("Ending frequency must be greater than starting Frequency");
    return;
  }

  if (
    serviceInput.value === "" ||
    startFreqInput.value === "" ||
    endFreqInput.value === ""
  ) {
    alert("All the fields must be filled.");
    return;
  }

  // CHECKING EXISTENCE OF SAME SERVICE NAME
  for (service of allServices) {
    if (service.serviceName === serviceInput.value.toUpperCase()) {
      console.log("matches");
      alert("Service name already exists.");
      serviceInput.value = "";
      return;
    }
  }

  // CALCULATING WIDTH OF SERVICE

  if (sfUnitInput.value === "Mhz") {
    width = parseInt(endFreqInput.value) - parseInt(startFreqInput.value);
  } else {
    width =
      parseInt(endFreqInput.value) * 1000 -
      parseInt(startFreqInput.value) * 1000;
  }

  // CALCULATING STARTING FREQUENCY OF SERVICE
  if (sfUnitInput.value === "Mhz") {
    startFreq = parseInt(startFreqInput.value);
    endFreq = parseInt(endFreqInput.value);
  } else {
    startFreq = parseInt(startFreqInput.value) * 1000;
    endFreq = parseInt(endFreqInput.value) * 1000;
  }

  let serviceObject = {
    serviceName: serviceInput.value.toUpperCase(),
    startFreq: startFreq,
    endFreq: endFreq,
    width: width,
    color: colorInput.value,
    height: 350,
    overlapCount: 0,
  };

  allServices.push(serviceObject);
  // CHECKING OVERLAPS AND HEIGHTS
  overlapHeightAdjustment();
  // CLEARING EXISTING GRAPH
  var graphElement = document.getElementById("graph");
  while (graphElement.firstChild) {
    graphElement.removeChild(graphElement.firstChild);
  }
  // DRAWING SERVICES FROM ARRAY OF OBJECT
  draw_services();

  serviceInput.value = "";
  startFreqInput.value = "";
  endFreqInput.value = "";
  colorInput.value = "#000000";
});

deleteServiceButton.addEventListener("click", function () {
  // ERROR CHECKING
  if (deleteNameInput.value === "") {
    alert("The name of the service to be deleted is not given.");
    return;
  }

  let foundIndex = -1;
  for (let i = 0; i < allServices.length; i++) {
    if (allServices[i].serviceName === deleteNameInput.value.toUpperCase()) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex !== -1) {
    allServices.splice(foundIndex, 1);

    // Recalculate the heights and redraw the graph
    overlapHeightAdjustment();

    var graphElement = document.getElementById("graph");
    while (graphElement.firstChild) {
      graphElement.removeChild(graphElement.firstChild);
    }
    draw_services();
  } else {
    deleteNameInput.value = "";
    alert("The name of the service to be deleted does not exist.");
  }
});

clearAllButton.addEventListener("click", function () {
  var graphElement = document.getElementById("graph");
  while (graphElement.firstChild) {
    graphElement.removeChild(graphElement.firstChild);
  }
  allServices = [];
});
