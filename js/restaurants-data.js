// Dữ liệu chi tiết nhà hàng & các gói dịch vụ đặt bàn — dùng cho cuisine.html
// Giá tính theo USD / người. Muốn sửa món, giá, khung giờ chỉ cần sửa trong file này.

// Dịp đặc biệt khách có thể chọn khi đặt bàn
const OCCASIONS = ["Không có", "Sinh nhật", "Kỷ niệm ngày cưới", "Hẹn hò", "Tiếp khách công việc", "Họp mặt gia đình"];

// Dịch vụ thêm (tính một lần cho cả bàn)
const ADD_ONS = [
  { id: "cake", name: "Bánh kem chúc mừng (15 cm)", price: 25 },
  { id: "flowers", name: "Bó hoa tươi", price: 40 },
  { id: "decor", name: "Trang trí bàn theo chủ đề", price: 30 },
  { id: "highchair", name: "Ghế ăn cho trẻ em", price: 0 },
];

const RESTAURANTS = {
  kumihimo: {
    name: "Kumihimo Modern Japanese Restaurant & Bar",
    intro:
      "Kumihimo là sự giao thoa giữa kỹ thuật ẩm thực Nhật Bản truyền thống và phong cách trình bày hiện đại. Đầu bếp chế biến trực tiếp tại quầy sushi và bếp teppanyaki, để thực khách vừa thưởng thức vừa chiêm ngưỡng từng thao tác.",
    info: { location: "Tầng 1, khu sảnh chính", capacity: "80 khách, 2 phòng riêng", dressCode: "Lịch sự", suitable: "Hẹn hò, tiếp khách, tiệc nhỏ" },
    dishes: [
      { name: "Sashimi cá ngừ & cá hồi", desc: "Cá tươi nhập khẩu, cắt lát tại quầy", price: 38 },
      { name: "Bò Wagyu nướng than binchotan", desc: "Phục vụ cùng muối biển và wasabi tươi", price: 65 },
      { name: "Tempura tôm hùm", desc: "Tôm hùm chiên giòn, sốt tentsuyu", price: 42 },
      { name: "Kem trà xanh Uji", desc: "Tráng miệng truyền thống Kyoto", price: 12 },
    ],
    packages: [
      { id: "alacarte", name: "Gọi món tại bàn", desc: "Đặt cọc giữ bàn, được trừ vào hoá đơn", price: 30 },
      { id: "bento", name: "Set trưa Bento", desc: "6 món theo mùa, chỉ phục vụ trưa thứ 7 & CN", price: 45, times: ["11:30", "12:30", "13:30"] },
      { id: "omakase", name: "Omakase 9 món", desc: "Thực đơn do bếp trưởng tuyển chọn", price: 120, times: ["17:30", "18:30", "19:30", "20:30"] },
    ],
    times: ["11:30", "12:30", "13:30", "17:30", "18:30", "19:30", "20:30"],
    lunchWeekendOnly: true,
    seating: [
      { name: "Bàn trong nhà", price: 0 },
      { name: "Quầy sushi (xem đầu bếp)", price: 0 },
      { name: "Phòng riêng (tối đa 10 khách)", price: 50 },
    ],
  },
  "jw-cafe": {
    name: "JW Café",
    intro:
      "Nhà hàng buffet quốc tế với các quầy bếp mở phục vụ món Việt, Á, Âu, hải sản và tráng miệng. Không gian ngập tràn ánh sáng tự nhiên, phù hợp cho mọi bữa ăn trong ngày, đặc biệt là các gia đình có trẻ nhỏ.",
    info: { location: "Tầng 1, nhìn ra khu vườn", capacity: "220 khách", dressCode: "Thoải mái", suitable: "Gia đình, nhóm bạn, bữa sáng" },
    dishes: [
      { name: "Quầy phở & bún Hà Nội", desc: "Nấu theo yêu cầu tại quầy", price: null },
      { name: "Quầy hải sản tươi", desc: "Tôm, cua, hàu, sò điệp (buffet tối)", price: null },
      { name: "Thịt bò nướng nguyên tảng", desc: "Thái tại bàn, sốt tiêu đen", price: null },
      { name: "Quầy bánh ngọt & chocolate", desc: "Do bếp bánh của khách sạn làm mỗi ngày", price: null },
    ],
    packages: [
      { id: "breakfast", name: "Buffet sáng", desc: "Trẻ em dưới 6 tuổi miễn phí", price: 35, times: ["06:30", "07:30", "08:30", "09:30"] },
      { id: "lunch", name: "Buffet trưa", desc: "Món Việt & quốc tế", price: 45, times: ["12:00", "13:00"] },
      { id: "dinner", name: "Buffet tối hải sản", desc: "Bao gồm quầy hải sản tươi và nước ép", price: 75, times: ["18:00", "19:00", "20:00"] },
    ],
    times: ["06:30", "07:30", "08:30", "09:30", "12:00", "13:00", "18:00", "19:00", "20:00"],
    seating: [
      { name: "Bàn trong nhà", price: 0 },
      { name: "Bàn cạnh cửa kính nhìn ra vườn", price: 0 },
      { name: "Khu vực dành cho gia đình có trẻ nhỏ", price: 0 },
    ],
  },
  "man-ho": {
    name: "Man Ho Chinese Restaurant",
    intro:
      "Man Ho phục vụ ẩm thực Quảng Đông chính thống do đội ngũ đầu bếp Hồng Kông đảm nhiệm. Thực đơn nổi bật với dim sum làm thủ công mỗi ngày, vịt quay Bắc Kinh lạng tại bàn và các món hải sản hấp, xào truyền thống.",
    info: { location: "Tầng 2", capacity: "120 khách, 6 phòng riêng", dressCode: "Lịch sự", suitable: "Tiệc gia đình, tiếp khách, sự kiện" },
    dishes: [
      { name: "Vịt quay Bắc Kinh", desc: "Lạng tại bàn, ăn kèm bánh tráng mỏng", price: 68 },
      { name: "Há cảo tôm pha lê", desc: "Dim sum làm thủ công mỗi ngày", price: 9 },
      { name: "Cá mú hấp xì dầu", desc: "Cá tươi sống chọn tại bể", price: 55 },
      { name: "Chè hạnh nhân tuyết yến", desc: "Tráng miệng thanh mát", price: 10 },
    ],
    packages: [
      { id: "alacarte", name: "Gọi món tại bàn", desc: "Đặt cọc giữ bàn, được trừ vào hoá đơn", price: 30 },
      { id: "dimsum", name: "Set Dim Sum trưa", desc: "12 loại dim sum + trà Phổ Nhĩ", price: 40, times: ["11:30", "12:30", "13:00"] },
      { id: "banquet", name: "Set tiệc Quảng Đông", desc: "8 món, gồm vịt quay Bắc Kinh", price: 95, times: ["17:30", "18:30", "19:30", "20:30"] },
    ],
    times: ["11:30", "12:30", "13:00", "17:30", "18:30", "19:30", "20:30"],
    seating: [
      { name: "Sảnh chính", price: 0 },
      { name: "Bàn tròn cạnh cửa sổ", price: 0 },
      { name: "Phòng riêng (tối đa 12 khách)", price: 60 },
    ],
  },
  "french-grill": {
    name: "French Grill",
    intro:
      "French Grill mang đến ẩm thực Pháp đương đại với thực đơn thay đổi theo mùa, quầy rượu vang hơn 300 nhãn và bếp nướng mở. Nhà hàng từng được Michelin Selected ba năm liên tiếp, là địa điểm lý tưởng cho những bữa tối quan trọng.",
    info: { location: "Tầng 2, khu vực riêng", capacity: "90 khách, 1 phòng rượu riêng", dressCode: "Trang trọng (không mặc quần short)", suitable: "Hẹn hò, kỷ niệm, tiếp đối tác" },
    dishes: [
      { name: "Gan ngỗng áp chảo", desc: "Sốt vả và bánh brioche", price: 34 },
      { name: "Thăn bò Wagyu M9", desc: "Nướng than, khoai tây nghiền truffle", price: 95 },
      { name: "Tôm hùm Boston nướng bơ", desc: "Sốt bisque, rau củ theo mùa", price: 78 },
      { name: "Soufflé Grand Marnier", desc: "Nướng theo yêu cầu, chờ 20 phút", price: 16 },
    ],
    packages: [
      { id: "alacarte", name: "Gọi món tại bàn", desc: "Đặt cọc giữ bàn, được trừ vào hoá đơn", price: 40 },
      { id: "set3", name: "Set 3 món", desc: "Khai vị, món chính, tráng miệng", price: 85 },
      { id: "tasting", name: "Thực đơn thử nếm 6 món kèm rượu", desc: "Mỗi món kết hợp một loại vang", price: 180 },
    ],
    times: ["18:00", "19:00", "20:00", "21:00"],
    seating: [
      { name: "Sảnh chính", price: 0 },
      { name: "Bàn cạnh bếp nướng mở", price: 0 },
      { name: "Phòng rượu riêng (tối đa 8 khách)", price: 80 },
    ],
  },
  "the-lounge": {
    name: "The Lounge",
    intro:
      "The Lounge nằm ngay sảnh khách sạn với trần cao và cửa kính lớn nhìn ra hồ. Buổi chiều là trà chiều kiểu Anh trên tháp bánh ba tầng, buổi tối là cocktail và nhạc sống nhẹ nhàng.",
    info: { location: "Tầng 1, sảnh khách sạn", capacity: "70 khách", dressCode: "Thoải mái lịch sự", suitable: "Gặp gỡ bạn bè, trà chiều, thư giãn" },
    dishes: [
      { name: "Tháp trà chiều 3 tầng", desc: "Bánh mặn, scone và bánh ngọt Pháp", price: null },
      { name: "Trà TWG tuyển chọn", desc: "Hơn 20 loại trà", price: 8 },
      { name: "Cocktail đặc trưng JW", desc: "Pha chế từ thảo mộc Vườn JW", price: 14 },
      { name: "Chocolate thủ công", desc: "Hộp 6 viên do bếp bánh làm", price: 18 },
    ],
    packages: [
      { id: "tea", name: "Trà chiều", desc: "Tháp bánh 3 tầng + trà hoặc cà phê", price: 38, times: ["14:30", "15:30", "16:30"] },
      { id: "tea-champagne", name: "Trà chiều kèm Champagne", desc: "Thêm 1 ly Champagne mỗi khách", price: 60, times: ["14:30", "15:30", "16:30"] },
      { id: "cocktail", name: "Giờ cocktail", desc: "2 ly cocktail + đồ ăn nhẹ", price: 25, times: ["17:30", "18:30", "19:30", "20:30"] },
    ],
    times: ["14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30"],
    seating: [
      { name: "Sofa trong sảnh", price: 0 },
      { name: "Bàn cạnh cửa kính nhìn ra hồ", price: 0 },
      { name: "Quầy bar", price: 0 },
    ],
  },
};
