const environments = ["sandbox", "live"];
let versions = [];
let selectedVersion;
let clipboard;

window.onload = function () {
    environments.forEach(env => fetchVersion(env, versions));
    const select = document.getElementById("version-select");
    select.addEventListener("change", handleSelectChange);
}

function fetchVersion(environment, versions) {
    fetch("https://resources." + environment + ".oscato.com/paymentpage/v3/version")
    .then(res => res.text())
    .then(version => {
        const trimmedVersion = version.trim()
        const versionTag = document.getElementById(environment + "-version");
        versionTag.innerHTML = trimmedVersion;
        if(!versions.find(item => item === trimmedVersion)) {
            versions.push(trimmedVersion);
        }
        buildSelectMenu(versions);
    }).catch(e => console.log(e));
}

function buildSelectMenu(versions) {
    if(versions.length > 0) {
        // Rebuild the select menu
        const select = document.getElementById("version-select");
        select.innerHTML = "";
        const initial = document.createElement("option");
        initial.value = "";
        initial.innerHTML = "Select a version";
        select.appendChild(initial)
        versions.forEach(item => {
            const newOption = document.createElement("option");
            newOption.value = item;
            newOption.innerHTML = item;
            select.appendChild(newOption);
        });
    }
    else {
        const selector = document.getElementById("select-container");
        selector.innerHTML = "";
        selector.appendChild(document.createTextNode("No versions found"))
    }
    
}

function handleSelectChange(event) {
    const selected = event.target.value;
    if(selected) {
        selectedVersion = selected;
        hideCommands();
        showCommands(selected);
        showFurtherInstructions();
    }
    else {
        hideCommands();
        hideFurtherInstructions();
        selectedVersion = undefined;
    }
}

function hideCommands() {
    const commands = document.getElementById("commands");
    commands.innerHTML = "";

    const runServer = document.getElementById("run-server");
    runServer.innerHTML = "";

    if (clipboard) {
        clipboard.destroy();
    }
}

function showCommands(version) {

    const code = document.getElementById("commands");
    code.appendChild(document.createTextNode(`mkdir temp-payment-widget-${version} && cd "$_"\nnpm install --save op-payment-widget-v3@${version} --registry https://packagecloud.io/optile/javascript/npm/\nmv ./node_modules/op-payment-widget-v3 .. && cd .. &&  rm -rf  temp-payment-widget-${version}`));

    const runServer = document.getElementById("run-server");
    runServer.appendChild(document.createTextNode(`cd op-payment-widget-v3/build\npython3 -m http.server 3000`));

    // Attach listeners to copy buttons
    clipboard = new ClipboardJS('.btn');

    clipboard.on('success', function(e) {
        e.trigger.setAttribute("class", "btn button is-success is-light");
        setTimeout(function() {
            e.trigger.setAttribute("class", "btn button");
        }, 1000)
    });
}

function showFurtherInstructions() {
    const downloadWidget = document.getElementById("commands-area");
    downloadWidget.setAttribute("class", "commands-area");
    
    const runLocally = document.getElementById("run-locally");
    runLocally.setAttribute("class", "section");

    const updateShop = document.getElementById("update-shop");
    updateShop.setAttribute("class", "section");
}

function hideFurtherInstructions() {

    const downloadWidget = document.getElementById("commands-area");
    downloadWidget.setAttribute("class", "commands-area hidden");

    const runLocally = document.getElementById("run-locally");
    runLocally.setAttribute("class", "section hidden");

    const updateShop = document.getElementById("update-shop");
    updateShop.setAttribute("class", "section hidden");
}