// Dữ liệu chi tiết các hạng phòng — dùng cho room-detail.html?id=...
// Muốn thêm/sửa phòng chỉ cần sửa trong file này.

const BASE_AMENITIES = [
  "Điều hòa nhiệt độ điều chỉnh riêng",
  "Smart TV 55 inch với kênh quốc tế",
  "Wi-Fi tốc độ cao miễn phí",
  "Két an toàn điện tử",
  "Máy pha cà phê Nespresso & ấm đun nước",
  "Minibar",
  "Áo choàng tắm, dép đi trong phòng",
  "Bộ vệ sinh cá nhân cao cấp",
];

const LOUNGE_PERKS = [
  "Bữa sáng tại Executive Lounge (06:30 – 10:30)",
  "Trà chiều (14:30 – 16:30)",
  "Cocktail và món ăn nhẹ buổi tối (17:30 – 19:30)",
  "Nhận phòng / trả phòng riêng tại Lounge",
  "Sử dụng phòng họp nhỏ 2 giờ mỗi kỳ lưu trú",
];

const ROOM_POLICIES = [
  "Nhận phòng từ 14:00, trả phòng trước 12:00",
  "Trẻ em dưới 12 tuổi ở miễn phí khi dùng giường có sẵn",
  "Phòng không hút thuốc",
  "Có thể yêu cầu giường phụ (tuỳ hạng phòng, có phụ phí)",
];

const ROOMS = {
  "deluxe-king": {
    name: "Phòng Deluxe King",
    title: "Phòng Deluxe King – 1 giường King",
    tag: "DELUXE · HƯỚNG THÀNH PHỐ",
    price: 299,
    images: [
      "images/deluxe king,guest room,1 king.png",
      "images/hanjw-deluxe-bathroom-3959-hor-wide.png",
      "images/jw-hanjw-deluxe-city-room-23397_Wide-Hor.png",
    ],
    description:
      "Phòng Deluxe King mang đến không gian nghỉ dưỡng riêng tư với thiết kế hiện đại hòa quyện cùng nét tinh tế Á Đông. Cửa kính lớn giúp quý khách thu trọn toàn cảnh thành phố Hà Nội mỗi sáng. Phòng tắm rộng với bồn tắm nằm và vòi sen riêng biệt.",
    specs: { area: "45 m²", capacity: "2 người lớn", bed: "1 giường King", view: "Thành phố" },
    maxGuests: 2,
    extras: ["Bồn tắm nằm và vòi sen riêng", "Bàn làm việc rộng"],
    lounge: false,
  },
  "deluxe-double": {
    name: "Phòng Deluxe Double",
    title: "Phòng Deluxe Double – 2 giường đôi",
    tag: "DELUXE · HƯỚNG THÀNH PHỐ",
    price: 349,
    images: [
      "images/deluxe double,guest room,2double.png",
      "images/jw-hanjw-guestroom-2-double-beds-35658_Wide-Hor.png",
      "images/hanjw-garden-view-4346_Wide-Hor.png",
    ],
    description:
      "Lựa chọn lý tưởng cho gia đình hoặc nhóm bạn với 2 giường đôi rộng rãi. Phòng được bài trí ấm cúng với gam màu gỗ trầm, cửa sổ lớn hướng ra thành phố và khu vực tiếp khách nhỏ để thư giãn sau một ngày khám phá Hà Nội.",
    specs: { area: "45 m²", capacity: "3 người lớn", bed: "2 giường đôi", view: "Thành phố" },
    maxGuests: 3,
    extras: ["Bồn tắm nằm và vòi sen riêng", "Khu vực tiếp khách nhỏ"],
    lounge: false,
  },
  "deluxe-double-lake": {
    name: "Phòng Deluxe Double Hướng Hồ",
    title: "Phòng Deluxe Double hướng hồ – 2 giường đôi",
    tag: "DELUXE · HƯỚNG HỒ",
    price: 499,
    images: [
      "images/hanjw-guestroom-lake-0008-hor-wide.png",
      "images/jw-hanjw-guestroom-2-double-beds-35658_Wide-Hor.png",
      "images/hanjw-lake-view-4347_Wide-Hor.png",
    ],
    description:
      "Thức dậy với khung cảnh mặt hồ yên ả và khu vườn xanh mát ngay bên cửa sổ. Phòng có 2 giường đôi, phù hợp cho gia đình muốn tận hưởng không gian thiên nhiên giữa lòng thành phố, chỉ vài bước chân tới Khu Vườn Ven Hồ JW.",
    specs: { area: "45 m²", capacity: "3 người lớn", bed: "2 giường đôi", view: "Hồ" },
    maxGuests: 3,
    extras: ["Tầm nhìn trực diện ra hồ", "Bồn tắm nằm và vòi sen riêng"],
    lounge: false,
  },
  "executive-king": {
    name: "Phòng Executive King",
    title: "Phòng Executive – 1 giường King, sử dụng Executive Lounge",
    tag: "EXECUTIVE · HƯỚNG THÀNH PHỐ",
    price: 349,
    images: [
      "images/hanjw-executive-king-8353-hor-wide.png",
      "images/jw-hanjw-executive-lounge-29566_Wide-Hor.png",
      "images/hanjw-garden-view-4346_Wide-Hor.png",
    ],
    description:
      "Nằm ở các tầng cao, phòng Executive King dành cho khách công tác cần sự yên tĩnh và tiện nghi. Quý khách được sử dụng Executive Lounge với bữa sáng, trà chiều và cocktail buổi tối, cùng dịch vụ nhận và trả phòng riêng.",
    specs: { area: "48 m²", capacity: "2 người lớn", bed: "1 giường King", view: "Hồ" },
    maxGuests: 2,
    extras: ["Vị trí tầng cao", "Bàn làm việc công thái học"],
    lounge: true,
  },
  "executive-double": {
    name: "Phòng Executive Double",
    title: "Phòng Executive – 2 giường đôi, sử dụng Executive Lounge",
    tag: "EXECUTIVE · HƯỚNG THÀNH PHỐ",
    price: 399,
    images: [
      "images/hanjw-executive-bedroom-3958-hor-wide.png",
      "images/hanjw-executive-bathroom-6228-hor-wide.png",
      "images/jw-hanjw-executive-lounge-29566_Wide-Hor.png",
    ],
    description:
      "Phòng Executive với 2 giường đôi và bồn tắm lớn, phù hợp cho gia đình hoặc đồng nghiệp đi cùng nhau. Toàn bộ khách lưu trú đều được hưởng đặc quyền tại Executive Lounge suốt kỳ nghỉ.",
    specs: { area: "48 m²", capacity: "3 người lớn", bed: "2 giường đôi", view: "Thành phố" },
    maxGuests: 3,
    extras: ["Bồn tắm lớn", "Vị trí tầng cao"],
    lounge: true,
  },
  "junior-suite": {
    name: "Junior Suite",
    title: "Junior Suite 1 phòng ngủ – 1 giường King, sử dụng Executive Lounge",
    tag: "SUITE · HƯỚNG THÀNH PHỐ",
    price: 599,
    images: [
      "images/jw-hanjw-family-room-18103_Wide-Hor.png",
      "images/jw-hanjw-deluxe-suite-city-21215_Wide-Hor.png",
      "images/hanjw-lounge-0010-hor-wide.png",
    ],
    description:
      "Junior Suite có khu vực tiếp khách tách biệt với phòng ngủ, mang lại sự thoải mái cho kỳ lưu trú dài ngày. Thiết kế mở với cửa kính lớn đón ánh sáng tự nhiên, kèm đặc quyền Executive Lounge.",
    specs: { area: "70 m²", capacity: "3 người lớn", bed: "1 giường King", view: "Thành phố" },
    maxGuests: 3,
    extras: ["Phòng khách riêng", "Phòng tắm có bồn tắm và phòng tắm đứng", "Sofa giường cho khách thứ 3"],
    lounge: true,
  },
  "chairman-suite": {
    name: "Chairman Suite",
    title: "Chairman Suite – 1 giường King, sử dụng Executive Lounge",
    tag: "SUITE · HƯỚNG THÀNH PHỐ",
    price: 5000,
    images: [
      "images/jw-hanjw-chairman-suite-18174_Wide-Hor.png",
      "images/jw-hanjw-chairman-suite-14206_Wide-Hor.png",
      "images/hanjw-executive-bathroom-6228-hor-wide.png",
    ],
    description:
      "Chairman Suite là không gian dành cho những vị khách đòi hỏi sự riêng tư tuyệt đối: phòng khách rộng, phòng làm việc riêng, phòng ăn nhỏ và phòng ngủ chính với tầm nhìn bao quát thành phố. Phù hợp cho cả nghỉ dưỡng lẫn tiếp đón đối tác.",
    specs: { area: "180 m²", capacity: "4 người lớn", bed: "1 giường King", view: "Thành phố" },
    maxGuests: 4,
    extras: ["Phòng khách và phòng ăn riêng", "Phòng làm việc riêng", "Đưa đón sân bay bằng xe sang", "Quản gia riêng 24/7"],
    lounge: true,
  },
  "chairman-suite-lake": {
    name: "Chairman Suite Hướng Hồ",
    title: "Chairman Suite hướng hồ – 1 giường King, sử dụng Executive Lounge",
    tag: "SUITE · HƯỚNG HỒ",
    price: 6990,
    images: [
      "images/jw-hanjw-chairman-suite-35439_Wide-Hor.png",
      "images/jw-hanjw-chairman-suite-14206_Wide-Hor.png",
      "images/hanjw-lake-view-4347_Wide-Hor.png",
    ],
    description:
      "Phiên bản hướng hồ của Chairman Suite với toàn bộ phòng khách và phòng ngủ nhìn ra mặt hồ điều hòa và khu vườn xanh. Không gian rộng rãi, yên tĩnh, lý tưởng cho kỳ nghỉ cao cấp của gia đình.",
    specs: { area: "180 m²", capacity: "4 người lớn", bed: "1 giường King", view: "Hồ" },
    maxGuests: 4,
    extras: ["Tầm nhìn toàn cảnh hồ", "Phòng khách và phòng ăn riêng", "Đưa đón sân bay bằng xe sang", "Quản gia riêng 24/7"],
    lounge: true,
  },
  "presidential-suite": {
    name: "Presidential Suite",
    title: "Presidential Suite hướng hồ – 1 giường King, sử dụng Executive Lounge",
    tag: "SUITE · HƯỚNG HỒ",
    price: 8000,
    images: [
      "images/jw-hanjw-presidential-suite-26760-14644_Wide-Hor.png",
      "images/jw-hanjw-presidential-suite-26760-14644_Wide-Hor (1).png",
      "images/hanjw-lake-view-4347_Wide-Hor.png",
    ],
    description:
      "Hạng phòng cao cấp nhất của khách sạn với không gian rộng lớn, nội thất tinh xảo và tầm nhìn thoáng đãng ra hồ. Suite có phòng khách, phòng ăn 8 chỗ, phòng làm việc và phòng tắm lát đá cẩm thạch với bồn tắm nhìn ra hồ.",
    specs: { area: "300 m²", capacity: "4 người lớn", bed: "1 giường King", view: "Hồ" },
    maxGuests: 4,
    extras: ["Phòng ăn 8 chỗ", "Phòng tắm đá cẩm thạch nhìn ra hồ", "Đưa đón sân bay bằng xe sang", "Quản gia riêng 24/7"],
    lounge: true,
  },
};
