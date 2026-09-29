// ===================== GLOBAL STATE =====================

let coins = parseFloat(localStorage.getItem("coins"));

if (isNaN(coins) || coins < 0) {
  coins = 20;
}

let inventory =
  JSON.parse(localStorage.getItem("inventory")) || [];

let recentDrops =
  JSON.parse(localStorage.getItem("recentDrops")) || [];

let cases = [];
let currentCase = null;

let isSpinning = false;


// ===================== PURE SYSTEM =====================

const PURE_TYPES = {
  maxhead: {
    id: "maxhead",
    name: "Max's Severed Head",
    value: 72.56,
    image: "images/items/maxhead.png"
  },

  earbuds: {
    id: "earbuds",
    name: "Earbuds",
    value: 18.72,
    image: "images/items/earbuds.png"
  },

  bills: {
    id: "bills",
    name: "Bill's Hat",
    value: 8.75,
    image: "images/items/bills.png"
  },

  key: {
    id: "key",
    name: "Mann Co. Supply Crate Key",
    value: 2.36,
    image: "images/items/key.png"
  },

  refined: {
    id: "refined",
    name: "Refined Metal",
    value: 0.03,
    image: "images/items/refined.png"
  }
};

const PURE_CONVERSION_RATE = 0.75;

const PURE_STORAGE_KEY = "pures";
const PURE_REMAINDER_STORAGE_KEY = "pureRemainder";

let pureRemainder = loadPureRemainder();


// ===================== SHARED POPUP SYSTEM =====================

let activeSitePopup = null;

function setupPopupSystem() {
  if (document.getElementById("site-popup-root")) {
    return;
  }

  const root = document.createElement("div");

  root.id = "site-popup-root";

  root.innerHTML = `
    <div id="site-popup-box" role="dialog" aria-modal="true">

      <button
        id="site-popup-close"
        type="button"
        aria-label="Close"
      >
        ×
      </button>

      <h2 id="site-popup-title">
        TF2GRAND
      </h2>

      <div id="site-popup-message"></div>

      <input
        id="site-popup-input"
        autocomplete="off"
      >

      <div id="site-popup-buttons"></div>

    </div>
  `;

  document.body.appendChild(root);

  root.addEventListener("click", event => {
    if (
      event.target === root &&
      activeSitePopup
    ) {
      activeSitePopup.cancel();
    }
  });
}


// ===================== ALERT POPUP =====================

function siteAlert(
  message,
  title = "TF2GRAND"
) {
  setupPopupSystem();

  return new Promise(resolve => {
    const root =
      document.getElementById(
        "site-popup-root"
      );

    const titleEl =
      document.getElementById(
        "site-popup-title"
      );

    const messageEl =
      document.getElementById(
        "site-popup-message"
      );

    const input =
      document.getElementById(
        "site-popup-input"
      );

    const buttons =
      document.getElementById(
        "site-popup-buttons"
      );

    const close =
      document.getElementById(
        "site-popup-close"
      );

    titleEl.textContent = title;
    messageEl.textContent =
      String(message);

    input.style.display = "none";

    buttons.innerHTML = "";

    const finish = () => {
      root.classList.remove("open");

      activeSitePopup = null;

      resolve();
    };

    const ok =
      document.createElement("button");

    ok.className = "theme-btn";
    ok.type = "button";
    ok.textContent = "OK";

    ok.onclick = finish;

    buttons.appendChild(ok);

    close.onclick = finish;

    root.classList.add("open");

    ok.focus();

    activeSitePopup = {
      cancel: finish
    };
  });
}


// ===================== PROMPT POPUP =====================

function sitePrompt(
  message,
  defaultValue = "",
  title = "TF2GRAND"
) {
  setupPopupSystem();

  return new Promise(resolve => {
    const root =
      document.getElementById(
        "site-popup-root"
      );

    const titleEl =
      document.getElementById(
        "site-popup-title"
      );

    const messageEl =
      document.getElementById(
        "site-popup-message"
      );

    const input =
      document.getElementById(
        "site-popup-input"
      );

    const buttons =
      document.getElementById(
        "site-popup-buttons"
      );

    const close =
      document.getElementById(
        "site-popup-close"
      );

    titleEl.textContent = title;

    messageEl.textContent =
      String(message);

    input.style.display = "block";

    input.value = defaultValue;

    input.type =
      /passkey|key/i.test(
        title + " " + message
      )
        ? "password"
        : "text";

    buttons.innerHTML = "";

    const finish = value => {
      root.classList.remove("open");

      activeSitePopup = null;

      resolve(value);
    };

    const cancel =
      document.createElement("button");

    cancel.className = "theme-btn";
    cancel.type = "button";
    cancel.textContent = "Cancel";

    cancel.onclick = () =>
      finish(null);

    const confirmButton =
      document.createElement("button");

    confirmButton.className =
      "theme-btn";

    confirmButton.type = "button";
    confirmButton.textContent =
      "Confirm";

    confirmButton.onclick = () =>
      finish(input.value);

    buttons.append(
      cancel,
      confirmButton
    );

    close.onclick = () =>
      finish(null);

    root.classList.add("open");

    activeSitePopup = {
      cancel: () => finish(null)
    };

    input.onkeydown = event => {
      if (event.key === "Enter") {
        finish(input.value);
      }

      if (event.key === "Escape") {
        finish(null);
      }
    };

    setTimeout(() => {
      input.focus();
      input.select();
    }, 0);
  });
}


// ===================== CONFIRM POPUP =====================

function siteConfirm(
  message,
  title = "TF2GRAND"
) {
  setupPopupSystem();

  return new Promise(resolve => {
    const root =
      document.getElementById(
        "site-popup-root"
      );

    const titleEl =
      document.getElementById(
        "site-popup-title"
      );

    const messageEl =
      document.getElementById(
        "site-popup-message"
      );

    const input =
      document.getElementById(
        "site-popup-input"
      );

    const buttons =
      document.getElementById(
        "site-popup-buttons"
      );

    const close =
      document.getElementById(
        "site-popup-close"
      );

    titleEl.textContent = title;

    messageEl.textContent =
      String(message);

    input.style.display = "none";

    buttons.innerHTML = "";

    const finish = value => {
      root.classList.remove("open");

      activeSitePopup = null;

      resolve(value);
    };

    const cancel =
      document.createElement("button");

    cancel.className = "theme-btn";
    cancel.type = "button";
    cancel.textContent = "Cancel";

    cancel.onclick = () =>
      finish(false);

    const confirmButton =
      document.createElement("button");

    confirmButton.className =
      "theme-btn";

    confirmButton.type = "button";
    confirmButton.textContent =
      "Craft";

    confirmButton.onclick = () =>
      finish(true);

    buttons.append(
      cancel,
      confirmButton
    );

    close.onclick = () =>
      finish(false);

    root.classList.add("open");

    activeSitePopup = {
      cancel: () => finish(false)
    };

    confirmButton.focus();
  });
}


// ===================== PURE STORAGE =====================

let pures = loadPures();


// ===================== ADMIN PASSWORD =====================

let adminMode = false;

const ADMIN_PASSWORD = "C";


// ===================== INIT =====================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    // Admin item button
    const adminGiveBtn =
      document.getElementById(
        "admin-give-btn"
      );

    if (adminGiveBtn) {
      adminGiveBtn.onclick =
        adminGiveItem;
    }


    // Sort inventory
    const sortBtn =
      document.getElementById(
        "sort-inv-btn"
      );

    if (sortBtn) {
      sortBtn.onclick =
        sortInventoryByPriceDesc;
    }


    setupPopupSystem();

    updateCoins();

    setupPureSystem();

    renderPureBalances();

    renderInventory();

    renderTopDrops();

    loadCases();

    populateCoinflipDropdown();

    updateBackpackValue();


    // =====================
    // SELL ALL
    // =====================

    const sellAllBtn =
      document.getElementById(
        "sell-all-btn"
      );

    if (sellAllBtn) {
      sellAllBtn.onclick =
        sellAllItems;
    }


    // =====================
    // ADD COINS
    // =====================

    const addCoinsBtn =
      document.getElementById(
        "add-coins-btn"
      );

    if (addCoinsBtn) {
      addCoinsBtn.onclick =
        addCoinsAdmin;
    }


    // =====================
    // REMOVE COINS
    // =====================

    const removeCoinsBtn =
      document.getElementById(
        "remove-coins-btn"
      );

    if (removeCoinsBtn) {
      removeCoinsBtn.onclick =
        removeCoinsAdmin;
    }


    // =====================
    // COINFLIP
    // =====================

    const coinflipBtn =
      document.getElementById(
        "coinflip-btn"
      );

    if (coinflipBtn) {
      coinflipBtn.onclick = () => {

        const select =
          document.getElementById(
            "coinflip-select"
          );

        if (!select) {
          return;
        }

        const index =
          parseInt(select.value);

        if (!isNaN(index)) {
          coinflipItem(index);
        }
      };
    }


    // =====================
    // RANDOM CASE COLOR
    // =====================

    function setRandomCaseNeonColor() {
      const display =
        document.getElementById(
          "case-select-display"
        );

      if (!display) {
        return;
      }

      const colors = [
        "#ff004c",
        "#ff4d00",
        "#ffd000",
        "#00ff66",
        "#00e5ff",
        "#0088ff",
        "#7a00ff",
        "#ff00ff",
        "#ff66cc",
        "#00ffcc"
      ];

      const randomColor =
        colors[
          Math.floor(
            Math.random() *
            colors.length
          )
        ];

      display.style.setProperty(
        "--case-neon-color",
        randomColor
      );
    }


    // =====================
    // OPEN CASE
    // =====================

    const openBtn =
      document.getElementById(
        "open-btn"
      );

    if (openBtn) {
      openBtn.onclick = () =>
        openCases(1);
    }


    // =====================
    // SHOW CASE ITEMS
    // =====================

    const showCaseItemsBtn =
      document.getElementById(
        "show-case-items-btn"
      );

    if (showCaseItemsBtn) {
      showCaseItemsBtn.onclick =
        toggleCaseItems;
    }


    // =====================
    // UPGRADE
    // =====================

    setupUpgradeButton();
  }
);


// ===================== ADMIN PASSWORD CHECK =====================

async function checkAdminPassword() {

  const password =
    await sitePrompt(
      "Enter Key:",
      "",
      "Trading Passkey"
    );

  if (password === null) {
    return false;
  }

  if (
    password !== ADMIN_PASSWORD
  ) {
    siteAlert(
      "Incorrect Trading Passkey."
    );

    return false;
  }

  return true;
}


// ===================== ADD COINS =====================

async function addCoinsAdmin() {

  if (
    !(await checkAdminPassword())
  ) {
    return;
  }

  const amountInput =
    await sitePrompt(
      "How many coins would you like to deposit?",
      "",
      "Deposit"
    );

  if (amountInput === null) {
    return;
  }

  const amount =
    parseFloat(amountInput);

  if (
    !isFinite(amount) ||
    amount <= 0
  ) {
    siteAlert(
      "Please enter a valid amount greater than 0."
    );

    return;
  }

  coins += amount;

  updateCoins();

  siteAlert(
    `Added ${amount.toFixed(2)} coins.`
  );
}


// ===================== REMOVE COINS =====================

async function removeCoinsAdmin() {

  if (
    !(await checkAdminPassword())
  ) {
    return;
  }

  const amountInput =
    await sitePrompt(
      "How many coins would you like to withdraw?",
      "",
      "Withdraw"
    );

  if (amountInput === null) {
    return;
  }

  const amount =
    parseFloat(amountInput);

  if (
    !isFinite(amount) ||
    amount <= 0
  ) {
    siteAlert(
      "Please enter a valid amount greater than 0."
    );

    return;
  }

  if (amount > coins) {
    siteAlert(
      `You cannot withdraw ${amount.toFixed(2)} coins.\n\n` +
      `You currently have ${coins.toFixed(2)} coins.`
    );

    return;
  }

  coins -= amount;

  updateCoins();

  siteAlert(
    `Removed ${amount.toFixed(2)} coins.`
  );
}


// ===================== COINS =====================

function updateCoins() {

  const coinsElement =
    document.getElementById("coins");

  if (coinsElement) {
    coinsElement.textContent =
      `⛃: ${coins.toFixed(2)}`;
  }

  localStorage.setItem(
    "coins",
    coins
  );
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
    document.getElementById(
      "inventory"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  inventory.forEach(
    (item, index) => {

      const div =
        document.createElement("div");

      div.className =
        `inv-item ${
          String(
            item.rarity ||
            "common"
          ).toLowerCase()
        }`;

      const isPure =
        isPureItem(item);

      const price =
        Number(item.price) || 0;

      div.innerHTML = `
        <img src="${item.image || ""}">

        <p>${item.name}</p>

        <small>
          ${price.toFixed(2)} coins
        </small>

        ${
          isPure
            ? ""
            : '<button class="sell-btn theme-btn">Scrap</button>'
        }

        <button class="convert-btn theme-btn">
          Convert
        </button>
      `;

      const sellButton =
        div.querySelector(
          ".sell-btn"
        );

      if (sellButton) {
        sellButton.onclick = () =>
          sellItem(index);
      }

      const convertButton =
        div.querySelector(
          ".convert-btn"
        );

      if (convertButton) {
        convertButton.onclick = () =>
          convertInventoryItem(index);
      }

      if (isPure) {
        div.classList.add(
          "pure-inventory-item"
        );
      }

      container.appendChild(div);
    }
  );
}


// =========================================================
// PURE SYSTEM
// =========================================================


// ===================== LOAD PURES =====================

function loadPures() {

  const saved =
    JSON.parse(
      localStorage.getItem(
        PURE_STORAGE_KEY
      ) || "null"
    );

  const result = {
    maxhead: 0,
    earbuds: 0,
    bills: 0,
    key: 0,
    refined: 0
  };

  if (
    !saved ||
    typeof saved !== "object"
  ) {
    return result;
  }

  Object.keys(result).forEach(
    id => {

      const amount =
        Number(saved[id]);

      result[id] =
        Number.isFinite(amount) &&
        amount > 0
          ? Math.floor(amount)
          : 0;
    }
  );

  return result;
}


function savePures() {

  localStorage.setItem(
    PURE_STORAGE_KEY,
    JSON.stringify(pures)
  );
}


// ===================== PURE IDENTIFICATION =====================

function isPureItem(item) {

  if (!item) {
    return false;
  }

  if (
    item.isPure === true &&
    item.pureId &&
    PURE_TYPES[item.pureId]
  ) {
    return true;
  }

  const name =
    String(item.name || "")
      .trim()
      .toLowerCase();

  return Object.values(
    PURE_TYPES
  ).some(
    pure =>
      pure.name.toLowerCase() ===
      name
  );
}


function getPureId(item) {

  if (!item) {
    return null;
  }

  if (
    item.pureId &&
    PURE_TYPES[item.pureId]
  ) {
    return item.pureId;
  }

  const name =
    String(item.name || "")
      .trim()
      .toLowerCase();

  const match =
    Object.values(
      PURE_TYPES
    ).find(
      pure =>
        pure.name.toLowerCase() ===
        name
    );

  return match
    ? match.id
    : null;
}


// ===================== PURE UI =====================

function setupPureSystem() {

  let section =
    document.getElementById(
      "pure-section"
    );

  if (!section) {

    const inventoryElement =
      document.getElementById(
        "inventory"
      );

    if (
      !inventoryElement ||
      !inventoryElement.parentElement
    ) {
      return;
    }

    section =
      document.createElement(
        "section"
      );

    section.id =
      "pure-section";

    section.innerHTML = `
      <div id="pure-header">
        <h2>Pure</h2>

        <div id="pure-balances"></div>
      </div>
    `;

    inventoryElement.parentElement.insertBefore(
      section,
      inventoryElement
    );
  }
}


// ===================== PURE BALANCES =====================

function renderPureBalances() {

  const container =
    document.getElementById(
      "pure-balances"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const order = [
    "maxhead",
    "earbuds",
    "bills",
    "key",
    "refined"
  ];

  order.forEach(id => {

    const pure =
      PURE_TYPES[id];

    if (!pure) {
      return;
    }

    const amount =
      Number(pures[id]) || 0;

    const entry =
      document.createElement(
        "div"
      );

    entry.className =
      "pure-balance-entry";

    entry.innerHTML = `
      <img
        src="${pure.image}"
        alt="${pure.name}"
      >

      <span>
        ${amount}
      </span>

      <button
        class="theme-btn pure-withdraw-btn"
        type="button"
      >
        Take Out
      </button>

      <button
        class="theme-btn pure-craft-btn"
        type="button"
      >
        Craft ${getNextPureName(id)}
      </button>
    `;

    const withdrawButton =
      entry.querySelector(
        ".pure-withdraw-btn"
      );

    if (withdrawButton) {
      withdrawButton.onclick =
        () => withdrawPure(id);
    }

    const craftButton =
      entry.querySelector(
        ".pure-craft-btn"
      );

    const nextPure =
      getNextPure(id);

    if (
      craftButton &&
      !nextPure
    ) {
      craftButton.style.display =
        "none";
    }

    if (
      craftButton &&
      nextPure
    ) {
      craftButton.onclick =
        () => craftPure(id);
    }

    container.appendChild(entry);
  });


  // =====================
  // REMAINDER
  // =====================

  const remainderEntry =
    document.createElement(
      "div"
    );

  remainderEntry.className =
    "pure-balance-entry pure-remainder-entry";

  remainderEntry.innerHTML = `
    <div class="pure-remainder-symbol">
      ◈
    </div>

    <span>
      Remainder:
      ${formatPureRemainder()}
      coins
    </span>
  `;

  container.appendChild(
    remainderEntry
  );
}


// ===================== PURE ORDER =====================

function getPureList() {

  return [
    PURE_TYPES.refined,
    PURE_TYPES.key,
    PURE_TYPES.bills,
    PURE_TYPES.earbuds,
    PURE_TYPES.maxhead
  ];
}


function getNextPure(id) {

  const list =
    getPureList();

  const index =
    list.findIndex(
      pure =>
        pure.id === id
    );

  if (
    index === -1 ||
    index >= list.length - 1
  ) {
    return null;
  }

  return list[index + 1];
}


function getNextPureName(id) {

  const next =
    getNextPure(id);

  return next
    ? next.name
    : "Tier";
}


// ===================== CRAFT RECIPE =====================

function calculateCraftRecipe(
  targetId,
  availableOnly = true
) {

  const target =
    PURE_TYPES[targetId];

  if (!target) {
    return null;
  }

  const targetValue =
    Math.round(
      target.value * 100
    );

  let remaining =
    targetValue;

  const breakdown = {
    maxhead: 0,
    earbuds: 0,
    bills: 0,
    key: 0,
    refined: 0
  };

  const list =
    getPureList();

  const targetIndex =
    list.findIndex(
      pure =>
        pure.id === targetId
    );

  if (targetIndex <= 0) {

    return {
      breakdown,
      remaining:
        remaining / 100,
      suppliedValue: 0
    };
  }


  // Start with the highest
  // available lower tier.

  for (
    let i = targetIndex - 1;
    i >= 0;
    i--
  ) {

    const pure =
      list[i];

    const pureValue =
      Math.round(
        pure.value * 100
      );

    let available =
      availableOnly
        ? Number(
            pures[pure.id]
          ) || 0
        : Infinity;

    if (
      !Number.isFinite(
        available
      ) ||
      available < 0
    ) {
      available = 0;
    }

    const needed =
      Math.floor(
        remaining /
        pureValue
      );

    const amount =
      Math.min(
        needed,
        available
      );

    if (amount > 0) {

      breakdown[pure.id] =
        amount;

      remaining -=
        amount * pureValue;
    }
  }

  return {
    breakdown,

    remaining:
      remaining / 100,

    suppliedValue:
      (
        targetValue -
        remaining
      ) / 100
  };
}


// ===================== CRAFT PURE =====================

async function craftPure(fromId) {

  const target =
    getNextPure(fromId);

  if (!target) {

    siteAlert(
      "This pure is already the highest tier."
    );

    return;
  }


  /*
   * We intentionally do not require
   * pures[fromId] to be greater than 0.
   *
   * The next tier may be crafted
   * from multiple lower-tier pures.
   */

  const recipe =
    calculateCraftRecipe(
      target.id,
      true
    );

  if (!recipe) {

    siteAlert(
      "Unable to calculate this crafting recipe."
    );

    return;
  }

  const currentRemainder =
    Math.round(
      pureRemainder * 100
    ) / 100;

  const suppliedValue =
    recipe.suppliedValue;

  const totalAvailable =
    suppliedValue +
    currentRemainder;

  if (
    totalAvailable + 0.0001 <
    target.value
  ) {

    const missing =
      target.value -
      totalAvailable;

    siteAlert(
      `Not enough Pure to craft ${target.name}.\n\n` +
      `Required: ${target.value.toFixed(2)} coins\n` +
      `Available: ${totalAvailable.toFixed(2)} coins\n` +
      `Still needed: ${missing.toFixed(2)} coins`
    );

    return;
  }


  // =====================
  // BUILD RECIPE MESSAGE
  // =====================

  const parts = [];

  [
    "maxhead",
    "earbuds",
    "bills",
    "key",
    "refined"
  ].forEach(id => {

    const amount =
      recipe.breakdown[id] || 0;

    if (amount > 0) {

      parts.push(
        `${amount} ${PURE_TYPES[id].name}`
      );
    }
  });

  if (currentRemainder > 0) {

    parts.push(
      `${currentRemainder.toFixed(2)} coin remainder`
    );
  }

  const recipeText =
    parts.length
      ? parts.join("\n")
      : "No available pure units.";


  // =====================
  // CONFIRM
  // =====================

  const confirmed =
    await siteConfirm(
      `Craft 1 ${target.name}?\n\n` +
      `You will use:\n` +
      recipeText +
      `\n\n` +
      `Target value: ${target.value.toFixed(2)} coins`,
      "Craft Pure"
    );

  if (!confirmed) {
    return;
  }


  // =====================
  // RECHECK
  // =====================

  const finalRecipe =
    calculateCraftRecipe(
      target.id,
      true
    );

  if (!finalRecipe) {

    siteAlert(
      "The crafting recipe is no longer available."
    );

    return;
  }

  const finalRemainder =
    Math.round(
      pureRemainder * 100
    ) / 100;

  const finalTotal =
    finalRecipe.suppliedValue +
    finalRemainder;

  if (
    finalTotal + 0.0001 <
    target.value
  ) {

    siteAlert(
      "You no longer have enough Pure to complete this craft."
    );

    return;
  }


  // =====================
  // CONSUME PURE
  // =====================

  Object.keys(
    finalRecipe.breakdown
  ).forEach(id => {

    const amount =
      finalRecipe.breakdown[id] ||
      0;

    if (amount > 0) {

      pures[id] =
        Math.max(
          0,
          (Number(
            pures[id]
          ) || 0) - amount
        );
    }
  });


  // =====================
  // CONSUME REMAINDER
  // =====================

  const remainingAfterPures =
    Math.max(
      0,
      target.value -
      finalRecipe.suppliedValue
    );

  const remainderUsed =
    Math.min(
      pureRemainder,
      remainingAfterPures
    );

  pureRemainder =
    Math.max(
      0,
      Math.round(
        (
          pureRemainder -
          remainderUsed
        ) * 100
      ) / 100
    );


  // =====================
  // ADD TARGET PURE
  // =====================

  pures[target.id] =
    (Number(
      pures[target.id]
    ) || 0) + 1;

  savePures();

  savePureRemainder();

  renderPureBalances();

  siteAlert(
    `Crafted 1 ${target.name}! 🎉\n\n` +
    `Value: ${target.value.toFixed(2)} coins`
  );
}


// ===================== ADD PURE =====================

function addPure(
  id,
  amount
) {

  if (!PURE_TYPES[id]) {
    return;
  }

  const wholeAmount =
    Math.floor(
      Number(amount)
    );

  if (
    !Number.isFinite(
      wholeAmount
    ) ||
    wholeAmount <= 0
  ) {
    return;
  }

  pures[id] =
    (Number(
      pures[id]
    ) || 0) +
    wholeAmount;

  savePures();

  renderPureBalances();
}


// ===================== WITHDRAW PURE =====================

async function withdrawPure(id) {

  const pure =
    PURE_TYPES[id];

  const available =
    Number(
      pures[id]
    ) || 0;

  if (
    !pure ||
    available <= 0
  ) {

    siteAlert(
      `You do not have any ${
        pure
          ? pure.name
          : "pure"
      }.`
    );

    return;
  }

  const input =
    await sitePrompt(
      `How many ${pure.name} would you like to take out?`,
      String(available),
      "Pure Withdraw"
    );

  if (input === null) {
    return;
  }

  const amount =
    Math.floor(
      Number(input)
    );

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {

    siteAlert(
      "Please enter a valid whole number."
    );

    return;
  }

  if (amount > available) {

    siteAlert(
      `You only have ${available} ${pure.name}.`
    );

    return;
  }

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    inventory.push({
      name: pure.name,
      rarity: "pure",
      price: pure.value,
      weight: 0,
      image: pure.image,
      isPure: true,
      pureId: pure.id
    });
  }

  pures[id] -= amount;

  savePures();

  saveInventory();

  renderPureBalances();

  renderInventory();

  populateCoinflipDropdown();

  updateBackpackValue();

  siteAlert(
    `Took out ${amount} ${pure.name}.`
  );
}


// ===================== LOAD REMAINDER =====================

function loadPureRemainder() {

  const saved =
    Number(
      localStorage.getItem(
        PURE_REMAINDER_STORAGE_KEY
      )
    );

  return (
    Number.isFinite(saved) &&
    saved > 0
  )
    ? Math.round(
        saved * 100
      ) / 100
    : 0;
}


// ===================== SAVE REMAINDER =====================

function savePureRemainder() {

  localStorage.setItem(
    PURE_REMAINDER_STORAGE_KEY,
    pureRemainder.toFixed(2)
  );
}


// ===================== FORMAT REMAINDER =====================

function formatPureRemainder(
  value = pureRemainder
) {

  return (
    Number(value) || 0
  ).toFixed(2);
}


function addPureRemainder(amount) {

  const added =
    Math.max(
      0,
      Math.round(
        (
          Number(amount) || 0
        ) * 100
      ) / 100
    );

  if (added <= 0) {

    return {
      refinedAdded: 0,
      remainder: pureRemainder
    };
  }

  let totalHundredths =
    Math.round(
      (
        pureRemainder +
        added
      ) * 100
    );

  const refinedValue = 3;

  const refinedAdded =
    Math.floor(
      totalHundredths /
      refinedValue
    );

  totalHundredths %=
    refinedValue;

  pureRemainder =
    totalHundredths / 100;

  savePureRemainder();

  if (refinedAdded > 0) {

    addPure(
      "refined",
      refinedAdded
    );
  }

  return {
    refinedAdded,
    remainder:
      pureRemainder
  };
}


function getPureRemainderDisplay() {

  return (
    `Remainder: ${formatPureRemainder()} coins`
  );
}


// ===================== COIN VALUE → PURE =====================

function calculatePureBreakdown(
  coinValue
) {

  let remainingHundredths =
    Math.max(
      0,
      Math.round(
        (
          Number(coinValue) || 0
        ) * 100
      )
    );

  const values = {
    maxhead: 7256,
    earbuds: 1872,
    bills: 875,
    key: 236,
    refined: 3
  };

  const breakdown = {
    maxhead: 0,
    earbuds: 0,
    bills: 0,
    key: 0,
    refined: 0
  };

  for (
    const id of [
      "maxhead",
      "earbuds",
      "bills",
      "key",
      "refined"
    ]
  ) {

    const count =
      Math.floor(
        remainingHundredths /
        values[id]
      );

    breakdown[id] =
      count;

    remainingHundredths -=
      count * values[id];
  }

  return {
    breakdown,

    remainder:
      remainingHundredths / 100
  };
}


// ===================== FORMAT PURE BREAKDOWN =====================

function formatPureBreakdown(
  breakdown
) {

  const parts = [];

  [
    "maxhead",
    "earbuds",
    "bills",
    "key",
    "refined"
  ].forEach(id => {

    const amount =
      breakdown[id] || 0;

    if (amount > 0) {

      parts.push(
        `${amount} ${PURE_TYPES[id].name}`
      );
    }
  });

  return parts.length
    ? parts.join(" + ")
    : "no whole pure units";
}


// ===================== CONVERT INVENTORY ITEM =====================

function convertInventoryItem(
  index
) {

  const item =
    inventory[index];

  if (!item) {
    return;
  }


  // =====================
  // PHYSICAL PURE
  // =====================

  if (isPureItem(item)) {

    const pureId =
      getPureId(item);

    if (!pureId) {

      siteAlert(
        "This item could not be identified as a pure item."
      );

      return;
    }

    inventory.splice(
      index,
      1
    );

    addPure(
      pureId,
      1
    );

    saveInventory();

    renderInventory();

    populateCoinflipDropdown();

    updateBackpackValue();

    siteAlert(
      `Converted 1 ${PURE_TYPES[pureId].name} into your Pure balance.`
    );

    return;
  }


  // =====================
  // NORMAL ITEM
  // =====================

  const itemValue =
    Number(item.price);

  if (
    !Number.isFinite(itemValue) ||
    itemValue <= 0
  ) {

    siteAlert(
      "This item has no valid coin value to convert."
    );

    return;
  }


  // 25% conversion fee.

  const convertibleValue =
    itemValue *
    PURE_CONVERSION_RATE;

  const result =
    calculatePureBreakdown(
      convertibleValue
    );


  // Remove item first.

  inventory.splice(
    index,
    1
  );


  // =====================
  // ADD WHOLE PURES
  // =====================

  Object.keys(
    result.breakdown
  ).forEach(id => {

    const amount =
      result.breakdown[id];

    if (amount > 0) {

      addPure(
        id,
        amount
      );
    }
  });


  // =====================
  // STORE REMAINDER
  // =====================

  const remainderResult =
    addPureRemainder(
      result.remainder
    );

  saveInventory();

  renderPureBalances();

  renderInventory();

  populateCoinflipDropdown();

  updateBackpackValue();


  const receivedText =
    formatPureBreakdown(
      result.breakdown
    );

  const remainderText =
    `This conversion's leftover: ${result.remainder.toFixed(2)} coins.\n` +
    `Stored remainder: ${formatPureRemainder()}.` +
    (
      remainderResult.refinedAdded > 0
        ? `\nAuto-converted ${remainderResult.refinedAdded} Refined Metal from accumulated remainder.`
        : ""
    );


  siteAlert(
    `Converted ${item.name}.\n\n` +
    `Original value: ${itemValue.toFixed(2)} coins\n` +
    `After 25% fee: ${convertibleValue.toFixed(2)} coins\n\n` +
    `Received: ${receivedText}\n\n` +
    remainderText
  );
}


// ===================== SELL ITEM =====================

function sellItem(index) {

  if (
    !inventory[index] ||
    isPureItem(
      inventory[index]
    )
  ) {
    return;
  }

  coins +=
    Number(
      inventory[index].price
    ) || 0;

  inventory.splice(
    index,
    1
  );

  saveInventory();

  updateCoins();

  renderInventory();

  populateCoinflipDropdown();

  updateBackpackValue();
}


// ===================== SELL ALL =====================

function sellAllItems() {

  if (
    inventory.length === 0
  ) {

    siteAlert(
      "Backpack empty."
    );

    return;
  }

  const total =
    inventory.reduce(
      (sum, i) =>
        sum +
        (
          Number(i.price) ||
          0
        ),
      0
    );

  coins += total;

  inventory = [];

  saveInventory();

  updateCoins();

  renderInventory();

  populateCoinflipDropdown();

  updateBackpackValue();

  siteAlert(
    `Scrapped Backpack for ${total.toFixed(2)} coins.`
  );
}


// ===================== BACKPACK VALUE =====================

function updateBackpackValue() {

  const total =
    inventory.reduce(
      (sum, item) =>
        sum +
        (
          Number(item.price) ||
          0
        ),
      0
    );

  const el =
    document.getElementById(
      "backpack-value"
    );

  if (el) {

    el.textContent =
      `Backpack Value: ⛃ ${total.toFixed(2)}`;
  }
}


// ===================== SORT INVENTORY =====================

function sortInventoryByPriceDesc() {

  inventory.sort(
    (a, b) =>
      (
        Number(b.price) || 0
      ) -
      (
        Number(a.price) || 0
      )
  );

  saveInventory();

  renderInventory();

  updateBackpackValue();
}


// ===================== SHOW CASE ITEMS =====================

function toggleCaseItems() {

  const list =
    document.getElementById(
      "case-items-list"
    );

  if (
    !list ||
    !currentCase
  ) {
    return;
  }

  if (
    list.style.display ===
    "block"
  ) {

    list.style.display =
      "none";

    return;
  }

  list.style.display =
    "block";

  list.innerHTML = "";

  const totalWeight =
    currentCase.items.reduce(
      (sum, i) =>
        sum +
        (
          Number(i.weight) ||
          0
        ),
      0
    );

  const sortedItems =
    [...currentCase.items].sort(
      (a, b) =>
        (
          Number(b.price) || 0
        ) -
        (
          Number(a.price) || 0
        )
    );

  sortedItems.forEach(
    item => {

      const dropRate =
        totalWeight > 0
          ? (
              (
                item.weight /
                totalWeight
              ) * 100
            ).toFixed(2)
          : "0.00";

      const div =
        document.createElement(
          "div"
        );

      div.className =
        `inv-item ${
          String(
            item.rarity ||
            "common"
          ).toLowerCase()
        }`;

      div.innerHTML = `
        <img src="${item.image}">

        <p>${item.name}</p>

        <small>
          ${Number(item.price).toFixed(2)} coins
        </small>

        <small
          style="
            font-size:14px;
            margin-top:5px;
          "
        >
          ⊹ ${dropRate}% ⊹ chance
        </small>
      `;

      list.appendChild(div);
    }
  );
}


// ===================== TOP DROPS =====================

function renderTopDrops() {

  const container =
    document.getElementById(
      "top-drops"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  [...recentDrops]
    .sort(
      (a, b) =>
        (
          Number(b.price) || 0
        ) -
        (
          Number(a.price) || 0
        )
    )
    .slice(0, 8)
    .forEach(item => {

      const div =
        document.createElement(
          "div"
        );

      div.className =
        `top-drop ${
          String(
            item.rarity ||
            "common"
          ).toLowerCase()
        }`;

      div.innerHTML = `
        <img src="${item.image}">

        <p>${item.name}</p>

        <strong>
          ${Number(item.price).toFixed(2)} coins
        </strong>
      `;

      container.appendChild(div);
    });
}


// ===================== COINFLIP =====================

function populateCoinflipDropdown() {

  const select =
    document.getElementById(
      "coinflip-select"
    );

  if (!select) {
    return;
  }

  select.innerHTML = "";

  const usableItems =
    inventory.filter(
      item =>
        !isPureItem(item)
    );

  if (
    usableItems.length === 0
  ) {

    select.innerHTML =
      `<option>No items available</option>`;

    select.disabled = true;

    return;
  }

  select.disabled = false;

  inventory.forEach(
    (item, index) => {

      if (
        isPureItem(item)
      ) {
        return;
      }

      const option =
        document.createElement(
          "option"
        );

      option.value =
        index;

      option.textContent =
        `${item.name} (${Number(item.price).toFixed(2)} coins)`;

      select.appendChild(option);
    }
  );
}


// ===================== COINFLIP ITEM =====================

function coinflipItem(index) {

  const item =
    inventory[index];

  if (!item) {
    return;
  }

  if (isPureItem(item)) {
    return;
  }

  const coin =
    document.getElementById(
      "coin"
    );

  const flipBtn =
    document.getElementById(
      "coinflip-btn"
    );

  if (
    !coin ||
    !flipBtn
  ) {
    return;
  }

  flipBtn.disabled = true;

  const win =
    Math.random() < 0.5;

  const finalClass =
    win
      ? "head"
      : "tail";

  let flips = 0;

  const totalFlips = 10;

  const flipInterval =
    setInterval(
      () => {

        coin.classList.toggle(
          "head"
        );

        coin.classList.toggle(
          "tail"
        );

        flips++;

        if (
          flips > totalFlips
        ) {

          clearInterval(
            flipInterval
          );

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

            siteAlert(
              `You won another ${item.name} 🎉!`
            );

          } else {

            inventory.splice(
              index,
              1
            );

            siteAlert(
              `You lost, your ${item.name} was destroyed.`
            );
          }

          updateBackpackValue();

          saveInventory();

          renderInventory();

          populateCoinflipDropdown();

          flipBtn.disabled =
            false;
        }

      },
      150
    );
}


// ===================== CASE SYSTEM =====================

function loadCases() {

  fetch("data/cases.json")
    .then(res => {

      if (!res.ok) {
        throw new Error(
          `HTTP ${res.status}`
        );
      }

      return res.json();
    })
    .then(data => {

      cases =
        Array.isArray(data.cases)
          ? data.cases
          : [];

      const display =
        document.getElementById(
          "case-select-display"
        );

      const options =
        document.getElementById(
          "case-select-options"
        );

      if (
        !display ||
        !options
      ) {
        return;
      }

      options.innerHTML = "";

      cases.forEach(c => {

        const div =
          document.createElement(
            "div"
          );

        div.innerHTML = `
          <img src="${c.image}">

          <span>
            ${c.name}
            (${Number(c.price).toFixed(2)} coins)
          </span>
        `;

        div.onclick = () => {

          selectCase(c.id);

          options.style.display =
            "none";
        };

        options.appendChild(div);
      });

      if (
        cases.length > 0
      ) {

        selectCase(
          cases[0].id
        );
      }

      display.onclick = () => {

        options.style.display =
          options.style.display ===
          "block"
            ? "none"
            : "block";
      };

      document.addEventListener(
        "click",
        e => {

          if (
            !display.contains(
              e.target
            ) &&
            !options.contains(
              e.target
            )
          ) {

            options.style.display =
              "none";
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
    cases.find(
      c => c.id === id
    );

  if (!currentCase) {
    return;
  }

  const caseImage =
    document.getElementById(
      "case-image"
    );

  const caseName =
    document.getElementById(
      "case-name"
    );

  const openButton =
    document.getElementById(
      "open-btn"
    );

  const display =
    document.getElementById(
      "case-select-display"
    );

  if (caseImage) {

    caseImage.src =
      currentCase.image;
  }

  if (caseName) {

    caseName.textContent =
      currentCase.name;
  }

  if (openButton) {

    openButton.textContent =
      `⛃ ${Number(currentCase.price).toFixed(2)} ⛃`;
  }

  if (display) {

    display.innerHTML = `
      <img src="${currentCase.image}">

      <span>
        ${currentCase.name}
        (${Number(currentCase.price).toFixed(2)} coins)
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

  for (
    let i = 0;
    i < count;
    i++
  ) {

    if (
      coins <
      Number(
        currentCase.price
      )
    ) {

      siteAlert(
        "Not enough coins."
      );

      isSpinning = false;

      break;
    }

    coins -=
      Number(
        currentCase.price
      );

    updateCoins();

    const winningItem =
      getRandomItem(
        currentCase.items
      );

    spinToItem(
      winningItem
    );
  }
}


// ===================== RANDOM ITEM =====================

function getRandomItem(
  items
) {

  const total =
    items.reduce(
      (sum, i) =>
        sum +
        (
          Number(i.weight) ||
          0
        ),
      0
    );

  let roll =
    Math.random() *
    total;

  for (
    let item of items
  ) {

    const weight =
      Number(item.weight) || 0;

    if (
      roll < weight
    ) {
      return item;
    }

    roll -= weight;
  }

  return items[0];
}


// ===================== SPINNER =====================

function spinToItem(
  winningItem
) {

  const strip =
    document.getElementById(
      "spinner-strip"
    );

  if (!strip) {

    isSpinning = false;

    return;
  }

  strip.innerHTML = "";

  const slots = 50;

  const winnerIndex = 38;

  for (
    let i = 0;
    i < slots;
    i++
  ) {

    let item =
      currentCase.items[
        Math.floor(
          Math.random() *
          currentCase.items.length
        )
      ];

    if (
      i === winnerIndex
    ) {
      item = winningItem;
    }

    const div =
      document.createElement(
        "div"
      );

    div.className =
      `spinner-item ${
        String(
          item.rarity ||
          "common"
        ).toLowerCase()
      }`;

    div.innerHTML =
      `<img src="${item.image}">`;

    div.style.filter =
      "grayscale(100%)";

    strip.appendChild(div);
  }

  strip.offsetHeight;

  const firstChild =
    strip.children[0];

  if (!firstChild) {

    isSpinning = false;

    return;
  }

  const itemWidth =
    firstChild.offsetWidth +
    30;

  const container =
    document.getElementById(
      "spinner-container"
    );

  if (!container) {

    isSpinning = false;

    return;
  }

  const containerWidth =
    container.offsetWidth;

  const randomSpot =
    (
      Math.random() +
      Math.random()
    ) / 2;

  const edgePadding =
    itemWidth * 0.1;

  const randomOffsetInsideItem =
    (
      randomSpot - 0.5
    ) *
    (
      itemWidth -
      edgePadding
    );

  const jitter =
    (
      Math.random() -
      0.5
    ) * 3;

  const offset =
    -(
      winnerIndex *
        itemWidth -
      containerWidth / 2 +
      itemWidth / 2 +
      randomOffsetInsideItem +
      jitter
    );

  strip.style.transition =
    "none";

  strip.style.transform =
    "translateX(0)";

  strip.offsetHeight;

  strip.style.transition =
    "transform 3.2s cubic-bezier(.25,.85,.35,1)";

  strip.style.transform =
    `translateX(${offset}px)`;


  const interval =
    setInterval(
      () => {

        const children =
          Array.from(
            strip.children
          );

        const centerX =
          strip.parentElement
            .getBoundingClientRect()
            .left +
          containerWidth / 2;

        children.forEach(
          child => {

            const rect =
              child.getBoundingClientRect();

            const dist =
              Math.abs(
                rect.left +
                rect.width / 2 -
                centerX
              );

            const factor =
              Math.max(
                0,
                1 -
                dist /
                (
                  containerWidth /
                  2
                )
              );

            child.style.filter =
              `grayscale(${
                (1 - factor) * 77
              }%) brightness(${
                0.6 +
                0.4 * factor
              })`;
          }
        );

      },
      30
    );


  setTimeout(
    () => {

      clearInterval(
        interval
      );

      const children =
        Array.from(
          strip.children
        );

      children.forEach(
        (child, i) => {

          if (
            i === winnerIndex
          ) {

            child.style.filter =
              "grayscale(0%) brightness(1)";

            animateWinner(
              child
            );

          } else {

            child.style.filter =
              "grayscale(35%) brightness(0.6)";
          }
        }
      );

      showWinner(
        winningItem
      );

      setTimeout(
        () => {
          isSpinning = false;
        },
        200
      );

    },
    3200
  );
}


// ===================== WIN ITEM ANIMATION =====================

function animateWinner(
  element
) {

  let scale = 1;

  let growing = true;

  function frame() {

    if (growing) {

      scale += 0.005;

      if (
        scale >= 1.2
      ) {
        growing = false;
      }

    } else {

      scale -= 0.005;

      if (
        scale <= 1
      ) {
        growing = true;
      }
    }

    element.style.transform =
      `scale(${scale})`;

    requestAnimationFrame(
      frame
    );
  }

  frame();
}


// ===================== WINNER =====================

function showWinner(
  item
) {

  inventory.push(
    item
  );

  recentDrops.push(
    item
  );

  if (
    recentDrops.length > 20
  ) {
    recentDrops.shift();
  }

  saveInventory();

  renderInventory();

  renderTopDrops();

  populateCoinflipDropdown();

  updateBackpackValue();

  const winnerBox =
    document.getElementById(
      "winner-name"
    );

  if (winnerBox) {

    winnerBox.textContent =
      item.name;

    winnerBox.className =
      String(
        item.rarity ||
        "common"
      ).toLowerCase();
  }
}


// ===================== ADMIN GIVE ITEMS =====================

async function adminGiveItem() {

  const panel =
    document.getElementById(
      "admin-give-panel"
    );

  const itemsContainer =
    document.getElementById(
      "admin-give-items"
    );

  if (
    !panel ||
    !itemsContainer
  ) {
    return;
  }


  // =====================
  // PASSWORD
  // =====================

  if (!adminMode) {

    const password =
      await sitePrompt(
        "Enter Trading passkey:",
        "",
        "Trading Passkey"
      );

    if (
      password === null
    ) {
      return;
    }

    if (
      password !==
      ADMIN_PASSWORD
    ) {

      siteAlert(
        "Incorrect Trading Passkey."
      );

      return;
    }

    adminMode = true;

    siteAlert(
      "Trading Mode Enabled."
    );
  }


  panel.style.display =
    "block";

  itemsContainer.innerHTML =
    "";

  let allItems = [];

  cases.forEach(
    c => {

      if (
        !Array.isArray(c.items)
      ) {
        return;
      }

      c.items.forEach(
        item => {

          allItems.push(
            item
          );
        }
      );
    }
  );


  allItems.forEach(
    item => {

      const div =
        document.createElement(
          "div"
        );

      div.className =
        "admin-give-item";

      div.innerHTML = `
        <img src="${item.image}">

        <div class="admin-give-info">

          <span class="name">
            ${item.name}
          </span>

          <span class="price">
            ${Number(item.price).toFixed(2)} coins
          </span>

        </div>

        <button>
          Trade
        </button>
      `;

      div.querySelector(
        "button"
      ).onclick = () => {

        const price =
          Number(item.price) ||
          0;

        if (
          coins < price
        ) {

          siteAlert(
            "Not enough coins."
          );

          return;
        }

        coins -= price;

        updateCoins();

        inventory.push({
          ...item
        });

        saveInventory();

        renderInventory();

        populateCoinflipDropdown();

        updateBackpackValue();

        siteAlert(
          `Traded ${item.name} for ${price.toFixed(2)} coins`
        );
      };

      itemsContainer.appendChild(
        div
      );
    }
  );


  const closeButton =
    document.getElementById(
      "admin-give-close"
    );

  if (closeButton) {

    closeButton.onclick =
      () => {

        panel.style.display =
          "none";

        adminMode = false;
      };
  }
}


/* =========================================================
   UPGRADE SYSTEM
   ========================================================= */

let Upgrader = {
  cases: [],
  selectedWagers: [],
  selectedTargets: [],
  upgrading: false
};


// =========================
// KEY
// =========================

function getKey(
  item,
  index
) {

  return (
    `${item.name}|${item.price}|${item.image}|${index}`
  );
}


// =========================
// INIT
// =========================

window.addEventListener(
  "load",
  () => {

    waitForCases(
      () => {

        Upgrader.cases =
          cases || [];

        createLoadButtons();

        renderWager();

        renderTarget();

        updateUI();

        setupUpgradeButton();
      }
    );
  }
);


// =========================
// WAIT FOR CASES
// =========================

function waitForCases(cb) {

  if (
    !cases ||
    !cases.length
  ) {

    setTimeout(
      () =>
        waitForCases(cb),
      150
    );

    return;
  }

  cb();
}


// =========================
// LOAD BUTTONS
// =========================

function createLoadButtons() {

  const wagerParent =
    document.querySelector(
      "#wager-list"
    )?.parentElement;

  const targetParent =
    document.querySelector(
      "#target-list"
    )?.parentElement;


  if (
    wagerParent &&
    !document.getElementById(
      "load-wager-btn"
    )
  ) {

    const btn =
      document.createElement(
        "button"
      );

    btn.id =
      "load-wager-btn";

    btn.className =
      "theme-btn";

    btn.textContent =
      "Load Wager Items";

    btn.onclick =
      renderWager;

    wagerParent.prepend(
      btn
    );
  }


  if (
    targetParent &&
    !document.getElementById(
      "load-target-btn"
    )
  ) {

    const btn =
      document.createElement(
        "button"
      );

    btn.id =
      "load-target-btn";

    btn.className =
      "theme-btn";

    btn.textContent =
      "Load Target Items";

    btn.onclick =
      renderTarget;

    targetParent.prepend(
      btn
    );
  }
}


// =========================
// WAGER RENDER
// =========================

function renderWager() {

  const box =
    document.getElementById(
      "wager-list"
    );

  if (!box) {
    return;
  }

  box.innerHTML = "";

  inventory.forEach(
    (item, index) => {

      // Pure cannot be used
      // as an upgrade wager.

      if (
        isPureItem(item)
      ) {
        return;
      }

      const key =
        getKey(
          item,
          index
        );

      const selected =
        Upgrader.selectedWagers.some(
          i =>
            i.key === key
        );

      const div =
        document.createElement(
          "div"
        );

      div.className =
        `upgrade-item ${
          item.rarity
        } ${
          selected
            ? "selected"
            : ""
        }`;

      div.innerHTML = `
        <img src="${item.image}">

        <small>
          ${item.name}
        </small>

        <small>
          ${Number(item.price).toFixed(2)} ⛃
        </small>
      `;

      div.onclick = () => {

        const exists =
          Upgrader.selectedWagers.find(
            i =>
              i.key === key
          );

        if (exists) {

          Upgrader.selectedWagers =
            Upgrader.selectedWagers.filter(
              i =>
                i.key !== key
            );

        } else {

          Upgrader.selectedWagers.push({
            item,
            index,
            key
          });
        }

        renderWager();

        updateUI();
      };

      box.appendChild(
        div
      );
    }
  );
}


// =========================
// TARGET RENDER
// =========================

function renderTarget() {

  const box =
    document.getElementById(
      "target-list"
    );

  if (!box) {
    return;
  }

  box.innerHTML = "";

  let allItems = [];

  cases.forEach(
    c => {

      if (
        !Array.isArray(c.items)
      ) {
        return;
      }

      c.items.forEach(
        item => {

          allItems.push(
            item
          );
        }
      );
    }
  );


  allItems.forEach(
    (item, index) => {

      const key =
        getKey(
          item,
          index
        );

      const selected =
        Upgrader.selectedTargets.some(
          i =>
            i.key === key
        );

      const div =
        document.createElement(
          "div"
        );

      div.className =
        `upgrade-item ${
          item.rarity
        } ${
          selected
            ? "selected"
            : ""
        }`;

      div.innerHTML = `
        <img src="${item.image}">

        <small>
          ${item.name}
        </small>

        <small>
          ${Number(item.price).toFixed(2)} ⛃
        </small>
      `;

      div.onclick = () => {

        const exists =
          Upgrader.selectedTargets.find(
            i =>
              i.key === key
          );

        if (exists) {

          Upgrader.selectedTargets =
            Upgrader.selectedTargets.filter(
              i =>
                i.key !== key
            );

        } else {

          Upgrader.selectedTargets.push({
            item,
            index,
            key
          });
        }

        renderTarget();

        updateUI();
      };

      box.appendChild(
        div
      );
    }
  );
}


// =========================
// UI UPDATE
// =========================

function updateUI() {

  const chanceBox =
    document.getElementById(
      "upgrade-chance"
    );

  const valueBox =
    document.getElementById(
      "upgrade-value"
    );


  const wager =
    Upgrader.selectedWagers.reduce(
      (a, b) =>
        a +
        (
          Number(
            b.item.price
          ) || 0
        ),
      0
    );


  const target =
    Upgrader.selectedTargets.reduce(
      (a, b) =>
        a +
        (
          Number(
            b.item.price
          ) || 0
        ),
      0
    );


  const chance =
    target
      ? Math.min(
          100,
          (
            wager *
            0.95 /
            target
          ) * 100
        )
      : 0;


  if (chanceBox) {

    chanceBox.textContent =
      `Chance: ${chance.toFixed(2)}%`;
  }


  if (valueBox) {

    valueBox.textContent =
      `${wager.toFixed(2)} ⛃ → ${target.toFixed(2)} ⛃`;
  }


  if (
    typeof updateUpgradeCircle ===
    "function"
  ) {

    updateUpgradeCircle(
      chance
    );
  }
}


// =========================
// UPGRADE BUTTON SETUP
// =========================

function setupUpgradeButton() {

  const upgradeButton =
    document.getElementById(
      "upgrade-btn"
    );

  if (!upgradeButton) {
    return;
  }

  // Prevent duplicate listeners.

  if (
    upgradeButton.dataset
      .upgradeBound === "true"
  ) {
    return;
  }

  upgradeButton.dataset
    .upgradeBound = "true";


  upgradeButton.onclick = () => {

    if (
      Upgrader.upgrading
    ) {
      return;
    }


    if (
      !Upgrader.selectedWagers.length ||
      !Upgrader.selectedTargets.length
    ) {
      return;
    }


    const wager =
      Upgrader.selectedWagers.reduce(
        (a, b) =>
          a +
          (
            Number(
              b.item.price
            ) || 0
          ),
        0
      );


    const target =
      Upgrader.selectedTargets.reduce(
        (a, b) =>
          a +
          (
            Number(
              b.item.price
            ) || 0
          ),
        0
      );


    if (
      target <= 0
    ) {
      return;
    }


    const chance =
      Math.min(
        100,
        (
          wager *
          0.95 /
          target
        ) * 100
      );


    Upgrader.upgrading =
      true;


    const circle =
      document.getElementById(
        "upgrade-circle"
      );

    const fill =
      document.getElementById(
        "upgrade-circle-fill"
      );

    const text =
      document.getElementById(
        "upgrade-circle-text"
      );


    if (circle) {

      circle.classList.remove(
        "win",
        "lose"
      );
    }


    if (fill) {

      fill.style.background =
        "green";

      fill.style.height =
        `${chance}%`;
    }


    if (text) {

      text.textContent =
        `${chance.toFixed(2)}%`;
    }


    // =====================
    // 2 SECOND PAUSE
    // =====================

    setTimeout(
      () => {

        const roll =
          Math.random() * 100;

        const win =
          roll <= chance;


        if (win) {

          Upgrader.selectedTargets
            .forEach(
              targetEntry => {

                inventory.push({
                  ...targetEntry.item
                });
              }
            );


          if (circle) {

            circle.classList.add(
              "win"
            );
          }


          if (fill) {

            fill.style.background =
              "lime";
          }


          if (text) {

            text.textContent =
              "WIN!";
          }

        } else {

          if (circle) {

            circle.classList.add(
              "lose"
            );
          }


          if (fill) {

            fill.style.background =
              "red";
          }


          if (text) {

            text.textContent =
              "LOSE!";
          }
        }


        // =====================
        // REMOVE WAGER ITEMS
        // =====================

        /*
         * Remove by original inventory
         * index, highest index first,
         * so earlier indexes don't shift.
         */

        Upgrader.selectedWagers
          .sort(
            (a, b) =>
              b.index -
              a.index
          )
          .forEach(
            wagerEntry => {

              inventory.splice(
                wagerEntry.index,
                1
              );
            }
          );


        Upgrader.selectedWagers =
          [];

        Upgrader.selectedTargets =
          [];


        saveInventory();

        renderInventory();

        renderWager();

        renderTarget();

        updateUI();

        updateBackpackValue();

        populateCoinflipDropdown();


        Upgrader.upgrading =
          false;

      },
      2000
    );
  };
}

