// ===================== PURE CURRENCY SYSTEM =====================

const PURE_DEFINITIONS = {
  refined: {
    id: "refined",
    name: "Refined Metal",
    shortName: "Refined",
    image: "images/items/refined.png",
    coinValue: 0.03,
    aliases: ["refined metal", "refined"]
  },

  key: {
    id: "key",
    name: "Mann Co. Supply Crate Key",
    shortName: "Keys",
    image: "images/items/key.png",
    coinValue: 2.36,
    aliases: [
      "mann co. supply crate key",
      "mann co supply crate key",
      "supply crate key",
      "mann co key",
      "key"
    ]
  },

  earbuds: {
    id: "earbuds",
    name: "Earbuds",
    shortName: "Earbuds",
    image: "images/items/earbuds.png",
    coinValue: 18.72,
    aliases: ["earbuds", "earbud"]
  },

  maxHeads: {
    id: "maxHeads",
    name: "Max's Severed Head",
    shortName: "Max's Heads",
    image: "images/items/maxhead.png",
    coinValue: 72.56,
    aliases: [
      "max's severed head",
      "max's severed heads",
      "maxs severed head",
      "maxs severed heads"
    ]
  }
};

const PURE_STORAGE_KEY = "pures";

let pures = loadPureBalances();

function loadPureBalances() {
  let saved;

  try {
    saved = JSON.parse(
      localStorage.getItem(PURE_STORAGE_KEY)
    );
  } catch (error) {
    saved = null;
  }

  const balances = {};

  Object.keys(PURE_DEFINITIONS).forEach(id => {
    const value = saved && Number(saved[id]);

    balances[id] =
      Number.isFinite(value) && value > 0
        ? value
        : 0;
  });

  return balances;
}

function savePureBalances() {
  localStorage.setItem(
    PURE_STORAGE_KEY,
    JSON.stringify(pures)
  );
}

function normalizePureName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ");
}

function getPureId(item) {
  if (!item) {
    return null;
  }

  if (
    item.pureId &&
    PURE_DEFINITIONS[item.pureId]
  ) {
    return item.pureId;
  }

  const normalized =
    normalizePureName(item.name);

  for (const [id, pure] of Object.entries(
    PURE_DEFINITIONS
  )) {
    if (
      pure.aliases.some(
        alias =>
          normalizePureName(alias) ===
          normalized
      )
    ) {
      return id;
    }
  }

  return null;
}

function isPureItem(item) {
  return Boolean(getPureId(item));
}

function getPureDefinition(id) {
  return PURE_DEFINITIONS[id] || null;
}

function formatPureQuantity(id, amount) {
  if (id === "refined") {
    return Number(amount || 0)
      .toFixed(2)
      .replace(/\.00$/, "");
  }

  return Math.floor(
    Number(amount || 0)
  ).toString();
}

function getPureUnitValue(id) {
  const pure =
    getPureDefinition(id);

  return pure
    ? pure.coinValue
    : 0;
}

function renderPureBalances() {
  const container =
    document.getElementById(
      "pure-balances"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  Object.values(PURE_DEFINITIONS)
    .forEach(pure => {

      const card =
        document.createElement("div");

      card.className =
        "pure-balance-card";

      const amount =
        pures[pure.id] || 0;

      card.innerHTML = `
        <img
          src="${pure.image}"
          alt="${pure.name}"
          class="pure-balance-icon"
        >

        <div class="pure-balance-info">
          <span>${pure.shortName}</span>
          <strong>
            ${formatPureQuantity(
              pure.id,
              amount
            )}
          </strong>
        </div>

        <button
          class="theme-btn pure-takeout-btn"
          type="button"
          ${amount <= 0 ? "disabled" : ""}
        >
          Take Out
        </button>
      `;

      const button =
        card.querySelector(
          ".pure-takeout-btn"
        );

      if (button) {
        button.onclick = () =>
          withdrawPureToInventory(
            pure.id
          );
      }

      container.appendChild(card);
    });
}

function updatePureBalances() {
  savePureBalances();
  renderPureBalances();
}

function addPureBalance(id, amount) {
  if (!PURE_DEFINITIONS[id]) {
    return;
  }

  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    return;
  }

  pures[id] =
    (Number(pures[id]) || 0) +
    numericAmount;

  updatePureBalances();
}

function getWholePureAmountForItem(
  item,
  pureId
) {
  const pureValue =
    getPureUnitValue(pureId);

  const itemValue =
    Number(item && item.price);

  if (
    !Number.isFinite(itemValue) ||
    itemValue <= 0 ||
    pureValue <= 0
  ) {
    return 0;
  }

  const convertedValue =
    itemValue * 0.75;

  return Math.floor(
    (convertedValue / pureValue) +
    1e-9
  );
}

function openPureConversion(
  itemIndex
) {
  const item =
    inventory[itemIndex];

  if (!item) {
    return;
  }

  const pureId =
    getPureId(item);

  if (pureId) {
    convertPureItemToBalance(
      itemIndex,
      pureId
    );
    return;
  }

  const modal =
    document.getElementById(
      "pure-convert-modal"
    );

  const title =
    document.getElementById(
      "pure-convert-title"
    );

  const details =
    document.getElementById(
      "pure-convert-details"
    );

  const options =
    document.getElementById(
      "pure-convert-options"
    );

  if (
    !modal ||
    !title ||
    !details ||
    !options
  ) {
    return;
  }

  const itemValue =
    Number(item.price) || 0;

  const convertedValue =
    itemValue * 0.75;

  title.textContent =
    `Convert ${item.name}`;

  details.textContent =
    `${itemValue.toFixed(2)} coins → ` +
    `${convertedValue.toFixed(2)} pure value ` +
    `(25% conversion cost)`;

  options.innerHTML = "";

  Object.values(PURE_DEFINITIONS)
    .forEach(pure => {

      const amount =
        getWholePureAmountForItem(
          item,
          pure.id
        );

      const option =
        document.createElement(
          "button"
        );

      option.type = "button";
      option.className =
        "pure-convert-option";

      option.innerHTML = `
        <img
          src="${pure.image}"
          alt="${pure.name}"
        >

        <span>
          <strong>
            ${pure.name}
          </strong>

          <small>
            Receive
            ${formatPureQuantity(
              pure.id,
              amount
            )}
            ${pure.shortName}
          </small>
        </span>
      `;

      option.disabled =
        amount <= 0;

      option.onclick = () => {
        convertItemToPure(
          itemIndex,
          pure.id
        );
      };

      options.appendChild(option);
    });

  modal.style.display = "flex";
}

function closePureConversion() {
  const modal =
    document.getElementById(
      "pure-convert-modal"
    );

  if (modal) {
    modal.style.display =
      "none";
  }
}

function convertPureItemToBalance(
  itemIndex,
  pureId
) {
  const item =
    inventory[itemIndex];

  if (
    !item ||
    !PURE_DEFINITIONS[pureId]
  ) {
    return;
  }

  inventory.splice(
    itemIndex,
    1
  );

  addPureBalance(
    pureId,
    1
  );

  saveInventory();
  renderInventory();
  populateCoinflipDropdown();
  updateBackpackValue();

  alert(
    `${item.name} was converted into 1 ${PURE_DEFINITIONS[pureId].name}.`
  );
}

function convertItemToPure(
  itemIndex,
  pureId
) {
  const item =
    inventory[itemIndex];

  if (
    !item ||
    !PURE_DEFINITIONS[pureId]
  ) {
    return;
  }

  const amount =
    getWholePureAmountForItem(
      item,
      pureId
    );

  if (amount <= 0) {
    alert(
      "This item is not worth enough to produce 1 whole unit of that pure after the 25% conversion cost."
    );

    closePureConversion();
    return;
  }

  inventory.splice(
    itemIndex,
    1
  );

  addPureBalance(
    pureId,
    amount
  );

  saveInventory();
  renderInventory();
  populateCoinflipDropdown();
  updateBackpackValue();

  closePureConversion();

  alert(
    `Converted ${item.name} into ${formatPureQuantity(
      pureId,
      amount
    )} ${PURE_DEFINITIONS[pureId].name}.`
  );
}

function withdrawPureToInventory(
  pureId
) {
  const pure =
    getPureDefinition(pureId);

  if (!pure) {
    return;
  }

  const current =
    Number(pures[pureId]) || 0;

  if (current <= 0) {
    return;
  }

  const amountInput =
    prompt(
      `How many ${pure.name} would you like to take out?\n\nAvailable: ${formatPureQuantity(
        pureId,
        current
      )}`
    );

  if (amountInput === null) {
    return;
  }

  const amount =
    Math.floor(
      Number(amountInput) || 0
    );

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    alert(
      "Please enter a valid whole number."
    );
    return;
  }

  if (amount > current) {
    alert(
      `You only have ${formatPureQuantity(
        pureId,
        current
      )} ${pure.name}.`
    );
    return;
  }

  pures[pureId] =
    current - amount;

  for (
    let i = 0;
    i < amount;
    i++
  ) {
    inventory.push({
      name: pure.name,
      rarity: "legendary",
      price: pure.coinValue,
      weight: 0,
      image: pure.image,
      pureId: pure.id
    });
  }

  savePureBalances();
  saveInventory();

  renderPureBalances();
  renderInventory();
  populateCoinflipDropdown();
  updateBackpackValue();

  alert(
    `Took ${amount} ${pure.name} out of pure currency and placed it into your inventory.`
  );
}

// ===================== GLOBAL STATE =====================
let coins = parseFloat(localStorage.getItem("coins"));
if (isNaN(coins) || coins < 0) coins = 20;

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let recentDrops = JSON.parse(localStorage.getItem("recentDrops")) || [];
let cases = [];
let currentCase = null;

let isSpinning = false;

// ===================== ADMIN PASSWORD =====================
let adminMode = false;
const ADMIN_PASSWORD = "C";


// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", () => {

  // Admin item button
  const adminGiveBtn = document.getElementById("admin-give-btn");
  if (adminGiveBtn) {
    adminGiveBtn.onclick = adminGiveItem;
  }

  // Sort inventory
  const sortBtn = document.getElementById("sort-inv-btn");
  if (sortBtn) {
    sortBtn.onclick = sortInventoryByPriceDesc;
  }

  updateCoins();
  renderPureBalances();
  renderInventory();
  renderTopDrops();
  loadCases();
  populateCoinflipDropdown();
  updateBackpackValue();

  const pureCloseBtn =
    document.getElementById("pure-convert-close");

  if (pureCloseBtn) {
    pureCloseBtn.onclick = closePureConversion;
  }

  const pureModal =
    document.getElementById("pure-convert-modal");

  if (pureModal) {
    pureModal.addEventListener("click", event => {
      if (event.target === pureModal) {
        closePureConversion();
      }
    });
  }

  // Buttons
  const sellAllBtn = document.getElementById("sell-all-btn");
  if (sellAllBtn) {
    sellAllBtn.onclick = sellAllItems;
  }

  // ===================== ADD COINS =====================
  const addCoinsBtn = document.getElementById("add-coins-btn");

  if (addCoinsBtn) {
    addCoinsBtn.onclick = addCoinsAdmin;
  }

  // ===================== REMOVE COINS =====================
  const removeCoinsBtn = document.getElementById("remove-coins-btn");

  if (removeCoinsBtn) {
    removeCoinsBtn.onclick = removeCoinsAdmin;
  }

  // ===================== COINFLIP =====================
  const coinflipBtn = document.getElementById("coinflip-btn");

  if (coinflipBtn) {
    coinflipBtn.onclick = () => {
      const select = document.getElementById("coinflip-select");
      const index = parseInt(select.value);

      if (!isNaN(index)) {
        coinflipItem(index);
      }
    };
  }

function setRandomCaseNeonColor() {
  const display = document.getElementById("case-select-display");

  if (!display) return;

  const colors = [
    "#ff004c", // pink/red
    "#ff4d00", // orange
    "#ffd000", // yellow
    "#00ff66", // green
    "#00e5ff", // cyan
    "#0088ff", // blue
    "#7a00ff", // purple
    "#ff00ff", // magenta
    "#ff66cc", // pink
    "#00ffcc"  // turquoise
  ];

  const randomColor =
    colors[Math.floor(Math.random() * colors.length)];

  display.style.setProperty(
    "--case-neon-color",
    randomColor
  );
}
  // ===================== OPEN CASE =====================
  const openBtn = document.getElementById("open-btn");

  if (openBtn) {
    openBtn.onclick = () => openCases(1);
  }

  // ===================== SHOW CASE ITEMS =====================
  const showCaseItemsBtn = document.getElementById("show-case-items-btn");

  if (showCaseItemsBtn) {
    showCaseItemsBtn.onclick = toggleCaseItems;
  }
});


// ===================== ADMIN PASSWORD CHECK =====================

function checkAdminPassword() {

  const password = prompt("Enter Key:");

  if (password === null) {
    return false;
  }

  if (password !== ADMIN_PASSWORD) {
    alert("Incorrect Trading Passkey.");
    return false;
  }

  return true;
}


// ===================== ADD COINS =====================

function addCoinsAdmin() {

  // Ask for password first
  if (!checkAdminPassword()) {
    return;
  }

  // Ask how many coins
  const amountInput = prompt(
    "Deposit Module"
  );

  // Cancel
  if (amountInput === null) {
    return;
  }

  const amount = parseFloat(amountInput);

  // Invalid amount
  if (!isFinite(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than 0.");
    return;
  }

  // Add coins
  coins += amount;

  updateCoins();

  alert(`Added ${amount.toFixed(2)} coins.`);
}


// ===================== REMOVE COINS =====================

function removeCoinsAdmin() {

  // Ask for password first
  if (!checkAdminPassword()) {
    return;
  }

  // Ask how many coins
  const amountInput = prompt(
    "Withdraw Module"
  );

  // Cancel
  if (amountInput === null) {
    return;
  }

  const amount = parseFloat(amountInput);

  // Invalid amount
  if (!isFinite(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than 0.");
    return;
  }

  // Prevent going below zero
  if (amount > coins) {
    alert(
      `You cannot withdraw ${amount.toFixed(2)} coins.\n\n` +
      `You currently have ${coins.toFixed(2)} coins.`
    );

    return;
  }

  // Remove coins
  coins -= amount;

  updateCoins();

  alert(`Removed ${amount.toFixed(2)} coins.`);
}


// ===================== COINS =====================

function updateCoins() {

  const coinsElement = document.getElementById("coins");

  if (coinsElement) {
    coinsElement.textContent = `⛃: ${coins.toFixed(2)}`;
  }

  localStorage.setItem("coins", coins);
}


// ===================== INVENTORY =====================

function saveInventory() {

  localStorage.setItem(
    "inventory",
    JSON.stringify(inventory)
  );

  localStorage.setItem(
    "recentDrops",
    JSON.stringify(recentDrops)
  );
}


function renderInventory() {

  const container =
    document.getElementById("inventory");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  inventory.forEach((item, index) => {

    const div =
      document.createElement("div");

    const rarity =
      String(
        item.rarity || "common"
      ).toLowerCase();

    div.className =
      `inv-item ${rarity}`;

    const pureId =
      getPureId(item);

    const convertButtonText =
      pureId
        ? "Convert"
        : "Convert to Pure";

    div.innerHTML = `
      <img src="${item.image}">
      <p>${item.name}</p>
      <small>
        ${Number(item.price || 0).toFixed(2)}
        coins
      </small>

      <div class="inventory-action-row">

        <button
          class="sell-btn theme-btn"
          type="button"
        >
          Scrap
        </button>

        <button
          class="convert-btn theme-btn"
          type="button"
        >
          ${convertButtonText}
        </button>

      </div>
    `;

    div.querySelector(
      ".sell-btn"
    ).onclick = () => {
      sellItem(index);
    };

    div.querySelector(
      ".convert-btn"
    ).onclick = () => {
      openPureConversion(index);
    };

    container.appendChild(div);
  });
}


// ===================== SELL ITEM =====================

function sellItem(index) {

  coins += inventory[index].price;

  inventory.splice(index, 1);

  saveInventory();
  updateCoins();
  renderInventory();
  populateCoinflipDropdown();
  updateBackpackValue();
}


// ===================== SELL ALL =====================

function sellAllItems() {

  if (inventory.length === 0) {
    alert("Backpack empty.");
    return;
  }

  const total = inventory.reduce(
    (sum, i) => sum + i.price,
    0
  );

  coins += total;

  inventory = [];

  saveInventory();
  updateCoins();
  renderInventory();
  populateCoinflipDropdown();
  updateBackpackValue();

  alert(
    `Scrapped Backpack for ${total.toFixed(2)} coins.`
  );
}


// ===================== BACKPACK VALUE =====================

function updateBackpackValue() {

  const total = inventory.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const el = document.getElementById("backpack-value");

  if (el) {
    el.textContent =
      `Backpack Value: ⛃ ${total.toFixed(2)}`;
  }
}


// ===================== SORT INVENTORY =====================

function sortInventoryByPriceDesc() {

  inventory.sort(
    (a, b) => b.price - a.price
  );

  saveInventory();
  renderInventory();
  updateBackpackValue();
}


// ===================== SHOW CASE ITEMS =====================

function toggleCaseItems() {

  const list =
    document.getElementById("case-items-list");

  if (!list || !currentCase) {
    return;
  }

  if (list.style.display === "block") {

    list.style.display = "none";

    return;
  }

  list.style.display = "block";
  list.innerHTML = "";

  const totalWeight =
    currentCase.items.reduce(
      (sum, i) => sum + i.weight,
      0
    );

  const sortedItems =
    [...currentCase.items].sort(
      (a, b) => b.price - a.price
    );

  sortedItems.forEach(item => {

    const dropRate =
      ((item.weight / totalWeight) * 100)
        .toFixed(2);

    const div =
      document.createElement("div");

    div.className =
      `inv-item ${item.rarity.toLowerCase()}`;

    div.innerHTML = `
      <img src="${item.image}">
      <p>${item.name}</p>
      <small>${item.price.toFixed(2)} coins</small>
      <small style="font-size:14px; margin-top:5px;">
        ⊹ ${dropRate}% ⊹ chance
      </small>
    `;

    list.appendChild(div);
  });
}


// ===================== TOP DROPS =====================

function renderTopDrops() {

  const container =
    document.getElementById("top-drops");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  [...recentDrops]
    .sort((a, b) => b.price - a.price)
    .slice(0, 8)
    .forEach(item => {

      const div =
        document.createElement("div");

      div.className =
        `top-drop ${item.rarity.toLowerCase()}`;

      div.innerHTML = `
        <img src="${item.image}">
        <p>${item.name}</p>
        <strong>${item.price.toFixed(2)} coins</strong>
      `;

      container.appendChild(div);
    });
}


// ===================== COINFLIP =====================

function populateCoinflipDropdown() {

  const select =
    document.getElementById("coinflip-select");

  if (!select) {
    return;
  }

  select.innerHTML = "";

  if (inventory.length === 0) {

    select.innerHTML =
      `<option>No items available</option>`;

    select.disabled = true;

    return;
  }

  select.disabled = false;

  inventory.forEach((item, index) => {

    const option =
      document.createElement("option");

    option.value = index;

    option.textContent =
      `${item.name} (${item.price.toFixed(2)} coins)`;

    select.appendChild(option);
  });
}


function coinflipItem(index) {

  const item = inventory[index];

  if (!item) {
    return;
  }

  const coin =
    document.getElementById("coin");

  const flipBtn =
    document.getElementById("coinflip-btn");

  if (!coin || !flipBtn) {
    return;
  }

  flipBtn.disabled = true;

  const win = Math.random() < 0.5;

  const finalClass =
    win ? "head" : "tail";

  let flips = 0;

  const totalFlips = 10;

  const flipInterval =
    setInterval(() => {

      coin.classList.toggle("head");
      coin.classList.toggle("tail");

      flips++;

      if (flips > totalFlips) {

        clearInterval(flipInterval);

        coin.classList.remove(
          "head",
          "tail"
        );

        coin.classList.add(
          finalClass
        );

        if (win) {

          inventory.push({
            ...item
          });

          alert(
            `You won another ${item.name} 🎉!`
          );

        } else {

          inventory.splice(index, 1);

          alert(
            `You lost, your ${item.name} was destroyed.`
          );
        }

        updateBackpackValue();
        saveInventory();
        renderInventory();
        populateCoinflipDropdown();

        flipBtn.disabled = false;
      }

    }, 150);
}


// ===================== CASE SYSTEM =====================

function loadCases() {

  fetch("data/cases.json")
    .then(res => res.json())
    .then(data => {

      cases = data.cases;

      const display =
        document.getElementById(
          "case-select-display"
        );

      const options =
        document.getElementById(
          "case-select-options"
        );

      if (!display || !options) {
        return;
      }

      options.innerHTML = "";

      cases.forEach(c => {

        const div =
          document.createElement("div");

        div.innerHTML = `
          <img src="${c.image}">
          <span>
            ${c.name}
            (${c.price.toFixed(2)} coins)
          </span>
        `;

        div.onclick = () => {

          selectCase(c.id);

          options.style.display = "none";
        };

        options.appendChild(div);
      });

      if (cases.length > 0) {
        selectCase(cases[0].id);
      }

      display.onclick = () => {

        options.style.display =
          options.style.display === "block"
            ? "none"
            : "block";
      };

      document.addEventListener(
        "click",
        (e) => {

          if (
            !display.contains(e.target) &&
            !options.contains(e.target)
          ) {

            options.style.display = "none";
          }
        }
      );
    })
    .catch(error => {

      console.error(
        "Failed to load cases:",
        error
      );

    });
}


// ===================== SELECT CASE =====================

function selectCase(id) {

  currentCase =
    cases.find(c => c.id === id);

  if (!currentCase) {
    return;
  }

  const caseImage =
    document.getElementById("case-image");

  const caseName =
    document.getElementById("case-name");

  const openButton =
    document.getElementById("open-btn");

  const display =
    document.getElementById(
      "case-select-display"
    );

  if (caseImage) {
    caseImage.src = currentCase.image;
  }

  if (caseName) {
    caseName.textContent =
      currentCase.name;
  }

  if (openButton) {
    openButton.textContent =
      `⛃ ${currentCase.price.toFixed(2)} ⛃`;
  }

  if (display) {

    display.innerHTML = `
      <img src="${currentCase.image}">
      <span>
        ${currentCase.name}
        (${currentCase.price.toFixed(2)} coins)
      </span>
    `;
  }
}


// ===================== OPEN CASES =====================

function openCases(count) {

  if (isSpinning) {
    return;
  }

  if (!currentCase) {
    return;
  }

  isSpinning = true;

  for (let i = 0; i < count; i++) {

    if (coins < currentCase.price) {

      alert("Not enough coins.");

      isSpinning = false;

      break;
    }

    coins -= currentCase.price;

    updateCoins();

    const winningItem =
      getRandomItem(currentCase.items);

    spinToItem(winningItem);
  }
}


// ===================== RANDOM ITEM =====================

function getRandomItem(items) {

  const total =
    items.reduce(
      (sum, i) => sum + i.weight,
      0
    );

  let roll =
    Math.random() * total;

  for (let item of items) {

    if (roll < item.weight) {
      return item;
    }

    roll -= item.weight;
  }

  return items[0];
}
