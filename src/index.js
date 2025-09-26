const groups = ["violet","vert","jaune","bleu","noir","rouge","blanc","beige1","beige2","beige3"];
const defaultActive = ["vert","bleu","rouge","jaune","beige1","beige2","beige3"];
let activeGroups = new Set(defaultActive);

const zones = [document.getElementById("zone1"), document.getElementById("zone2"),
                document.getElementById("zone3"), document.getElementById("zone4")];

const rerollBtn = document.getElementById("rerollBtn");
const addBtn = document.getElementById("addBtn");
const menuOverlay = document.getElementById("menuOverlay");
const closeMenu = document.getElementById("closeMenu");
const diceOptions = document.getElementById("diceOptions");

// init menu checkboxes
groups.forEach(g => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = activeGroups.has(g);
    checkbox.addEventListener("change", () => {
    if (checkbox.checked) activeGroups.add(g); else activeGroups.delete(g);
    });
    label.appendChild(checkbox);
    label.append(" " + g);
    diceOptions.appendChild(label);
    diceOptions.appendChild(document.createElement("br"));
});

function clearZones() {
    zones.forEach(z => {
    Array.from(z.getElementsByClassName("de")).forEach(e => e.remove());
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function reroll() {
    clearZones();
    activeGroups.forEach(g => {
    const zone = zones[getRandomInt(0, zones.length - 1)];
    const imgNum = getRandomInt(1,6);
    const deImg = document.createElement("img");
    deImg.src = `./images/des_${g}_${imgNum}.jpg`;
    deImg.className = "de";

    // place with anti-overlap
    let tries = 0, placed = false;
    const maxTries = 200;
    const existing = zone.getElementsByClassName("de");

    while (!placed && tries < maxTries) {
        tries++;
        const x = getRandomInt(0, zone.clientWidth - 140);
        const y = getRandomInt(0, zone.clientHeight - 140);

        let overlap = false;
        for (let other of existing) {
        const ox = parseInt(other.style.left);
        const oy = parseInt(other.style.top);
        const dist = Math.sqrt((ox - x) ** 2 + (oy - y) ** 2);
        if (dist < 100) { // distance minimale
            overlap = true;
            break;
        }
        }
        if (!overlap) {
        deImg.style.left = x + "px";
        deImg.style.top = y + "px";
        placed = true;
        }
    }
    if (!placed) {
        // fallback
        deImg.style.left = getRandomInt(0, zone.clientWidth - 140) + "px";
        deImg.style.top = getRandomInt(0, zone.clientHeight - 140) + "px";
    }
    zone.appendChild(deImg);
    });
}

rerollBtn.addEventListener("click", reroll);
addBtn.addEventListener("click", () => {
    menuOverlay.style.display = "flex";
});
closeMenu.addEventListener("click", () => {
    menuOverlay.style.display = "none";
    reroll();
});

// first roll
window.onload = reroll;

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker enregistré"))
        .catch(err => console.error("Erreur Service Worker:", err));
}