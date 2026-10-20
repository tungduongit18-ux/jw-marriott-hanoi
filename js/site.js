document.addEventListener("DOMContentLoaded", function () {
  // Menu điện thoại
  var t = document.querySelector(".menu-toggle"), m = document.querySelector(".main-menu");
  if (t && m) t.addEventListener("click", function () { m.classList.toggle("open"); });

  // Footer dạng accordion
  document.querySelectorAll(".acc-head").forEach(function (h) {
    h.addEventListener("click", function () { h.parentElement.classList.toggle("open"); });
  });

  // Chuyển trang mượt khi bấm link nội bộ (menu, nút, footer...)
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^(tel:|mailto:|https?:|javascript:)/i.test(href)) return;
    if (!/\.html(\?[^#]*)?(#.*)?$/i.test(href)) return;
    // link tới đúng trang hiện tại kèm #anchor -> để trình duyệt tự cuộn
    var current = location.pathname.split("/").pop() || "index.html";
    if (href.indexOf("#") > 0 && href.split("#")[0] === current) return;
    e.preventDefault();
    goTo(href);
  });
});

// Quay lại bằng nút Back (trang lấy từ bộ nhớ đệm) -> bỏ trạng thái mờ
window.addEventListener("pageshow", function (e) {
  if (e.persisted) {
    document.body.classList.remove("page-leaving");
    var overlay = document.getElementById("pageLoader");
    if (overlay) overlay.classList.remove("show");
  }
});

/**
 * Chuyển trang có hiệu ứng.
 * goTo("checkout.html")                              -> mờ dần rồi chuyển
 * goTo("checkout.html", { message: "...", delay: 600 }) -> hiện màn hình chờ có vòng xoay
 */
function goTo(url, options) {
  options = options || {};
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) { window.location.href = url; return; }

  if (options.message) {
    var overlay = document.getElementById("pageLoader");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "pageLoader";
      overlay.className = "page-loader";
      overlay.innerHTML = '<div class="page-loader__box"><span class="page-loader__spinner"></span><p></p></div>';
      document.body.appendChild(overlay);
    }
    overlay.querySelector("p").textContent = options.message;
    requestAnimationFrame(function () { overlay.classList.add("show"); });
    setTimeout(function () { window.location.href = url; }, options.delay || 700);
  } else {
    document.body.classList.add("page-leaving");
    setTimeout(function () { window.location.href = url; }, 280);
  }
}

/* ===== Lịch sử đặt (dùng chung cho checkout.js và history.html) ===== */
function getBookingHistory() {
  try {
    var list = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveBookingHistory(list) {
  try {
    localStorage.setItem("bookingHistory", JSON.stringify(list));
  } catch (e) {
    console.error("Không lưu được lịch sử đặt:", e);
  }
}
