// Giỏ nhiều phòng. Lưu "roomCart" (mảng) và tự dựng "selectedRoom" gộp cho checkout/history.
const Cart = (() => {
  const KEY = "roomCart";
  const get = () => { try { const a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
  const count = () => get().reduce((s, i) => s + i.qty, 0);
  const offer = () => readStoredObject("activeOffer");
  const unit = (i) => Math.round(i.basePrice * (1 - ((offer() || {}).pct || 0) / 100));
  const usd = (n) => Number(n).toLocaleString("en-US");
  const short = (t) => t.split(" – ")[0];

  function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); sync(); badge(); renderDrawer(); }
  function add(item) { const l = get(), f = l.find((i) => i.roomId === item.roomId); f ? f.qty++ : l.push({ ...item, qty: 1 }); save(l); }
  function setQty(id, q) { save(get().map((i) => (i.roomId === id ? { ...i, qty: q } : i)).filter((i) => i.qty > 0)); }
  function clear() { localStorage.removeItem(KEY); localStorage.removeItem("selectedRoom"); badge(); renderDrawer(); }

  function stay() { const s = getBookingSearch(); return { s, nights: getNightCount(s.checkIn, s.checkOut) || 1 }; }
  function total() { const { nights } = stay(); return get().reduce((t, i) => t + unit(i) * i.qty, 0) * nights; }

  function sync() {
    const l = get();
    if (!l.length) { localStorage.removeItem("selectedRoom"); return; }
    const { s, nights } = stay(), rooms = count(), perNight = l.reduce((t, i) => t + unit(i) * i.qty, 0);
    localStorage.setItem("selectedRoom", JSON.stringify({
      roomId: l[0].roomId,
      title: rooms === 1 ? l[0].title : `${rooms} phòng: ` + l.map((i) => `${short(i.title)} ×${i.qty}`).join(", "),
      price: perNight * nights, nightlyPrice: perNight, nights, checkIn: s.checkIn, checkOut: s.checkOut,
      stayDates: formatStayDates(s.checkIn, s.checkOut), guests: s.guests, guestCount: parseInt(s.guests, 10) || 1,
      rooms, currency: "USD", image: l[0].image, items: l, offerTitle: (offer() || {}).title || "",
    }));
  }

  function badge() {
    const fab = document.getElementById("cartFab"), b = document.getElementById("cartBadge"), n = count();
    if (b) b.textContent = n;
    if (fab) fab.classList.toggle("has-item", n > 0);
  }

  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function drawer() {
    let d = document.getElementById("cartDrawer");
    if (d) return d;
    d = el("div", "cart-drawer"); d.id = "cartDrawer";
    d.innerHTML = '<div class="cart-drawer__bg"></div><aside class="cart-drawer__panel"><header><h3>Giỏ phòng của bạn</h3><button type="button" class="cart-x" aria-label="Đóng">&times;</button></header><div class="cart-drawer__body"></div><footer></footer></aside>';
    d.querySelector(".cart-drawer__bg").onclick = d.querySelector(".cart-x").onclick = () => d.classList.remove("open");
    document.body.appendChild(d); return d;
  }
  function openDrawer() { const d = drawer(); renderDrawer(); requestAnimationFrame(() => d.classList.add("open")); }

  function renderDrawer() {
    const d = document.getElementById("cartDrawer"); if (!d) return;
    const body = d.querySelector(".cart-drawer__body"), foot = d.querySelector("footer"), l = get(), { s, nights } = stay();
    body.replaceChildren(); foot.replaceChildren();
    if (!l.length) { body.append(el("p", "cart-empty", "Giỏ đang trống. Hãy bấm “Chọn” ở một hạng phòng.")); return; }
    body.append(el("p", "cart-stay", `${formatStayDates(s.checkIn, s.checkOut)} · ${nights} đêm`));
    l.forEach((i) => {
      const row = el("div", "cart-row"), img = el("img"); img.src = i.image; img.alt = "";
      const info = el("div", "cart-row__info");
      info.append(el("strong", "", short(i.title)), el("span", "", `${usd(unit(i))} USD / đêm`));
      const q = el("div", "cart-qty"), minus = el("button", "", "−"), plus = el("button", "", "+");
      minus.type = plus.type = "button";
      minus.onclick = () => setQty(i.roomId, i.qty - 1);
      plus.onclick = () => setQty(i.roomId, Math.min(9, i.qty + 1));
      q.append(minus, el("b", "", i.qty), plus);
      row.append(img, info, q); body.append(row);
    });
    const want = Number(s.rooms) || 1, have = count();
    if (have < want) body.append(el("p", "cart-hint", `Bạn đã chọn ${have}/${want} phòng — hãy chọn thêm ${want - have} phòng nữa.`));
    const off = offer(); if (off) body.append(el("p", "cart-offer", `Ưu đãi áp dụng: ${off.title} (−${off.pct}%)`));
    const t = el("div", "cart-total"); t.append(el("span", "", `Tổng ${have} phòng × ${nights} đêm`), el("strong", "", `${usd(total())} USD`));
    const go = el("button", "cart-go", "Thanh toán"); go.type = "button";
    go.onclick = () => { sync(); goTo("checkout.html", { message: "Đang chuyển đến trang thanh toán…", delay: 500 }); };
    foot.append(t, go);
  }

  function toast(item) {
    document.querySelectorAll(".cart-toast").forEach((t) => t.remove());
    const t = el("div", "cart-toast"); const n = count(), want = Number(getBookingSearch().rooms) || 1;
    t.innerHTML = '<i class="fa-solid fa-circle-check"></i><div><strong>Đã thêm vào giỏ</strong><span></span><small></small><div class="cart-toast__actions"></div></div>';
    t.querySelector("span").textContent = short(item.title);
    t.querySelector("small").textContent = `Giỏ có ${n} phòng` + (n < want ? ` · bạn cần ${want} phòng` : "");
    const more = el("button", "", "Chọn thêm phòng"), pay = el("button", "primary", "Thanh toán");
    more.type = pay.type = "button";
    more.onclick = () => t.remove();
    pay.onclick = () => { sync(); goTo("checkout.html", { message: "Đang chuyển đến trang thanh toán…", delay: 500 }); };
    t.querySelector(".cart-toast__actions").append(more, pay);
    document.body.appendChild(t); requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 6000);
  }

  // Banner ưu đãi đang áp dụng ở trang phòng
  function offerBanner(onChange) {
    const off = offer(), bar = document.querySelector(".booking-bar"); if (!off || !bar) return;
    const b = el("div", "offer-banner"); b.innerHTML = '<i class="fa-solid fa-tags"></i><span></span><button type="button">Bỏ ưu đãi</button>';
    b.querySelector("span").textContent = `Đang áp dụng: ${off.title} (−${off.pct}% giá phòng)`;
    b.querySelector("button").onclick = () => { localStorage.removeItem("activeOffer"); b.remove(); sync(); renderDrawer(); onChange(); };
    bar.after(b);
  }

  function initPage(onChange) {
    const fab = document.getElementById("cartFab");
    if (fab) fab.addEventListener("click", (e) => { e.preventDefault(); openDrawer(); });
    badge(); offerBanner(onChange);
    const v = readStoredObject("memberVoucher");
    if (v && !v.used && new Date(v.expiresAt) > new Date() && document.querySelector(".booking-bar")) {
      const b = el("div", "offer-banner"); b.innerHTML = '<i class="fa-solid fa-ticket"></i><span></span>';
      b.querySelector("span").textContent = `Bạn có phiếu hội viên ${v.code}: giảm ${v.pct}% cho lần đặt phòng đầu tiên (tự áp dụng khi thanh toán)`;
      document.querySelector(".booking-bar").after(b);
    }
  }

  return { get, add, count, unit, sync, clear, toast, openDrawer, initPage, badge, renderDrawer };
})();
