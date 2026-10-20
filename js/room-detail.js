// Trang chi tiết phòng: đọc ?id= trên địa chỉ, lấy dữ liệu trong js/rooms-data.js và hiển thị
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const roomId = ROOMS[params.get("id")] ? params.get("id") : "deluxe-king";
  const room = ROOMS[roomId];

  renderRoom(room);
  renderOtherRooms(roomId);
  setupBookingWidget(room, roomId);
});

function renderRoom(room) {
  document.title = `${room.name} - JW Marriott Hotel Hanoi`;
  setText("roomName", room.name);
  setText("crumbName", room.name);
  setText("roomTag", room.tag);
  setText("roomTag2", room.tag);
  setText("roomDesc", room.description);
  setText("widgetPrice", `${room.price.toLocaleString("en-US")} USD`);

  // Ảnh nền banner = ảnh chính của phòng
  const hero = document.getElementById("roomHero");
  if (hero) hero.style.backgroundImage = `url("${encodeURI(room.images[0])}")`;

  // Bộ sưu tập 3 ảnh
  document.querySelectorAll("#roomGallery img").forEach((img, i) => {
    img.src = room.images[i] || room.images[0];
    img.alt = `${room.name} - ảnh ${i + 1}`;
  });

  // Thông số
  setText("spec-area", room.specs.area);
  setText("spec-capacity", room.specs.capacity);
  setText("spec-bed", room.specs.bed);
  setText("spec-view", room.specs.view);

  fillList("roomExtras", room.extras, "div", "amenity-item highlight");
  fillList("roomAmenities", BASE_AMENITIES, "div", "amenity-item");
  fillList("roomPolicies", ROOM_POLICIES, "li");

  if (room.lounge) {
    document.getElementById("loungeBlock").hidden = false;
    fillList("loungePerks", LOUNGE_PERKS, "li");
  }
}

// 3 phòng gợi ý khác (ưu tiên cùng hạng)
function renderOtherRooms(currentId) {
  const box = document.getElementById("otherRooms");
  if (!box) return;
  const currentType = ROOMS[currentId].tag.split(" ")[0];
  const ids = Object.keys(ROOMS).filter((id) => id !== currentId);
  ids.sort((a, b) => {
    const sameA = ROOMS[a].tag.startsWith(currentType) ? 0 : 1;
    const sameB = ROOMS[b].tag.startsWith(currentType) ? 0 : 1;
    return sameA - sameB;
  });

  ids.slice(0, 3).forEach((id) => {
    const r = ROOMS[id];
    const card = document.createElement("a");
    card.className = "other-room-card";
    card.href = `room-detail.html?id=${id}`;

    const img = document.createElement("img");
    img.src = r.images[0];
    img.alt = r.name;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "other-room-card__body";
    const name = document.createElement("strong");
    name.textContent = r.name;
    const meta = document.createElement("span");
    meta.textContent = `${r.specs.area} · ${r.specs.bed} · ${r.specs.view}`;
    const price = document.createElement("em");
    price.textContent = `Từ ${r.price.toLocaleString("en-US")} USD / đêm`;
    body.append(name, meta, price);

    card.append(img, body);
    box.append(card);
  });
}

function setupBookingWidget(room, roomId) {
  const form = document.getElementById("detailBookingForm");
  const ci = document.getElementById("checkin");
  const co = document.getElementById("checkout");
  const guests = document.getElementById("guests");
  if (!form) return;

  // Số khách tối đa theo sức chứa của phòng
  for (let g = 1; g <= room.maxGuests; g++) {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = `${g} người lớn`;
    guests.append(opt);
  }
  guests.value = Math.min(2, room.maxGuests);

  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (value, n) => {
    const d = new Date(`${value}T00:00:00`);
    d.setDate(d.getDate() + n);
    return iso(d);
  };
  const nightsBetween = () =>
    Math.round((Date.parse(`${co.value}T00:00:00Z`) - Date.parse(`${ci.value}T00:00:00Z`)) / 86400000);

  const today = iso(new Date());
  ci.min = today;
  ci.value = today;
  co.min = addDays(today, 1);
  co.value = addDays(today, 1);

  // Tạm tính tổng tiền theo số đêm
  const updateTotal = () => {
    const nights = nightsBetween();
    const ok = nights > 0;
    setText("widgetNights", ok ? `${room.price.toLocaleString("en-US")} USD × ${nights} đêm` : "Chọn ngày hợp lệ");
    setText("widgetTotal", ok ? `${(room.price * nights).toLocaleString("en-US")} USD` : "—");
  };
  updateTotal();

  ci.addEventListener("change", () => {
    const next = addDays(ci.value, 1);
    co.min = next;
    if (co.value <= ci.value) co.value = next;
    updateTotal();
  });
  co.addEventListener("change", () => {
    co.setCustomValidity("");
    updateTotal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nights = nightsBetween();
    if (!(nights > 0)) {
      co.setCustomValidity("Ngày trả phòng phải sau ngày nhận phòng.");
      co.reportValidity();
      return;
    }
    co.setCustomValidity("");
    const g = Number(guests.value);
    const fmt = (v) =>
      new Date(`${v}T00:00:00`).toLocaleDateString("vi-VN", {
        weekday: "short", day: "2-digit", month: "2-digit", year: "numeric",
      });

    localStorage.setItem("selectedRoom", JSON.stringify({
      roomId,
      title: room.title,
      price: room.price * nights,
      nightlyPrice: room.price,
      nights,
      checkIn: ci.value,
      checkOut: co.value,
      stayDates: `${fmt(ci.value)} - ${fmt(co.value)}`,
      guests: `${g} khách`,
      guestCount: g,
      rooms: 1,
      currency: "USD",
      image: room.images[0],
    }));
    goTo("checkout.html", { message: "Đang chuyển đến trang thanh toán…", delay: 600 });
  });
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function fillList(id, items, tag, className) {
  const box = document.getElementById(id);
  if (!box) return;
  box.replaceChildren(
    ...items.map((text) => {
      const el = document.createElement(tag);
      if (className) el.className = className;
      el.textContent = text;
      return el;
    }),
  );
}
