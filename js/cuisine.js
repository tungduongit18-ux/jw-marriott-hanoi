// Trang Ẩm thực: chi tiết từng nhà hàng + form đặt bàn có gói dịch vụ
// Dữ liệu nhà hàng nằm trong js/restaurants-data.js
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("tableBookingModal");
  const form = document.getElementById("tableBookingForm");
  const dateInput = document.getElementById("bookDate");
  const guestsSelect = document.getElementById("bookGuests");
  const timeSelect = document.getElementById("bookTime");
  const seatingSelect = document.getElementById("bookSeating");
  const occasionSelect = document.getElementById("bookOccasion");
  const packageBox = document.getElementById("packageOptions");
  const addonBox = document.getElementById("addonOptions");
  const noteInput = document.getElementById("bookNote");
  const priceBox = document.getElementById("tableBookingPrice");

  let current = null; // { key, data, image }

  /* ---------- 1. Phần "Xem chi tiết" của từng nhà hàng ---------- */
  document.querySelectorAll(".resto-card[data-resto]").forEach((card) => {
    const data = RESTAURANTS[card.dataset.resto];
    if (!data) return;
    const panel = buildDetailPanel(card.dataset.resto, data);
    card.after(panel);

    const toggle = card.querySelector(".link-more");
    toggle?.addEventListener("click", () => {
      const open = !panel.classList.contains("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.firstChild.textContent = open ? "Thu gọn " : "Xem chi tiết ";
      if (open) {
        panel.classList.add("open");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      } else {
        // từ "none" về chiều cao thật rồi mới thu về 0 để có hiệu ứng
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        panel.offsetHeight; // ép trình duyệt tính lại layout
        panel.classList.remove("open");
        panel.style.maxHeight = "0px";
      }
    });
    // mở xong thì bỏ giới hạn chiều cao (để không bị cắt khi đổi cỡ màn hình)
    panel.addEventListener("transitionend", () => {
      if (panel.classList.contains("open")) panel.style.maxHeight = "none";
    });
  });

  // nút "Đặt bàn" trên thẻ và nút trong phần chi tiết
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-outline, [data-book]");
    if (!btn) return;
    const key = btn.dataset.book || btn.closest(".resto-card")?.dataset.resto;
    if (!key || !RESTAURANTS[key]) return;
    e.preventDefault();
    const card = document.querySelector(`.resto-card[data-resto="${key}"]`);
    openBooking(key, card?.querySelector(".resto-img img")?.getAttribute("src") || "", btn.dataset.package);
  });

  /* ---------- 2. Form đặt bàn ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const now = new Date();
  dateInput.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  for (let g = 1; g <= 10; g++) guestsSelect.append(new Option(`${g} khách`, g));
  guestsSelect.value = 2;
  OCCASIONS.forEach((o) => occasionSelect.append(new Option(o, o)));
  ADD_ONS.forEach((a) => {
    const label = document.createElement("label");
    label.className = "addon-item";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = a.id;
    const text = document.createElement("span");
    text.textContent = a.name;
    const price = document.createElement("em");
    price.textContent = a.price ? `+${a.price} USD` : "Miễn phí";
    label.append(input, text, price);
    addonBox.append(label);
  });

  function openBooking(key, image, packageId) {
    const data = RESTAURANTS[key];
    current = { key, data, image };
    document.getElementById("modalRestoTitle").textContent = `Đặt bàn: ${data.name}`;

    // gói dịch vụ dạng thẻ chọn
    packageBox.replaceChildren(
      ...data.packages.map((p, i) => {
        const label = document.createElement("label");
        label.className = "package-item";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "package";
        input.value = p.id;
        input.checked = packageId ? p.id === packageId : i === 0;
        const body = document.createElement("span");
        body.className = "package-item__body";
        const name = document.createElement("strong");
        name.textContent = p.name;
        const desc = document.createElement("small");
        desc.textContent = p.desc;
        body.append(name, desc);
        const price = document.createElement("em");
        price.textContent = `${p.price} USD/người`;
        label.append(input, body, price);
        return label;
      }),
    );

    seatingSelect.replaceChildren(
      ...data.seating.map((s, i) => new Option(s.price ? `${s.name} (+${s.price} USD)` : s.name, i)),
    );
    occasionSelect.value = OCCASIONS[0];
    addonBox.querySelectorAll("input").forEach((i) => (i.checked = false));
    noteInput.value = "";

    refreshTimes();
    updateSummary();
    modal.style.display = "flex";
    modal.querySelector(".modal-content").scrollTop = 0;
  }

  const getPackage = () => {
    const id = packageBox.querySelector("input:checked")?.value;
    return current.data.packages.find((p) => p.id === id) || current.data.packages[0];
  };

  // khung giờ phụ thuộc gói dịch vụ (vd. buffet sáng chỉ có giờ sáng)
  function refreshTimes() {
    const pkg = getPackage();
    const times = pkg.times || current.data.times;
    const previous = timeSelect.value;
    timeSelect.replaceChildren(...times.map((t) => new Option(labelForTime(t), t)));
    if (times.includes(previous)) timeSelect.value = previous;
  }

  function calcTotal() {
    const pkg = getPackage();
    const guests = Number(guestsSelect.value);
    const seat = current.data.seating[Number(seatingSelect.value)] || { price: 0 };
    const addons = ADD_ONS.filter((a) => addonBox.querySelector(`input[value="${a.id}"]`)?.checked);
    const addonTotal = addons.reduce((sum, a) => sum + a.price, 0);
    return { pkg, guests, seat, addons, total: pkg.price * guests + seat.price + addonTotal };
  }

  function updateSummary() {
    const { pkg, guests, seat, addons, total } = calcTotal();
    const lines = [[`${pkg.name}: ${pkg.price} USD × ${guests} khách`, pkg.price * guests]];
    if (seat.price) lines.push([seat.name, seat.price]);
    addons.filter((a) => a.price).forEach((a) => lines.push([a.name, a.price]));

    priceBox.replaceChildren(
      ...lines.map(([label, value]) => {
        const row = document.createElement("div");
        const l = document.createElement("span");
        l.textContent = label;
        const v = document.createElement("span");
        v.textContent = `${value.toLocaleString("en-US")} USD`;
        row.append(l, v);
        return row;
      }),
    );
    const totalRow = document.createElement("div");
    totalRow.className = "price-summary__total";
    const tl = document.createElement("span");
    tl.textContent = "Tổng cộng";
    const tv = document.createElement("strong");
    tv.textContent = `${total.toLocaleString("en-US")} USD`;
    totalRow.append(tl, tv);
    priceBox.append(totalRow);
  }

  packageBox.addEventListener("change", () => {
    refreshTimes();
    updateSummary();
  });
  [guestsSelect, seatingSelect].forEach((el) => el.addEventListener("change", updateSummary));
  addonBox.addEventListener("change", updateSummary);
  dateInput.addEventListener("change", () => dateInput.setCustomValidity(""));
  timeSelect.addEventListener("change", () => dateInput.setCustomValidity(""));

  // đóng modal
  const closeModal = () => (modal.style.display = "none");
  document.getElementById("closeTableModal")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { pkg, guests, seat, addons, total } = calcTotal();
    const date = dateInput.value;
    const time = timeSelect.value;

    // Kumihimo chỉ phục vụ trưa vào cuối tuần
    if (current.data.lunchWeekendOnly && isLunch(time)) {
      const day = new Date(`${date}T00:00:00`).getDay();
      if (day !== 0 && day !== 6) {
        dateInput.setCustomValidity("Nhà hàng chỉ phục vụ bữa trưa vào thứ 7 và Chủ nhật. Vui lòng chọn ngày cuối tuần hoặc giờ tối.");
        dateInput.reportValidity();
        return;
      }
    }
    // không cho đặt giờ đã qua trong ngày hôm nay
    if (new Date(`${date}T${time}:00`) < new Date()) {
      dateInput.setCustomValidity("Khung giờ này đã qua, vui lòng chọn giờ khác.");
      dateInput.reportValidity();
      return;
    }
    dateInput.setCustomValidity("");

    const details = [`Khu vực: ${seat.name}`];
    if (occasionSelect.value !== OCCASIONS[0]) details.push(`Dịp: ${occasionSelect.value}`);
    if (addons.length) details.push(`Dịch vụ thêm: ${addons.map((a) => a.name).join(", ")}`);
    if (noteInput.value.trim()) details.push(`Ghi chú: ${noteInput.value.trim()}`);

    const booking = {
      type: "table",
      restaurantKey: current.key,
      title: current.data.name,
      image: current.image,
      checkIn: date,
      stayDates: `${time} — ${new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}`,
      guests: `${guests} khách`,
      guestCount: guests,
      packageName: pkg.name,
      pricePerPerson: pkg.price,
      serviceDetails: details,
      price: total,
      currency: "USD",
    };
    localStorage.setItem("selectedRoom", JSON.stringify(booking));
    goTo("checkout.html", { message: "Đang chuyển đến trang thanh toán…", delay: 600 });
  });
});

/* ---------- Tạo phần chi tiết nhà hàng ---------- */
function buildDetailPanel(key, data) {
  const panel = document.createElement("section");
  panel.className = "resto-detail";
  panel.setAttribute("aria-label", `Chi tiết ${data.name}`);

  const inner = document.createElement("div");
  inner.className = "resto-detail__inner";

  const intro = document.createElement("p");
  intro.className = "resto-detail__intro";
  intro.textContent = data.intro;

  const info = document.createElement("dl");
  info.className = "resto-detail__info";
  [["Vị trí", data.info.location], ["Sức chứa", data.info.capacity], ["Trang phục", data.info.dressCode], ["Phù hợp cho", data.info.suitable]]
    .forEach(([k, v]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = k;
      const dd = document.createElement("dd");
      dd.textContent = v;
      row.append(dt, dd);
      info.append(row);
    });

  const cols = document.createElement("div");
  cols.className = "resto-detail__cols";

  // Món đặc trưng
  const dishesCol = document.createElement("div");
  dishesCol.append(heading("Món đặc trưng"));
  const dishList = document.createElement("ul");
  dishList.className = "menu-list";
  data.dishes.forEach((d) => {
    const li = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = d.name;
    const price = document.createElement("span");
    price.className = "menu-price";
    price.textContent = d.price ? `${d.price} USD` : "Có trong buffet";
    const desc = document.createElement("small");
    desc.textContent = d.desc;
    li.append(name, price, desc);
    dishList.append(li);
  });
  dishesCol.append(dishList);

  // Gói dịch vụ đặt bàn
  const pkgCol = document.createElement("div");
  pkgCol.append(heading("Gói dịch vụ đặt bàn"));
  const pkgList = document.createElement("ul");
  pkgList.className = "menu-list";
  data.packages.forEach((p) => {
    const li = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = p.name;
    const price = document.createElement("span");
    price.className = "menu-price";
    price.textContent = `${p.price} USD/người`;
    const desc = document.createElement("small");
    desc.textContent = p.times ? `${p.desc} · ${p.times[0]}–${p.times[p.times.length - 1]}` : p.desc;
    const book = document.createElement("button");
    book.type = "button";
    book.className = "pkg-book";
    book.dataset.book = key;
    book.dataset.package = p.id;
    book.textContent = "Chọn gói này";
    li.append(name, price, desc, book);
    pkgList.append(li);
  });
  pkgCol.append(pkgList);

  cols.append(dishesCol, pkgCol);
  inner.append(intro, info, cols);
  panel.append(inner);
  return panel;
}

function heading(text) {
  const h = document.createElement("h4");
  h.className = "resto-detail__heading";
  h.textContent = text;
  return h;
}

function isLunch(time) {
  const h = Number(time.split(":")[0]);
  return h >= 11 && h < 15;
}

function labelForTime(t) {
  const h = Number(t.split(":")[0]);
  const meal = h < 11 ? "Bữa sáng" : h < 15 ? "Bữa trưa" : h < 17 ? "Buổi chiều" : "Bữa tối";
  return `${t} (${meal})`;
}


/* Thu gọn / Xem thêm đoạn giới thiệu Ẩm thực */
document.addEventListener("DOMContentLoaded", () => {
  const desc = document.getElementById("introDesc");
  const btn = document.getElementById("introToggle");
  if (!desc || !btn) return;

  btn.addEventListener("click", () => {
    const collapsed = desc.classList.toggle("is-collapsed");
    btn.setAttribute("aria-expanded", String(!collapsed));
    btn.firstElementChild.textContent = collapsed ? "Xem thêm" : "Thu gọn";
  });
});


/* Nút "Khám phá": cuộn tới nhà hàng, mở chi tiết, làm sáng thẻ */
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-goto]");
    if (!trigger) return;
    const card = document.querySelector(`.resto-card[data-resto="${trigger.dataset.goto}"]`);
    if (!card) return;
    e.preventDefault();

    const toggle = card.querySelector(".link-more");
    if (toggle && toggle.getAttribute("aria-expanded") !== "true") toggle.click();

    card.scrollIntoView({ behavior: "smooth", block: "start" });
    card.classList.remove("resto-highlight");
    void card.offsetWidth; // chạy lại hiệu ứng nếu bấm nhiều lần
    card.classList.add("resto-highlight");
    setTimeout(() => card.classList.remove("resto-highlight"), 2100);
  });
});

/* Popup đăng ký hội viên Marriott Bonvoy (giả lập, lưu trong localStorage) */
document.addEventListener("DOMContentLoaded", () => {
  const MEMBER_KEY = "memberProfile";
  const modal = document.getElementById("memberModal");
  const openBtn = document.getElementById("openMemberModal");
  if (!modal || !openBtn) return;

  const form = document.getElementById("memberForm");
  const success = document.getElementById("memberSuccess");
  const codeBox = document.getElementById("memberCode");
  const titleBox = document.getElementById("memberSuccessTitle");
  const fields = {
    memberName: document.getElementById("memberName"),
    memberEmail: document.getElementById("memberEmail"),
    memberPhone: document.getElementById("memberPhone"),
  };
  const agree = document.getElementById("memberAgree");
  let lastFocus = null;

  const readMember = () => {
    try { return JSON.parse(localStorage.getItem(MEMBER_KEY) || "null"); }
    catch (err) { return null; }
  };

  const setError = (id, msg) => {
    const out = form.querySelector(`.field-error[data-for="${id}"]`);
    if (out) out.textContent = msg || "";
    const input = document.getElementById(id);
    if (input && input.type !== "checkbox") input.classList.toggle("invalid", !!msg);
  };

  const showForm = () => {
    form.hidden = false;
    success.hidden = true;
  };
  // Hai phiếu giảm giá cho lần đặt đầu tiên: 10% đặt phòng, 20% đặt bàn ẩm thực
  const VOUCHERS = [
    { key: "memberVoucher", pct: 10, prefix: "WELCOME10", box: "voucherRoom", label: "đặt phòng" },
    { key: "memberVoucherDining", pct: 20, prefix: "DINE20", box: "voucherDining", label: "đặt bàn" },
  ];
  const isActive = (v) => v && !v.used && new Date(v.expiresAt) > new Date();
  const ensureVoucher = (m, def) => {
    let v = null;
    try { v = JSON.parse(localStorage.getItem(def.key) || "null"); } catch (e) { /* bỏ qua */ }
    if (!v) {
      v = { code: `${def.prefix}-${m.code.slice(-4)}`, pct: def.pct, used: false, expiresAt: new Date(Date.now() + 30 * 864e5).toISOString() };
      try { localStorage.setItem(def.key, JSON.stringify(v)); } catch (e) { /* bỏ qua */ }
    }
    return v;
  };
  const showVoucher = (m) => {
    document.getElementById("memberVoucher").hidden = false;
    VOUCHERS.forEach((def) => {
      const box = document.getElementById(def.box), v = ensureVoucher(m, def);
      const exp = new Date(v.expiresAt);
      box.querySelector(".mv-pct").textContent = `−${v.pct}%`;
      box.querySelector(".mv-code").textContent = v.code;
      box.querySelector("small").textContent = v.used ? "Phiếu đã được sử dụng."
        : exp < new Date() ? "Phiếu đã hết hạn." : `Lần ${def.label} đầu tiên · hạn ${exp.toLocaleDateString("vi-VN")}`;
      box.classList.toggle("is-off", !isActive(v));
    });
  };
  // Hiển thị thẻ hội viên ngay trên trang (không cần mở cửa sổ đăng ký)
  const perkEl = document.getElementById("memberPerk");
  const card = document.getElementById("memberCard");
  const actions = document.getElementById("memberActions");
  const refreshPerk = () => {
    const m = readMember();
    const isMember = !!(m && m.code);
    if (perkEl) perkEl.hidden = isMember;
    openBtn.hidden = isMember;
    if (card) card.hidden = !isMember;
    if (actions) actions.hidden = !isMember;
    if (!isMember) return;
    VOUCHERS.forEach((def) => ensureVoucher(m, def)); // đảm bảo phiếu giảm giá có sẵn cho trang thanh toán
    document.getElementById("mcName").textContent = m.name || "";
    document.getElementById("mcCode").textContent = m.code;
  };
  const showSuccess = (member, already) => {
    form.hidden = true;
    success.hidden = false;
    codeBox.textContent = member.code;
    showVoucher(member);
    titleBox.textContent = already ? `Bạn đã là hội viên${member.name ? ", " + member.name : ""}!` : "Đăng ký thành công!";
  };

  refreshPerk();

  const open = () => {
    lastFocus = document.activeElement;
    const member = readMember();
    if (member && member.code) showSuccess(member, true);
    else showForm();
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    (member ? document.getElementById("memberDone") : fields.memberName).focus();
  };
  const close = () => {
    modal.style.display = "none";
    document.body.style.overflow = "";
    lastFocus?.focus?.();
  };

  // Nút "Đặt Bàn Với Ưu Đãi Hội Viên": cuộn tới danh sách nhà hàng
  document.getElementById("memberBookBtn")?.addEventListener("click", () => {
    document.querySelector(".restaurant-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  // Nút "Huỷ hội viên": mở hộp thoại xác nhận, đồng ý thì xoá hồ sơ và các phiếu giảm giá đã lưu
  const cancelModal = document.getElementById("cancelModal");
  const openCancel = () => { cancelModal.style.display = "flex"; document.body.style.overflow = "hidden"; document.getElementById("cancelKeepBtn").focus(); };
  const closeCancel = () => { cancelModal.style.display = "none"; document.body.style.overflow = ""; };
  document.getElementById("memberCancelBtn")?.addEventListener("click", openCancel);
  document.getElementById("cancelKeepBtn")?.addEventListener("click", closeCancel);
  cancelModal?.addEventListener("click", (e) => { if (e.target === cancelModal) closeCancel(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && cancelModal?.style.display === "flex") closeCancel(); });
  document.getElementById("cancelConfirmBtn")?.addEventListener("click", () => {
    try {
      [MEMBER_KEY, ...VOUCHERS.map((d) => d.key)].forEach((k) => localStorage.removeItem(k));
    } catch (err) { console.error("Không huỷ được hội viên:", err); }
    form.reset();
    closeCancel();
    refreshPerk();
  });

  openBtn.addEventListener("click", open);
  document.getElementById("closeMemberModal").addEventListener("click", close);
  document.getElementById("memberDone").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") close();
  });

  Object.keys(fields).forEach((id) => fields[id].addEventListener("input", () => setError(id, "")));
  agree.addEventListener("change", () => setError("memberAgree", ""));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = fields.memberName.value.trim().replace(/\s+/g, " ");
    const email = fields.memberEmail.value.trim();
    const phone = fields.memberPhone.value.trim().replace(/[\s.-]/g, "");

    let ok = true;
    const check = (id, valid, msg) => { setError(id, valid ? "" : msg); if (!valid) ok = false; };
    check("memberName", name.split(" ").length >= 2, "Vui lòng nhập đầy đủ họ và tên.");
    check("memberEmail", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email), "Email chưa hợp lệ.");
    check("memberPhone", /^(\+?\d{8,15})$/.test(phone), "Số điện thoại chưa hợp lệ.");
    check("memberAgree", agree.checked, "Bạn cần đồng ý điều khoản để tiếp tục.");
    if (!ok) { form.querySelector(".invalid")?.focus(); return; }

    const digits = String(Math.floor(Math.random() * 1e9)).padStart(9, "0");
    const member = { code: `JW${digits}`, name, email, phone, createdAt: new Date().toISOString() };
    try { localStorage.setItem(MEMBER_KEY, JSON.stringify(member)); }
    catch (err) { console.error("Không lưu được thông tin hội viên:", err); }
    showSuccess(member, false);
    refreshPerk();
  });
});

// Bấm thẻ ưu đãi -> mở trang Ưu đãi, tự bật chi tiết ưu đãi đó
document.addEventListener("click", (e) => {
  const card = e.target.closest(".offer-card[data-offer]");
  if (card) goTo(`offers.html?id=${card.dataset.offer}`);
});
