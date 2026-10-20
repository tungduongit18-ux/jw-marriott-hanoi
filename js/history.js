// Trang Lịch sử đặt: hiển thị, tìm kiếm, lọc và huỷ các đơn đã đặt (lưu trong localStorage)
document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("historyList");
  const emptyEl = document.getElementById("historyEmpty");
  const searchInput = document.getElementById("historySearch");
  const tabs = document.querySelectorAll(".history-tabs .tab");
  const modal = document.getElementById("cancelModal");

  let currentFilter = "all";
  let pendingCancelCode = null;

  migrateLastOrder();
  render();

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      render();
    });
  });

  searchInput.addEventListener("input", render);

  // ----- Huỷ đơn -----
  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cancel]");
    if (!btn) return;
    pendingCancelCode = btn.dataset.cancel;
    document.getElementById("cancelCode").textContent = `#${pendingCancelCode}`;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("show"));
  });

  const closeModal = () => {
    modal.classList.remove("show");
    setTimeout(() => (modal.hidden = true), 200);
    pendingCancelCode = null;
  };
  document.getElementById("cancelNo").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  document.getElementById("cancelYes").addEventListener("click", () => {
    const history = getBookingHistory();
    const order = history.find((o) => o.bookingCode === pendingCancelCode);
    if (order) {
      order.status = "cancelled";
      order.cancelledAt = new Date().toISOString();
      saveBookingHistory(history);
    }
    closeModal();
    render();
  });

  // ----- Vẽ danh sách -----
  function render() {
    const history = getBookingHistory();
    updateStats(history);

    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = history.filter((o) => {
      const status = getStatus(o);
      if (currentFilter === "room" && o.type === "table") return false;
      if (currentFilter === "table" && o.type !== "table") return false;
      if (currentFilter === "cancelled" && status !== "cancelled") return false;
      if (!keyword) return true;
      return [o.bookingCode, o.guestName, o.email, o.roomTitle, o.phone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(keyword));
    });

    listEl.replaceChildren(...filtered.map(createCard));

    const isEmpty = filtered.length === 0;
    emptyEl.hidden = !isEmpty;
    if (isEmpty) {
      const noData = history.length === 0;
      document.getElementById("historyEmptyTitle").textContent = noData
        ? "Quý khách chưa có đơn đặt nào"
        : "Không tìm thấy đơn phù hợp";
      document.getElementById("historyEmptyText").textContent = noData
        ? "Hãy chọn phòng nghỉ hoặc đặt bàn tại nhà hàng để bắt đầu."
        : "Hãy thử từ khoá khác hoặc chọn mục lọc khác.";
      emptyEl.querySelector(".history-empty__actions").hidden = !noData;
    }
  }

  function updateStats(history) {
    const active = history.filter((o) => getStatus(o) === "confirmed").length;
    const cancelled = history.filter((o) => getStatus(o) === "cancelled").length;
    const spent = history
      .filter((o) => getStatus(o) !== "cancelled")
      .reduce((sum, o) => sum + parseMoney(o.totalPrice), 0);
    document.getElementById("statTotal").textContent = history.length;
    document.getElementById("statActive").textContent = active;
    document.getElementById("statCancelled").textContent = cancelled;
    document.getElementById("statSpent").textContent = spent.toLocaleString("en-US");
  }

  // Tạo thẻ đơn bằng DOM + textContent (không ghép chuỗi HTML từ dữ liệu người dùng nhập)
  function createCard(order) {
    const status = getStatus(order);
    const isTable = order.type === "table";

    const card = el("article", `history-card status-${status}`);

    const imgWrap = el("div", "history-card__img");
    if (order.roomImage) {
      const img = document.createElement("img");
      img.src = order.roomImage;
      img.alt = order.roomTitle || "";
      img.loading = "lazy";
      imgWrap.append(img);
    }
    card.append(imgWrap);

    const body = el("div", "history-card__body");

    const top = el("div", "history-card__top");
    top.append(
      el("span", "badge badge-type", isTable ? "Đặt bàn" : "Đặt phòng"),
      el("span", `badge badge-${status}`, STATUS_LABEL[status]),
      el("span", "history-card__code", `#${order.bookingCode || "—"}`),
    );
    body.append(top);

    body.append(el("h3", "history-card__title", order.roomTitle || "—"));

    const info = el("dl", "history-card__info");
    addInfo(info, isTable ? "Thời gian" : "Lưu trú", order.stayDates);
    if (!isTable && order.rooms > 1) addInfo(info, "Số phòng", `${order.rooms} phòng`);
    if (order.offerTitle) addInfo(info, "Ưu đãi", order.offerTitle);
    if (order.voucher) addInfo(info, "Phiếu giảm giá", `${order.voucher.code} (−${order.voucher.pct}%)`);
    addInfo(info, "Số khách", order.guests || (order.guestCount ? `${order.guestCount} khách` : ""));
    if (isTable && (order.packageName || (order.serviceDetails || []).length)) {
      addInfo(info, "Dịch vụ", [order.packageName, ...(order.serviceDetails || [])].filter(Boolean).join(" · "));
    }
    addInfo(info, "Người đặt", order.guestName);
    addInfo(info, "Liên hệ", [order.email, order.phone].filter(Boolean).join(" · "));
    addInfo(info, "Ngày đặt", formatDateTime(order.createdAt));
    if (status === "cancelled" && order.cancelledAt) {
      addInfo(info, "Ngày huỷ", formatDateTime(order.cancelledAt));
    }
    body.append(info);

    const footer = el("div", "history-card__footer");
    const total = el("div", "history-card__total");
    total.append(el("small", "", "Tổng chi phí"), el("strong", "", order.totalPrice || "—"));
    footer.append(total);

    if (status === "confirmed") {
      const cancelBtn = el("button", "btn-outline-danger", "Huỷ đơn");
      cancelBtn.type = "button";
      cancelBtn.dataset.cancel = order.bookingCode;
      footer.append(cancelBtn);
    }
    body.append(footer);
    card.append(body);
    return card;
  }
});

const STATUS_LABEL = {
  confirmed: "Đã xác nhận",
  completed: "Đã hoàn thành",
  cancelled: "Đã huỷ",
};

// Đơn đã qua ngày nhận phòng/ngày hẹn thì coi là đã hoàn thành
function getStatus(order) {
  if (order.status === "cancelled") return "cancelled";
  if (order.checkIn) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${order.checkIn}T00:00:00`) < today) return "completed";
  }
  return "confirmed";
}

// Đơn đặt trước khi có tính năng lịch sử (chỉ nằm ở lastOrder) -> đưa vào lịch sử
function migrateLastOrder() {
  try {
    const last = JSON.parse(localStorage.getItem("lastOrder") || "null");
    if (!last || !last.bookingCode) return;
    const history = getBookingHistory();
    if (history.some((o) => o.bookingCode === last.bookingCode)) return;
    history.unshift({ status: "confirmed", type: "room", ...last });
    saveBookingHistory(history);
  } catch (e) {
    /* bỏ qua dữ liệu lỗi */
  }
}

function parseMoney(text) {
  return Number(String(text || "").replace(/[^0-9.]/g, "")) || 0;
}

function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function addInfo(dl, label, value) {
  if (!value) return;
  const row = el("div", "info-row");
  row.append(el("dt", "", label), el("dd", "", value));
  dl.append(row);
}
