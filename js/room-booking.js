document.addEventListener("DOMContentLoaded", () => {
  const EXCHANGE_RATES = { USD: { symbol: "USD", rate: 1 } };

  let currentCurrency = "USD";

  const roomGalleries = [
    [
      "images/deluxe king,guest room,1 king.png",
      "images/jw-hanjw-deluxe-city-room-23397_Wide-Hor.png",
      "images/jw-hanjw-guest-room-28286_Wide-Hor.png",
      "images/hanjw-executive-bedroom-3958-hor-wide.png",
    ],
    [
      "images/deluxe double,guest room,2double.png",
      "images/jw-hanjw-guestroom-2-double-beds-35658_Wide-Hor.png",
      "images/hanjw-garden-view-4346_Wide-Hor.png",
    ],
    [
      "images/hanjw-guestroom-lake-0008-hor-wide.png",
      "images/jw-hanjw-guestroom-2-double-beds-35658_Wide-Hor.png",
      "images/hanjw-lake-view-4347_Wide-Hor.png",
    ],
    [
      "images/hanjw-executive-king-8353-hor-wide.png",
      "images/jw-hanjw-deluxe-city-room-23397_Wide-Hor.png",
      "images/hanjw-garden-view-4346_Wide-Hor.png",
      "images/jw-hanjw-executive-lounge-29566_Wide-Hor.png",
    ],
    [
      "images/hanjw-executive-bedroom-3958-hor-wide.png",
      "images/deluxe double,guest room,2double.png",
      "images/jw-hanjw-executive-lounge-29566_Wide-Hor.png",
      "images/jw-hanjw-efl-pastry-41296-02396_Wide-Hor.png",
      "images/hanjw-lounge-0010-hor-wide.png",
    ],
    [
      "images/jw-hanjw-family-room-18103_Wide-Hor.png",
      "images/jw-hanjw-deluxe-suite-city-21215_Wide-Hor.png",
      "images/jw-hanjw-executive-lounge-29566_Wide-Hor.png",
      "images/hanjw-lounge-0010-hor-wide.png",
    ],
    [
      "images/jw-hanjw-chairman-suite-18174_Wide-Hor.png",
      "images/jw-hanjw-family-room-17522_Wide-Hor.png",
      "images/jw-hanjw-family-room-22735_Wide-Hor.png",
      "images/hanjw-executive-bathroom-6228-hor-wide.png",
      "images/jw-hanjw-executive-lounge-29566_Wide-Hor.png",
      "images/hanjw-lounge-0010-hor-wide.png",
      "images/jw-hanjw-efl-pastry-41296-02396_Wide-Hor.png",
    ],
    [
      "images/jw-hanjw-chairman-suite-35439_Wide-Hor.png",
      "images/jw-hanjw-presidential-suite-26760-14644_Wide-Hor.png",
      "images/hanjw-garden-view-4346_Wide-Hor.png",
      "images/jw-hanjw-executive-lounge-29566_Wide-Hor.png",
      "images/hanjw-lounge-0010-hor-wide.png",
      "images/jw-hanjw-efl-pastry-41296-02396_Wide-Hor.png",
    ],
    [
      "images/jw-hanjw-presidential-suite-26760-14644_Wide-Hor.png",
      "images/jw-hanjw-presidential-suite-26760-14644_Wide-Hor (1).png",
      "images/jw-hanjw-chairman-suite-14206_Wide-Hor.png",
      "images/hanjw-lake-view-4347_Wide-Hor.png",
      "images/jw-hanjw-executive-lounge-29566_Wide-Hor.png",
      "images/hanjw-lounge-0010-hor-wide.png",
      "images/jw-hanjw-efl-pastry-41296-02396_Wide-Hor.png",
    ],
  ];

  const modalsHTML = `
    
    <div id="bookingModal" class="modal-overlay" style="display:none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Chỉnh Sửa Thông Tin Đặt Phòng</h3>
          <span class="close-modal" id="closeBookingModal">&times;</span>
        </div>
        <form id="editBookingForm" class="modal-body">
          <div class="form-group">
            <label>Ngày nhận phòng:</label>
            <input type="date" id="checkInInput" required />
          </div>
          <div class="form-group">
            <label>Ngày trả phòng:</label>
            <input type="date" id="checkOutInput" required />
          </div>
          <div class="form-group">
            <label>Số phòng:</label>
            <select id="roomsInput">
              <option value="1">1 phòng</option>
              <option value="2">2 phòng</option>
              <option value="3">3 phòng</option>
            </select>
          </div>
          <div class="form-group">
            <label>Số khách:</label>
            <select id="guestsInput">
              <option value="1 khách">1 khách</option>
              <option value="2 khách">2 khách</option>
              <option value="3 khách">3 khách</option>
            </select>
          </div>
          <div class="form-group">
            <label>Giá ưu đãi:</label>
            <select id="ratesInput">
              <option value="Giá tiêu chuẩn thấp nhất">Giá tiêu chuẩn thấp nhất</option>
              <option value="Ưu đãi người cao tuổi">Ưu đãi người cao tuổi</option>
              <option value="Doanh nghiệp / Mã khuyến mãi">Doanh nghiệp / Mã khuyến mãi</option>
            </select>
          </div>
          <button type="submit" class="btn-save">Áp dụng</button>
        </form>
      </div>
    </div>

    
    <div id="filterModal" class="modal-overlay" style="display:none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Lọc Phòng</h3>
          <span class="close-modal" id="closeFilterModal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Hạng phòng:</label>
            <select id="filterCategory">
              <option value="all">Tất cả hạng phòng</option>
              <option value="deluxe">Phòng Deluxe</option>
              <option value="executive">Có sử dụng Executive Lounge</option>
              <option value="suite">Phòng Suite (Junior, Chairman, Presidential)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Hướng nhìn:</label>
            <select id="filterView">
              <option value="all">Tất cả góc nhìn</option>
              <option value="lake">Hướng hồ</option>
              <option value="city">Hướng thành phố</option>
            </select>
          </div>
          <div class="form-group">
            <label>Loại giường:</label>
            <select id="filterBed">
              <option value="all">Tất cả loại giường</option>
              <option value="king">1 giường King</option>
              <option value="double">2 giường đôi</option>
            </select>
          </div>
          <div class="filter-actions" style="display: flex; gap: 12px; margin-top: 20px; align-items: stretch;">
            <button type="button" id="applyFilterBtn" class="btn-save" style="flex: 2; margin-top: 0; padding: 12px 16px; height: 44px; display: flex; align-items: center; justify-content: center;">Áp dụng</button>
            <button type="button" id="clearFilterBtn" class="btn-clear" style="flex: 1; background: #e0e0e0; color: #333; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 14px;">Xoá bộ lọc</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalsHTML);
  createCartButton();

  const roomCards = document.querySelectorAll(".room-card");
  const showTaxCheckbox = document.getElementById("showTax");

  const baseUsdPrices = Array.from(
    document.querySelectorAll(".price-detail"),
  ).map((el) => parseFloat(el.textContent.replace(/,/g, "")));

  function updateAllPrices() {
    const isTaxChecked = showTaxCheckbox ? showTaxCheckbox.checked : false;
    const rateObj = EXCHANGE_RATES[currentCurrency];

    document.querySelectorAll(".price-detail").forEach((el, index) => {
      let usdPrice = baseUsdPrices[index];

      const off = readStoredObject("activeOffer");
      if (off && off.pct) usdPrice *= 1 - off.pct / 100;
      if (isTaxChecked) {
        usdPrice *= 1.15;
      }

      const convertedPrice = usdPrice * rateObj.rate;

      if (currentCurrency === "VND") {
        el.textContent = Math.round(convertedPrice).toLocaleString("vi-VN");
      } else {
        el.textContent = Math.round(convertedPrice).toLocaleString("en-US");
      }
    });

    document.querySelectorAll(".currency").forEach((el) => {
      el.textContent = rateObj.symbol;
    });
  }

  showTaxCheckbox?.addEventListener("change", updateAllPrices);

  const currencySelector = document.querySelector(".currency-selector");
  if (currencySelector) {
    currencySelector.style.position = "relative";
    currencySelector.style.cursor = "pointer";

    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "currency-dropdown";
    dropdownMenu.style.cssText = `
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background: #fff;
      border: 1px solid #ccc;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      border-radius: 4px;
      margin-top: 6px;
      z-index: 100;
      min-width: 100px;
    `;

    dropdownMenu.innerHTML = `
      <div class="currency-opt" data-curr="USD" style="padding: 8px 16px; cursor: default;">USD</div>
    `;

    currencySelector.appendChild(dropdownMenu);

    currencySelector.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
      dropdownMenu.style.display = "none";
    });

    dropdownMenu.querySelectorAll(".currency-opt").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        currentCurrency = opt.getAttribute("data-curr");
        currencySelector.querySelector("span").innerHTML =
          `<i class="fa-solid fa-money-bill"></i> ${currentCurrency}`;
        dropdownMenu.style.display = "none";
        updateAllPrices();
      });
    });
  }

  const filterModal = document.getElementById("filterModal");
  const btnFilter = document.querySelector(".btn-filter");
  const closeFilterModal = document.getElementById("closeFilterModal");
  const applyFilterBtn = document.getElementById("applyFilterBtn");
  const clearFilterBtn = document.getElementById("clearFilterBtn");

  btnFilter?.addEventListener("click", () => {
    filterModal.style.display = "flex";
  });

  closeFilterModal?.addEventListener("click", () => {
    filterModal.style.display = "none";
  });

  applyFilterBtn?.addEventListener("click", () => {
    const category = document.getElementById("filterCategory").value;
    const view = document.getElementById("filterView").value;
    const bed = document.getElementById("filterBed").value;

    let visibleCount = 0;
    roomCards.forEach((card) => {
      // data-category có thể chứa nhiều giá trị, ví dụ "executive suite"
      const categories = (card.dataset.category || "").split(" ");
      const matchCategory = category === "all" || categories.includes(category);
      const matchView = view === "all" || card.dataset.view === view;
      const matchBed = bed === "all" || card.dataset.bed === bed;
      const show = matchCategory && matchView && matchBed;
      card.style.display = show ? "flex" : "none";
      if (show) visibleCount++;
    });
    showNoResult(visibleCount === 0);

    filterModal.style.display = "none";
  });

  clearFilterBtn?.addEventListener("click", () => {
    document.getElementById("filterCategory").value = "all";
    document.getElementById("filterView").value = "all";
    document.getElementById("filterBed").value = "all";

    roomCards.forEach((card) => {
      card.style.display = "flex";
    });
    showNoResult(false);

    filterModal.style.display = "none";
  });

  roomCards.forEach((card, cardIndex) => {
    const imgEl = card.querySelector(".room-gallery img");
    const prevBtn = card.querySelector(".nav-btn.prev");
    const nextBtn = card.querySelector(".nav-btn.next");

    const images = roomGalleries[cardIndex] || [imgEl.getAttribute("src")];
    let currentIndex = 0;

    nextBtn?.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      imgEl.src = images[currentIndex];
    });

    prevBtn?.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      imgEl.src = images[currentIndex];
    });
  });

  document.querySelectorAll(".view-more").forEach((btn) => {
    const label = btn.innerHTML;
    btn.addEventListener("click", function (e) {
      const card = e.currentTarget.closest(".room-card");
      if (!card) return;
      const idx = Array.from(roomCards).indexOf(card);
      const img = card.querySelector(".room-gallery img");
      const item = {
        roomId: card.dataset.roomId || "",
        title: card.querySelector(".room-title")?.textContent.trim() || "",
        basePrice: baseUsdPrices[idx] || 0,
        image: img ? img.getAttribute("src") : "",
      };
      Cart.add(item);
      this.innerHTML = `<i class="fa-solid fa-check"></i> Đã thêm`;
      this.style.backgroundColor = "#2e7d32"; this.style.color = "#fff"; this.style.borderColor = "#2e7d32";
      setTimeout(() => { this.innerHTML = label; this.style.cssText = ""; }, 1400);
      flyToCart(img, () => Cart.toast(item));
    });
  });

  const bookingModal = document.getElementById("bookingModal");
  const btnEdit = document.querySelector(".btn-edit");
  const closeBookingModal = document.getElementById("closeBookingModal");
  const editBookingForm = document.getElementById("editBookingForm");

  btnEdit?.addEventListener("click", () => {
    bookingModal.style.display = "flex";
  });

  closeBookingModal?.addEventListener("click", () => {
    bookingModal.style.display = "none";
  });

  editBookingForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkInValue = document.getElementById("checkInInput").value;
    const checkOutValue = document.getElementById("checkOutInput").value;
    const nights = getNightCount(checkInValue, checkOutValue);
    if (!nights) {
      document.getElementById("checkOutInput").setCustomValidity(
        "Ngày trả phòng phải sau ngày nhận phòng.",
      );
      document.getElementById("checkOutInput").reportValidity();
      return;
    }
    document.getElementById("checkOutInput").setCustomValidity("");
    const rooms = document.getElementById("roomsInput").value;
    const guests = document.getElementById("guestsInput").value;
    const rate = document.getElementById("ratesInput").value;

    if (checkInValue < toIsoDate(new Date())) {
      document.getElementById("checkInInput").setCustomValidity(
        "Ngày nhận phòng không được ở quá khứ.",
      );
      document.getElementById("checkInInput").reportValidity();
      return;
    }
    document.getElementById("checkInInput").setCustomValidity("");

    const search = {
      checkIn: checkInValue,
      checkOut: checkOutValue,
      rooms,
      guests,
      rate,
      nights,
    };
    localStorage.setItem("bookingSearch", JSON.stringify(search));
    renderBookingBar(search);
    Cart.sync();
    Cart.renderDrawer();

    bookingModal.style.display = "none";
  });

  // Lần đầu vào trang: hiển thị ngày theo hôm nay thay vì ngày cố định
  const initialSearch = getBookingSearch();
  renderBookingBar(initialSearch);
  const checkInInput = document.getElementById("checkInInput");
  const checkOutInput = document.getElementById("checkOutInput");
  const todayIso = toIsoDate(new Date());
  checkInInput.min = todayIso;
  checkInInput.value = initialSearch.checkIn;
  checkOutInput.min = addDays(initialSearch.checkIn, 1);
  checkOutInput.value = initialSearch.checkOut;
  document.getElementById("roomsInput").value = String(initialSearch.rooms);
  document.getElementById("guestsInput").value = initialSearch.guests;
  if (initialSearch.rate) document.getElementById("ratesInput").value = initialSearch.rate;
  checkInInput.addEventListener("change", () => {
    checkInInput.setCustomValidity("");
    const nextDay = addDays(checkInInput.value, 1);
    checkOutInput.min = nextDay;
    if (checkOutInput.value <= checkInInput.value) checkOutInput.value = nextDay;
  });
  checkOutInput.addEventListener("change", () => checkOutInput.setCustomValidity(""));

  updateAllPrices();
  Cart.initPage(updateAllPrices);
});

function renderBookingBar(search) {
  const barItems = document.querySelectorAll(".booking-bar .bar-item");
  if (barItems.length < 3) return;
  const nights = getNightCount(search.checkIn, search.checkOut);
  const rooms = Number(search.rooms) || 1;
  barItems[0].querySelector(".label").textContent =
    `NGÀY LƯU TRÚ (${nights} ĐÊM)`;
  barItems[0].querySelector(".value").textContent =
    formatStayDates(search.checkIn, search.checkOut);
  barItems[1].querySelector(".value").textContent =
    `${rooms} phòng, ${search.guests}`;
  barItems[2].querySelector(".value").textContent =
    search.rate || "Giá tiêu chuẩn thấp nhất";
}

function showNoResult(isEmpty) {
  let note = document.getElementById("noRoomResult");
  if (!note) {
    note = document.createElement("p");
    note.id = "noRoomResult";
    note.className = "accessible-note";
    note.textContent = "Không có phòng phù hợp với bộ lọc. Hãy thử bỏ bớt điều kiện.";
    document.querySelector(".content-container")?.appendChild(note);
  }
  note.style.display = isEmpty ? "block" : "none";
}

// Lấy ngày đã lưu; nếu chưa có hoặc đã qua thì mặc định hôm nay -> ngày mai
function getBookingSearch() {
  const today = toIsoDate(new Date());
  const saved = readStoredObject("bookingSearch");
  if (saved && saved.checkIn >= today && getNightCount(saved.checkIn, saved.checkOut)) {
    // dữ liệu lưu từ bản tiếng Anh cũ -> chuyển sang tiếng Việt
    saved.guests = String(saved.guests || "1 khách").replace(/Guests?/, "khách");
    if (!/[à-ỹ]/.test(saved.rate || "")) saved.rate = "Giá tiêu chuẩn thấp nhất";
    return saved;
  }
  return {
    checkIn: today,
    checkOut: addDays(today, 1),
    rooms: (saved && saved.rooms) || "1",
    guests: (saved && saved.guests && !/Guest/.test(saved.guests) ? saved.guests : "1 khách"),
    rate: "Giá tiêu chuẩn thấp nhất",
  };
}

function toIsoDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function readStoredObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (error) {
    return null;
  }
}

function getNightCount(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  const nights = (end - start) / 86400000;
  return Number.isInteger(nights) && nights > 0 ? nights : 0;
}

function formatStayDates(checkIn, checkOut) {
  const options = { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" };
  const format = (value) => new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN", options);
  return `${format(checkIn)} - ${format(checkOut)}`;
}

/* ================= GIỎ HÀNG + HIỆU ỨNG BAY VÀO GIỎ ================= */
function createCartButton() {
  const cart = document.createElement("a");
  cart.href = "checkout.html";
  cart.className = "cart-fab";
  cart.id = "cartFab";
  cart.setAttribute("aria-label", "Giỏ hàng");
  cart.innerHTML =
    '<i class="fa-solid fa-cart-shopping"></i><span class="cart-badge" id="cartBadge">0</span>';
  document.body.appendChild(cart);
  // đã có phòng trong giỏ từ trước thì hiện số 1
  if (Cart.count()) cart.classList.add("has-item");
  document.getElementById("cartBadge").textContent = Cart.count();
}

function flyToCart(imgEl, onDone) {
  const cart = document.getElementById("cartFab");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!cart || !imgEl || reduceMotion || !imgEl.animate) {
    cart?.classList.add("has-item");
    onDone();
    return;
  }

  const from = imgEl.getBoundingClientRect();
  const to = cart.getBoundingClientRect();

  // Bản sao của ảnh phòng, đặt đúng vị trí ảnh gốc
  const flyer = imgEl.cloneNode();
  flyer.className = "cart-flyer";
  Object.assign(flyer.style, {
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
  });
  document.body.appendChild(flyer);

  // Tính quãng đường từ tâm ảnh đến tâm giỏ hàng
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const endScale = Math.min(48 / from.width, 48 / from.height);

  const flight = flyer.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1, borderRadius: "12px" },
      // nhấc ảnh lên một chút trước khi "ném" -> quỹ đạo cong
      { transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 120}px) scale(0.45)`, opacity: 1, borderRadius: "24px", offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(${endScale})`, opacity: 0.4, borderRadius: "50%" },
    ],
    { duration: 850, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" },
  );

  flight.onfinish = () => {
    flyer.remove();
    cart.classList.add("has-item");
    cart.animate(
      [
        { transform: "scale(1) rotate(0)" },
        { transform: "scale(1.25) rotate(-12deg)" },
        { transform: "scale(0.95) rotate(8deg)" },
        { transform: "scale(1) rotate(0)" },
      ],
      { duration: 450, easing: "ease-out" },
    );
    onDone();
  };
}

function showCartToast(roomTitle) {
  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i>
    <div><strong>Đã thêm vào giỏ hàng</strong><span></span>
    </div>`;
  toast.querySelector("span").textContent = roomTitle;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
}
