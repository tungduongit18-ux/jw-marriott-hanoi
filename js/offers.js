// Ưu đãi & gói — render ở trang chủ. Ưu đãi hết hạn tự ẩn theo ngày hôm nay.
const OFFERS = [
  { id: "weekend", cat: "Phòng", from: "2026-06-15", to: "2026-12-31", pct: 10, img: "images/stock-woman-sunset-1069700-hor-wide.png",
    title: "Thêm đặc quyền cuối tuần", desc: "Giảm 10% giá phòng khi lưu trú cuối tuần, kèm nhận phòng sớm và trả phòng muộn (tuỳ tình trạng phòng).",
    perks: ["Giảm 10% giá phòng", "Nhận phòng sớm / trả phòng muộn", "Ưu tiên phòng tầng cao"], terms: "Áp dụng khi nhận phòng từ thứ Sáu đến Chủ nhật. Không cộng gộp với ưu đãi khác." },
  { id: "credit", cat: "Phòng", from: "2026-09-20", to: "2026-12-31", pct: 15, img: "images/hanjw-lake-view-4347_Wide-Hor.png",
    title: "Kỳ nghỉ kèm đặc quyền tín dụng", desc: "Giảm 15% giá phòng và nhận tín dụng 50 USD dùng tại nhà hàng hoặc spa của khách sạn.",
    perks: ["Giảm 15% giá phòng", "50 USD tín dụng ẩm thực / spa", "Bữa sáng cho 2 khách"], terms: "Tín dụng dùng trong thời gian lưu trú, không quy đổi tiền mặt." },
  { id: "spa", cat: "Spa", from: "2026-04-10", to: "2026-12-31", pct: 8, img: "images/spa.jpg",
    title: "Trải nghiệm Spa thư giãn", desc: "Giảm 8% giá phòng và tặng 1 liệu trình massage 60 phút cho mỗi khách.",
    perks: ["Giảm 8% giá phòng", "Massage 60 phút / khách", "Sử dụng bể bơi & jacuzzi"], terms: "Vui lòng đặt lịch spa trước ít nhất 24 giờ." },
  { id: "dining", cat: "Ẩm thực", from: "2026-08-01", to: "2026-12-31", pct: 0, img: "images/jw-hanjw-tuna-and-salmon-sashimi-37989_Wide-Hor.png", link: "cuisine.html",
    title: "Tối Omakase cùng Kumihimo", desc: "Thực đơn Omakase 9 món do bếp trưởng tuyển chọn, tặng kèm một ly sake chào đón.",
    perks: ["Omakase 9 món", "1 ly sake chào đón"], terms: "Đặt bàn trực tiếp tại trang Ẩm thực." },
  { id: "xmas", cat: "Phòng", from: "2026-12-01", to: "2027-01-05", pct: 12, img: "images/hanjw-garden-view-4346_Wide-Hor.png",
    title: "Giáng sinh bên khu vườn ven hồ", desc: "Giảm 12% giá phòng mùa lễ hội, kèm trà chiều Giáng sinh cho 2 khách.",
    perks: ["Giảm 12% giá phòng", "Trà chiều Giáng sinh cho 2 khách"], terms: "Áp dụng khi nhận phòng từ 01/12/2026 đến 05/01/2027." },
];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("offersGrid"), tabs = document.getElementById("offersTabs");
  if (!grid) return;
  const today = new Date().toISOString().slice(0, 10);
  const isAll = grid.dataset.page === "all", limit = Number(grid.dataset.limit) || 0, sortEl = document.getElementById("offersSort");
  const live = OFFERS.filter((o) => o.to >= today && (isAll || o.from <= today));
  const daysLeft = (o) => Math.ceil((new Date(o.to + "T00:00:00") - new Date(today + "T00:00:00")) / 864e5);
  const fmt = (d) => { const [y, m, dd] = d.split("-").map(Number); return `${dd} tháng ${m} năm ${y}`; };
  const mk = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };

  let cat = "Tất cả";
  function render() {
    let list = live.filter((o) => cat === "Tất cả" || o.cat === cat);
    const sv = sortEl ? sortEl.value : "";
    if (sv === "pct") list = [...list].sort((x, y) => y.pct - x.pct);
    if (sv === "soon") list = [...list].sort((x, y) => x.to.localeCompare(y.to));
    if (limit) list = list.slice(0, limit);
    grid.replaceChildren(...list.map((o) => {
      const up = o.from > today, left = daysLeft(o);
      const card = mk("button", "offer-card" + (up ? " upcoming" : "")); card.type = "button";
      const img = mk("img"); img.src = o.img; img.alt = o.title; img.loading = "lazy";
      const txt = mk("div", "offer-card__text");
      txt.append(mk("span", "offer-tag", o.cat), mk("small", "", up ? `Bắt đầu từ ${fmt(o.from)}` : `${fmt(o.from)} – ${fmt(o.to)}`), mk("h3", "", o.title));
      card.append(img, txt);
      if (!up && left <= 30) card.append(mk("span", "offer-flag", `Còn ${left} ngày`));
      if (up) card.append(mk("span", "offer-flag soon", "Sắp diễn ra"));
      card.onclick = () => openModal(o); return card;
    }));
    if (!grid.children.length) grid.append(mk("p", "offers-empty", "Hiện chưa có ưu đãi trong mục này."));
  }
  if (limit) tabs.hidden = true;
  else {
    const cats = ["Tất cả", ...new Set(live.map((o) => o.cat))];
    tabs.replaceChildren(...cats.map((c, i) => {
      const b = mk("button", "offer-tab" + (i ? "" : " active"), c); b.type = "button";
      b.onclick = () => { tabs.querySelectorAll(".offer-tab").forEach((x) => x.classList.remove("active")); b.classList.add("active"); cat = c; render(); };
      return b;
    }));
  }
  sortEl?.addEventListener("change", render);
  render();
  const want = OFFERS.find((o) => o.id === new URLSearchParams(location.search).get("id"));
  if (isAll && want) openModal(want);

  function openModal(o) {
    const m = mk("div", "offer-modal"), box = mk("div", "offer-modal__box"), img = mk("img"); img.src = o.img; img.alt = "";
    const close = mk("button", "offer-modal__x", "×"); close.type = "button";
    const body = mk("div", "offer-modal__body"), ul = mk("ul"); o.perks.forEach((p) => ul.append(mk("li", "", p)));
    const up = o.from > today;
    const go = mk("button", "offer-go", up ? `Bắt đầu từ ${fmt(o.from)}` : o.link ? "Đặt bàn ngay" : "Áp dụng & đặt phòng"); go.type = "button"; go.disabled = up;
    body.append(mk("span", "offer-tag", o.cat), mk("h3", "", o.title), mk("small", "", `Hiệu lực: ${fmt(o.from)} – ${fmt(o.to)}`), mk("p", "", o.desc), ul, mk("p", "offer-terms", "Điều kiện: " + o.terms), go);
    box.append(close, img, body); m.append(box); document.body.append(m);
    requestAnimationFrame(() => m.classList.add("show"));
    const shut = () => { m.classList.remove("show"); setTimeout(() => m.remove(), 200); };
    close.onclick = shut; m.onclick = (e) => { if (e.target === m) shut(); };
    go.onclick = () => {
      if (o.link) return goTo(o.link);
      localStorage.setItem("activeOffer", JSON.stringify({ id: o.id, title: o.title, pct: o.pct }));
      goTo("rooms.html", { message: "Đang áp dụng ưu đãi…", delay: 500 });
    };
  }
});
