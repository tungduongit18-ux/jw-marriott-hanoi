let appliedVoucher = null;

// Email phải có tên miền cấp cao (vd. .com, .vn) — dùng chung quy tắc với form hội viên
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Gõ lại email thì xoá thông báo lỗi cũ
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  emailInput?.addEventListener("input", () => emailInput.setCustomValidity(""));
});

// Phiếu hội viên: 10% cho đặt phòng (memberVoucher), 20% cho đặt bàn (memberVoucherDining)
function voucherKeyFor(selection) {
  return selection && selection.type === "table" ? "memberVoucherDining" : "memberVoucher";
}

function getActiveVoucher(selection) {
  const v = readStoredObject(voucherKeyFor(selection));
  return v && !v.used && new Date(v.expiresAt) > new Date() ? v : null;
}

document.addEventListener("DOMContentLoaded", () => {
  const selectedRoom = readStoredObject("selectedRoom");
  const bookButton = document.querySelector(".btn-book-now");

  if (!selectedRoom) {
    // Mở thẳng checkout.html khi chưa chọn phòng/bàn -> không cho đặt với giá 0
    const emptyNotice = document.getElementById("emptyBooking");
    if (emptyNotice) emptyNotice.hidden = false;
    if (bookButton) {
      bookButton.disabled = true;
      bookButton.style.opacity = "0.5";
      bookButton.style.cursor = "not-allowed";
    }
    const summaryCard = document.querySelector(".room-summary-card");
    if (summaryCard) summaryCard.style.display = "none";
    const totalStayEmpty = document.getElementById("totalStayText");
    if (totalStayEmpty) totalStayEmpty.textContent = "—";
    const stayDatesEmpty = document.getElementById("stayDatesText");
    if (stayDatesEmpty) stayDatesEmpty.textContent = "—";
  }

  if (selectedRoom) {
    const title = document.getElementById("summaryRoomTitle");
    const amount = document.getElementById("summaryAmount");
    const subtotalCurrency = document.getElementById("summaryCurrencySubtotal");
    const totalStay = document.getElementById("totalStayText");
    const roomImage = document.getElementById("summaryRoomImg");
    const summaryStayDates = document.getElementById("summaryStayDates");
    const stayDatesText = document.getElementById("stayDatesText");
    const summaryGuests = document.getElementById("summaryGuests");

    const currency = "USD";
    const guestCount = Number(selectedRoom.guestCount || 1);
    // giá đã được tính sẵn ở trang trước (phòng: giá × số đêm, bàn: gói × khách + dịch vụ thêm)
    let price = Number(selectedRoom.price) ||
      (selectedRoom.type === "table" ? Number(selectedRoom.pricePerPerson || 0) * guestCount : 0);

    // Phiếu giảm giá hội viên cho lần đặt đầu tiên (tự áp dụng)
    const voucher = getActiveVoucher(selectedRoom);
    if (voucher && price > 0) {
      const before = price;
      price = Math.round(price * (1 - voucher.pct / 100));
      appliedVoucher = { code: voucher.code, pct: voucher.pct, key: voucherKeyFor(selectedRoom) };
      const line = document.createElement("p");
      line.className = "voucher-line";
      line.textContent = `Phiếu hội viên ${voucher.code}: −${voucher.pct}% (tiết kiệm ${(before - price).toLocaleString("en-US")} USD)`;
      document.getElementById("summaryAmount")?.closest(".summary-charge")?.after(line);
    }

    if (title && selectedRoom.title) title.textContent = selectedRoom.title;
    if (amount) amount.textContent = Number(price).toLocaleString("en-US");
    if (subtotalCurrency) subtotalCurrency.textContent = `${currency} (tạm tính)`;

    if (totalStay) {
      totalStay.textContent = "";
      totalStay.append(document.createTextNode(`${Number(price).toLocaleString("en-US")} `));
      const currencyLabel = document.createElement("small");
      currencyLabel.textContent = currency;
      totalStay.append(currencyLabel);
    }

    if (roomImage && selectedRoom.image) roomImage.src = selectedRoom.image;

    if (selectedRoom.stayDates) {
      if (summaryStayDates)
        summaryStayDates.textContent = selectedRoom.stayDates;
      if (stayDatesText) stayDatesText.textContent = selectedRoom.stayDates;
    }

    // Link "Chi tiết phòng" trỏ đúng trang chi tiết của phòng đã chọn
    const detailsLink = document.getElementById("summaryDetailsLink");
    if (detailsLink && selectedRoom.type !== "table") {
      // dữ liệu cũ chưa có roomId -> mặc định trang Deluxe King
      detailsLink.href = `room-detail.html?id=${selectedRoom.roomId || "deluxe-king"}`;
      detailsLink.hidden = false;
    }

    // Chính sách huỷ tính theo ngày nhận phòng và giá 1 đêm của phòng đã chọn
    const cancelText = document.getElementById("cancelPolicyText");
    if (cancelText) cancelText.textContent = buildCancelPolicy(selectedRoom);

    if (selectedRoom.offerTitle) {
      const rate = document.getElementById("summaryRate");
      if (rate) rate.textContent = `Ưu đãi: ${selectedRoom.offerTitle}`;
    }

    // Đặt bàn: hiện tên gói và các tuỳ chọn đã chọn
    if (selectedRoom.type === "table") {
      const rate = document.getElementById("summaryRate");
      if (rate && selectedRoom.packageName) {
        rate.textContent = `${selectedRoom.packageName} (${selectedRoom.pricePerPerson} USD/người)`;
      }
      const list = document.getElementById("summaryServices");
      if (list && Array.isArray(selectedRoom.serviceDetails) && selectedRoom.serviceDetails.length) {
        list.replaceChildren(...selectedRoom.serviceDetails.map((text) => {
          const li = document.createElement("li");
          li.textContent = text;
          return li;
        }));
        list.hidden = false;
      }
    }

    if (summaryGuests && selectedRoom.guests) {
      const rooms = Number(selectedRoom.rooms) || 1;
      summaryGuests.textContent = selectedRoom.type === "table"
        ? selectedRoom.guests
        : `${rooms} phòng, ${selectedRoom.guests}`;
    }
  }

  document
    .querySelectorAll(".floating-group input, .floating-group select")
    .forEach((input) => {
      const updateValueState = () => {
        input.classList.toggle("has-value", input.value.trim() !== "");
      };
      updateValueState();
      input.addEventListener("focus", () =>
        input.parentElement.classList.add("focused"),
      );
      input.addEventListener("blur", () => {
        input.parentElement.classList.remove("focused");
        updateValueState();
      });
    });

  const bookingForm = document.getElementById("bookingForm");
  bookingForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!readStoredObject("selectedRoom")) {
      goTo("rooms.html");
      return;
    }

    // Kiểm tra email kỹ hơn type="email" của HTML5 (HTML5 vẫn chấp nhận "ten@gmail")
    const emailInput = document.getElementById("email");
    if (emailInput && !EMAIL_PATTERN.test(emailInput.value.trim())) {
      emailInput.setCustomValidity("Email chưa hợp lệ. Vui lòng nhập đúng dạng ten@tenmien.com");
      emailInput.reportValidity();
      return;
    }

    const firstName = getInputValue("firstName");
    const lastName = getInputValue("lastName");
    const email = getInputValue("email");
    const phoneCode = getInputValue("phoneCode");
    const phoneNumber = getInputValue("phoneNumber");
    const room = readStoredObject("selectedRoom") || {};

    const roomTitle =
      document.getElementById("summaryRoomTitle")?.textContent.trim() ||
      room.title ||
      "Dịch vụ đã chọn";
    const price =
      document.getElementById("summaryAmount")?.textContent.trim() ||
      room.price ||
      "0";
    const currency = "USD";
    const stayDates =
      room.stayDates ||
      document.getElementById("stayDatesText")?.textContent.trim() ||
      "";

    const bookingCode = createBookingCode();

    const order = {
      bookingCode,
      guestName: `${firstName} ${lastName}`.trim(),
      email,
      phone: `${phoneCode} ${phoneNumber}`.trim(),
      roomTitle,
      totalPrice: `${price} ${currency}`,
      guestCount: room.guestCount || 1,
      guests: room.guests || "",
      pricePerPerson: room.pricePerPerson || null,
      packageName: room.packageName || "",
      serviceDetails: Array.isArray(room.serviceDetails) ? room.serviceDetails : [],
      roomId: room.roomId || "",
      stayDates,
      voucher: appliedVoucher && { code: appliedVoucher.code, pct: appliedVoucher.pct },
      roomImage: room.image || "",
      items: Array.isArray(room.items) ? room.items : [],
      rooms: room.rooms || 1,
      offerTitle: room.offerTitle || "",
      type: room.type === "table" ? "table" : "room",
      checkIn: room.checkIn || "",
      nights: room.nights || null,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };

    localStorage.setItem("lastOrder", JSON.stringify(order));

    // Lưu vào lịch sử đặt (đơn mới nhất đứng đầu)
    const history = getBookingHistory();
    history.unshift(order);
    saveBookingHistory(history);

    if (appliedVoucher) {
      const v = readStoredObject(appliedVoucher.key);
      if (v) { v.used = true; v.usedAt = new Date().toISOString(); localStorage.setItem(appliedVoucher.key, JSON.stringify(v)); }
    }
    localStorage.removeItem("selectedRoom");
    localStorage.removeItem("roomCart");
    localStorage.removeItem("activeOffer");

    // Khoá nút để tránh bấm 2 lần, hiện màn hình chờ rồi chuyển trang
    const submitBtn = document.querySelector(".btn-book-now");
    if (submitBtn) submitBtn.disabled = true;
    goTo("success.html", { message: "Đang xác nhận đặt phòng…", delay: 1100 });
  });
});

function readStoredObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (error) {
    console.error(`Could not read ${key} from local storage:`, error);
    return null;
  }
}

function getInputValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function createBookingCode() {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `JW-${Date.now().toString(36).slice(-4).toUpperCase()}-${randomPart}`;
}

function buildCancelPolicy(selection) {
  if (selection.type === "table") {
    return "Bạn có thể huỷ đặt bàn miễn phí trước giờ hẹn ít nhất 24 giờ. " +
      "Huỷ muộn hơn sẽ bị tính phí 50% tổng giá trị đặt bàn.";
  }
  const nightly = Number(selection.nightlyPrice || selection.price || 0);
  const fee = nightly.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (!selection.checkIn) {
    return `Quý khách được huỷ miễn phí trước ngày nhận phòng 1 ngày. ` +
      `Huỷ sau thời hạn này sẽ bị tính phí ${fee} USD (giá 1 đêm).`;
  }
  const deadline = new Date(`${selection.checkIn}T00:00:00`);
  deadline.setDate(deadline.getDate() - 1);
  const deadlineText = deadline.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `Quý khách được huỷ miễn phí trước 23:59 (giờ khách sạn) ngày ${deadlineText} ` +
    `(1 ngày trước ngày nhận phòng). Huỷ sau thời hạn này sẽ bị tính phí ${fee} USD (giá 1 đêm).`;
}


/* Tự điền thông tin hội viên (nếu khách đã đăng ký ở trang Ẩm thực) */
document.addEventListener("DOMContentLoaded", () => {
  const member = readStoredObject("memberProfile");
  if (!member || !member.code) return;

  const setIfEmpty = (id, value) => {
    const el = document.getElementById(id);
    if (el && value && !el.value) el.value = value;
  };

  setIfEmpty("memberNumber", member.code);
  setIfEmpty("email", member.email);
  if (member.name) {
    const parts = member.name.trim().split(/\s+/);
    const last = parts.pop(); // Tên = từ cuối, Họ = phần còn lại
    setIfEmpty("firstName", parts.join(" "));
    setIfEmpty("lastName", last);
  }
  const phone = (member.phone || "").replace(/^\+84/, "").replace(/^0/, "");
  setIfEmpty("phoneNumber", phone);
});
