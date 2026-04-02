import {
  loadDataset,
  saveDataset,
  clearLocalDataset,
  fetchFromFiles,
} from "../../shared/js/dataService.js";

/** @type {string} */
let activeTab = "movies";
/** @type {Record<string, unknown[]> | null} */
let data = null;
/** @type {string | null} */
let editingId = null;

const TAB_KEYS = ["movies", "events", "plays", "sports", "trending"];

function $(sel) {
  return document.querySelector(sel);
}

async function refreshData() {
  data = await loadDataset();
}

function currentList() {
  if (!data) return [];
  const list = data[activeTab];
  return Array.isArray(list) ? list : [];
}

function persist() {
  if (data) saveDataset(data);
}

function renderTable() {
  const tbody = $("#data-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  const items = currentList();
  items.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(String(row.id))}</td>
      <td>${escapeHtml(String(row.title))}</td>
      <td>${escapeHtml(String(row.language))}</td>
      <td>${escapeHtml(String(row.genre))}</td>
      <td>${escapeHtml(String(row.age_rating))}</td>
      <td class="admin-table__actions">
        <button type="button" class="btn" data-action="edit" data-id="${escapeAttr(
          String(row.id)
        )}">Edit</button>
        <button type="button" class="btn btn--danger" data-action="delete" data-id="${escapeAttr(
          String(row.id)
        )}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
      if (!id) return;
      if (action === "edit") openEditor(id);
      if (action === "delete") deleteItem(id);
    });
  });
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

function openEditor(id) {
  const panel = $("#editor-panel");
  const items = currentList();
  editingId = id;
  const item = items.find((x) => String(x.id) === String(id));
  if (!item || !panel) return;
  panel.classList.remove("hidden");
  $("#f-id").value = String(item.id);
  $("#f-id").readOnly = true;
  $("#f-title").value = String(item.title);
  $("#f-image").value = String(item.image);
  $("#f-language").value = String(item.language);
  $("#f-genre").value = String(item.genre);
  $("#f-age").value = String(item.age_rating);
  $("#f-desc").value = String(item.description);
  $("#editor-heading").textContent = "Edit item";
}

function openNew() {
  const panel = $("#editor-panel");
  if (!panel) return;
  editingId = "__new__";
  panel.classList.remove("hidden");
  $("#f-id").readOnly = false;
  $("#f-id").value = "";
  $("#f-title").value = "";
  $("#f-image").value = "";
  $("#f-language").value = "";
  $("#f-genre").value = "";
  $("#f-age").value = "";
  $("#f-desc").value = "";
  $("#editor-heading").textContent = "New item";
}

function closeEditor() {
  $("#editor-panel")?.classList.add("hidden");
  editingId = null;
}

function saveEditor() {
  if (!data) return;
  const id = $("#f-id").value.trim();
  const title = $("#f-title").value.trim();
  const image = $("#f-image").value.trim();
  const language = $("#f-language").value.trim();
  const genre = $("#f-genre").value.trim();
  const age_rating = $("#f-age").value.trim();
  const description = $("#f-desc").value.trim();
  if (!id || !title || !image || !language || !genre || !age_rating || !description) {
    return;
  }

  const list = currentList().slice();
  const entry = { id, title, image, language, age_rating, genre, description };

  if (editingId === "__new__") {
    if (list.some((x) => String(x.id) === id)) {
      alert("ID already exists.");
      return;
    }
    list.push(entry);
  } else {
    const idx = list.findIndex((x) => String(x.id) === String(editingId));
    if (idx === -1) return;
    if (String(id) !== String(editingId) && list.some((x) => String(x.id) === id)) {
      alert("ID already exists.");
      return;
    }
    list[idx] = entry;
  }

  data[activeTab] = list;
  persist();
  closeEditor();
  renderTable();
}

function deleteItem(id) {
  if (!data || !confirm("Delete this item?")) return;
  const list = currentList().filter((x) => String(x.id) !== String(id));
  data[activeTab] = list;
  persist();
  renderTable();
}

function setTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".admin-tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tab === tab);
  });
  closeEditor();
  renderTable();
}

async function reloadFromFiles() {
  if (!confirm("Discard local overrides and reload bundled JSON files?")) return;
  clearLocalDataset();
  data = await fetchFromFiles();
  renderTable();
}

async function init() {
  await refreshData();

  TAB_KEYS.forEach((tab) => {
    $(`.admin-tab[data-tab="${tab}"]`)?.addEventListener("click", () => setTab(tab));
  });

  $("#btn-add")?.addEventListener("click", () => openNew());
  $("#btn-save")?.addEventListener("click", (e) => {
    e.preventDefault();
    saveEditor();
  });
  $("#btn-cancel")?.addEventListener("click", () => closeEditor());
  $("#editor-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    saveEditor();
  });
  $("#btn-reload-json")?.addEventListener("click", () => reloadFromFiles());

  renderTable();
}

init();
