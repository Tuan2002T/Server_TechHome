const { Client, Pool } = require('pg')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()

const pool = new Pool({
  user: process.env.USERNAMEPG,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT
})

const saltRounds = 10

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds)
  return bcrypt.hash(password, salt)
}

async function insertRoles() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Roles" ("roleName", "createdAt", "updatedAt") VALUES ('Admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), ('Resident', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
    )
    await client.query('COMMIT')
    console.log('Insert roles successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert roles', error)
  } finally {
    client.release()
  }
}

async function insertUsers() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const users = [
      ['Nguyễn Văn An', 'nguyenvanan', 'pass1', 'an@example.com', 1],
      ['Trần Thị Bích', 'tranthibich', 'pass2', 'bich@example.com', 1],
      ['Lê Minh Cường', 'leminhcuong', 'pass3', 'cuong@example.com', 2],
      ['Phạm Thị Duyên', 'phamthiduyen', 'pass4', 'duyen@example.com', 2],
      ['Đỗ Văn E', 'dovane', 'pass5', 'e@example.com', 2],
      ['Nguyễn Thị Hà', 'nguyenthih', 'pass6', 'ha@example.com', 2],
      ['Vũ Văn Hải', 'vuvanhai', 'pass7', 'hai@example.com', 2],
      ['Hoàng Thị Hương', 'hoangthihuong', 'pass8', 'huong@example.com', 2],
      ['Bùi Văn I', 'buivani', 'pass9', 'i@example.com', 2],
      ['Nguyễn Văn J', 'nguyenvanj', 'pass10', 'j@example.com', 2],
      ['Lê Thị Kim', 'lethikim', 'pass11', 'kim@example.com', 2],
      ['Phạm Văn Long', 'phamvanlong', 'pass12', 'long@example.com', 2],
      ['Nguyễn Thị Mai', 'nguyenthimai', 'pass13', 'mai@example.com', 2],
      ['Trần Văn Nam', 'tranvanam', 'pass14', 'nam@example.com', 2],
      ['Lê Văn Oanh', 'levanoanh', 'pass15', 'oanh@example.com', 2],
      ['Đinh Văn Phát', 'dinhvanphat', 'pass16', 'phat@example.com', 2],
      ['Nguyễn Thị Quỳnh', 'nguyenthiquynh', 'pass17', 'quynh@example.com', 2],
      ['Nguyễn Văn Rồng', 'nguyenvanrong', 'pass18', 'rong@example.com', 2],
      ['Phạm Văn Sáng', 'phamvansang', 'pass19', 'sang@example.com', 2],
      ['Trần Thị Tuyết', 'tranthituyet', 'pass20', 'tuyet@example.com', 2],
      ['Nguyễn Văn Hưng', 'nguyenvanhung', 'pass21', 'hung@example.com', 2],
      ['Lê Thị Lan', 'lethilan', 'pass22', 'lan@example.com', 2],
      ['Trần Văn Vinh', 'tranvanvinh', 'pass23', 'vinh@example.com', 2],
      ['Phạm Thị Hoa', 'phamthih', 'pass24', 'hoa@example.com', 2],
      ['Vũ Văn Tùng', 'vuvantung', 'pass25', 'tung@example.com', 2],
      ['Đỗ Thị Mai', 'dothimai', 'pass26', 'mai2@example.com', 2],
      ['Bùi Văn Minh', 'buivanminh', 'pass27', 'minh@example.com', 2],
      ['Nguyễn Thị Nhi', 'nguyenthini', 'pass28', 'nhi@example.com', 2],
      ['Lê Văn Quyền', 'levanquyen', 'pass29', 'quyen@example.com', 2],
      ['Trần Thị Xuyến', 'tranthixuyen', 'pass30', 'xuyen@example.com', 2],
      ['Nguyễn Văn Đạt', 'nguyenvandat', 'pass31', 'dat@example.com', 2],
      ['Phạm Văn Hòa', 'phamvanhoa', 'pass32', 'hoa2@example.com', 2],
      ['Đinh Thị Thảo', 'dinhthithao', 'pass33', 'thao@example.com', 2],
      ['Vũ Văn Thái', 'vuvanthai', 'pass34', 'thai@example.com', 2],
      ['Trần Văn Khoa', 'tranvankhoa', 'pass35', 'khoa@example.com', 2],
      ['Nguyễn Thị Phượng', 'nguyenthiph', 'pass36', 'phuong@example.com', 2],
      ['Lê Văn Hùng', 'levanhung', 'pass37', 'hung2@example.com', 2],
      ['Nguyễn Văn Hòa', 'nguyenvanhoaa', 'pass38', 'hoa3@example.com', 2],
      ['Đỗ Thị Duyên', 'dothiduyen', 'pass39', 'duyen2@example.com', 2],
      ['Vũ Văn Tuấn', 'vuvantu', 'pass40', 'tuan@example.com', 2],
      ['Phạm Văn Phúc', 'phamvanphuc', 'pass41', 'phuc@example.com', 2],
      ['Lê Thị Lệ', 'lethile', 'pass42', 'le@example.com', 2],
      ['Nguyễn Văn Tiến', 'nguyenvantien', 'pass43', 'tien@example.com', 2],
      ['Trần Thị Diệu', 'tranthidieu', 'pass44', 'dieuu@example.com', 2],
      ['Nguyễn Thị Tâm', 'nguyenthitam', 'pass45', 'tam@example.com', 2],
      ['Lê Văn Thiện', 'levanthi', 'pass46', 'thien@example.com', 2],
      ['Đinh Văn Bảo', 'dinhvanbao', 'pass47', 'bao@example.com', 2],
      ['Nguyễn Thị Ngọc', 'nguyenthinhoc', 'pass48', 'ngoc@example.com', 2],
      ['Vũ Văn Lộc', 'vuvanloc', 'pass49', 'loc@example.com', 2],
      ['Phạm Thị Xuân', 'phamthixuan', 'pass50', 'xuan@example.com', 2],
      ['Trần Văn Dũng', 'tranvandung', 'pass51', 'dung@example.com', 2],
      ['Nguyễn Văn Nghĩa', 'nguyenvannghia', 'pass52', 'nghia@example.com', 2],
      ['Lê Thị Kiều', 'lethikieu', 'pass53', 'kieu@example.com', 2],
      ['Đỗ Văn Thắng', 'dovanthang', 'pass54', 'thang@example.com', 2],
      ['Nguyễn Thị Hạnh', 'nguyenthihanh', 'pass55', 'hanh@example.com', 2],
      ['Vũ Văn Sang', 'vuvansang', 'pass56', 'sang2@example.com', 2],
      ['Trần Thị Nhung', 'tranthinhung', 'pass57', 'nhung@example.com', 2],
      ['Nguyễn Văn Tài', 'nguyenvantai', 'pass58', 'tai@example.com', 2],
      ['Phạm Thị Mai', 'phamthimai', 'pass59', 'mai4@example.com', 2],
      ['Lê Văn Phúc', 'levanphuc', 'pass60', 'phuc2@example.com', 2],
      ['Đinh Văn Khải', 'dinhvankhai', 'pass61', 'khai@example.com', 2],
      ['Nguyễn Thị Oanh', 'nguyenthioanh', 'pass62', 'oanh2@example.com', 2],
      ['Vũ Văn An', 'vuvan', 'pass63', 'van@example.com', 2],
      ['Trần Văn Cường', 'tranvancuong', 'pass64', 'cuong2@example.com', 2],
      ['Nguyễn Thị Bảo', 'nguyenthibao', 'pass65', 'bao2@example.com', 2],
      ['Lê Văn Minh', 'levanminh', 'pass66', 'minh2@example.com', 2],
      ['Đỗ Thị Bình', 'dothibinh', 'pass67', 'binh@example.com', 2],
      ['Nguyễn Văn Tiến', 'nguyenvantien2', 'pass68', 'tien2@example.com', 2],
      ['Vũ Thị Tươi', 'vuthituoi', 'pass69', 'tuoi@example.com', 2],
      ['Phạm Văn Lâm', 'phamvanlam', 'pass70', 'lam@example.com', 2],
      ['Trần Văn Hiếu', 'tranvanhieu', 'pass71', 'hieu@example.com', 2],
      ['Nguyễn Thị Mến', 'nguyenthimen', 'pass72', 'men@example.com', 2],
      ['Lê Văn Hòa', 'levanhoaa', 'pass73', 'hoa4@example.com', 2],
      ['Đinh Văn Giang', 'dinhvangiang', 'pass74', 'giang@example.com', 2],
      ['Nguyễn Thị Giang', 'nguyenthigiang', 'pass75', 'giang2@example.com', 2],
      ['Trần Văn Thành', 'tranvanthanh', 'pass76', 'thanh@example.com', 2],
      ['Phạm Thị Hằng', 'phamthihang', 'pass77', 'hang@example.com', 2],
      ['Vũ Văn Ninh', 'vuvanninh', 'pass78', 'ninh@example.com', 2],
      ['Nguyễn Văn Tín', 'nguyenvantinn', 'pass79', 'tin@example.com', 2],
      ['Đỗ Thị Liên', 'dothilien', 'pass80', 'lien@example.com', 2],
      ['Trần Văn Quyết', 'tranvanquyet', 'pass81', 'quyet@example.com', 2],
      ['Nguyễn Thị Thu', 'nguyenthitthu', 'pass82', 'thu@example.com', 2],
      ['Lê Văn Trung', 'levantrung', 'pass83', 'trung@example.com', 2],
      ['Phạm Văn Sơn', 'phamvanson', 'pass84', 'son@example.com', 2],
      ['Vũ Thị Hương', 'vuthihuong', 'pass85', 'huong2@example.com', 2],
      ['Trần Thị Hương', 'tranthihuong', 'pass86', 'huong3@example.com', 2],
      ['Nguyễn Văn Kiệt', 'nguyenvankiet', 'pass87', 'kiet@example.com', 2],
      ['Lê Thị Nhung', 'lethinhung', 'pass88', 'nhung2@example.com', 2],
      ['Phạm Văn Minh', 'phamvanminh2', 'pass89', 'minh3@example.com', 2],
      ['Đỗ Văn Phúc', 'dovanphuc', 'pass90', 'phuc3@example.com', 2],
      ['Nguyễn Thị Tình', 'nguyenthitinh', 'pass91', 'tinh@example.com', 2],
      ['Vũ Văn Khoa', 'vuvankhoa2', 'pass92', 'khoa2@example.com', 2],
      ['Trần Văn Tùng', 'tranvantung2', 'pass93', 'tung2@example.com', 2],
      ['Nguyễn Thị Huyền', 'nguyenthihuyen', 'pass94', 'huyen@example.com', 2],
      ['Lê Văn Tuyết', 'levantuyet', 'pass95', 'tuyet2@example.com', 2],
      ['Phạm Văn Khải', 'phamvankhai', 'pass96', 'khai2@example.com', 2],
      ['Nguyễn Văn Phú', 'nguyenvanphu', 'pass97', 'phu@example.com', 2],
      ['Trần Thị Châu', 'tranthichau', 'pass98', 'chau@example.com', 2],
      ['Đỗ Văn Ngọc', 'dovanngoc', 'pass99', 'ngoc2@example.com', 2],
      ['Nguyễn Thị Dung', 'nguyenthidung', 'pass100', 'dung@example.com', 2]
    ]

    for (const [fullname, username, password, email, roleId] of users) {
      const hashedPassword = await hashPassword(password)
      await client.query(
        `
        INSERT INTO "Users" ("fullname", "username", "password", "email", "createdAt", "updatedAt", "roleId")
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $5)
      `,
        [fullname, username, hashedPassword, email, roleId]
      )
    }
    await client.query('COMMIT')
    console.log('Insert users successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert users', error)
  } finally {
    client.release()
  }
}

async function insertBuildings() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Buildings" ("buildingName", "buildingAddress", "createdAt", "updatedAt") VALUES
      ('Tòa nhà Ánh Dương', '123 Đường Hoa Mai, Quận 1, TP.HCM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chung cư Bình Minh', '456 Đường Ngọc Lan, Quận 2, TP.HCM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Khu căn hộ Phú Nhuận', '789 Đường Phú Nhuận, Quận Phú Nhuận, TP.HCM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Căn hộ Vườn Xoài', '101 Đường Vườn Xoài, Quận 3, TP.HCM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Tòa nhà Hòa Bình', '202 Đường Hòa Bình, Quận 4, TP.HCM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
    )

    await client.query('COMMIT')
    console.log('Insert buildings successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert buildings', error)
  } finally {
    client.release()
  }
}

async function insertFloors() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Floors" ("floorNumber", "createdAt", "updatedAt", "buildingId") VALUES
      (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      (3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      (5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      (6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      (7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      (8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      (9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      (10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),

      (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),

      (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),

      (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),

      (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      (3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      (5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      (6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      (7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      (8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      (9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      (10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5);`
    )

    await client.query('COMMIT')
    console.log('Insert floors successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert floors', error)
  } finally {
    client.release()
  }
}

async function insertApartments() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Apartments" ("apartmentNumber", "apartmentType", "createdAt", "updatedAt", "floorId") VALUES
      ('101', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('102', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('103', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('104', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('105', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('106', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('107', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('108', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('109', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('110', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('201', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('202', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('203', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('204', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('205', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('206', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('207', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('208', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('209', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('210', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('301', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('302', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('303', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('304', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('305', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('306', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('307', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('308', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('309', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('310', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('401', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('402', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('403', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('404', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('405', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('406', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('407', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('408', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('409', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('410', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('501', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('502', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('503', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('504', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('505', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('506', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('507', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('508', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('509', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('510', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5);`
    )

    await client.query('COMMIT')
    console.log('Insert apartments successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert apartments', error)
  } finally {
    client.release()
  }
}

async function insertAdmins() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Admins" ("createdAt", "updatedAt", "userId", "buildingId") VALUES
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2);`
    )

    await client.query('COMMIT')
    console.log('Insert admins successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert admins', error)
  }
}

async function insertResidents() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Residents" ("phonenumber", "idcard", "active", "createdAt", "updatedAt", "userId") VALUES
      ('1234567890', 'ID001', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('2345678901', 'ID002', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('3456789012', 'ID003', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('4567890123', 'ID004', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('5678901234', 'ID005', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('6789012345', 'ID006', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('7890123456', 'ID007', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('8901234567', 'ID008', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('1234567893', 'ID009', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('1234567894', 'ID010', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('1234567895', 'ID011', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('1234567896', 'ID012', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('1234567897', 'ID013', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('1234567898', 'ID014', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('1234567899', 'ID015', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('1234567800', 'ID016', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('1234567801', 'ID017', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11),
      ('1234567802', 'ID018', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12),
      ('1234567803', 'ID019', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13),
      ('1234567804', 'ID020', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14),
      ('1234567805', 'ID021', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15),
      ('1234567806', 'ID022', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16),
      ('1234567807', 'ID023', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17),
      ('1234567808', 'ID024', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18),
      ('1234567809', 'ID025', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19),
      ('1234567810', 'ID026', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20),
      ('1234567811', 'ID027', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21),
      ('1234567812', 'ID028', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22),
      ('1234567813', 'ID029', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23),
      ('1234567814', 'ID030', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24),
      ('1234567815', 'ID031', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25),
      ('1234567816', 'ID032', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 26),
      ('1234567817', 'ID033', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 27),
      ('1234567818', 'ID034', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 28),
      ('1234567819', 'ID035', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 29),
      ('1234567820', 'ID036', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 30),
      ('1234567821', 'ID037', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 31),
      ('1234567822', 'ID038', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 32),
      ('1234567823', 'ID039', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 33),
      ('1234567824', 'ID040', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 34),
      ('1234567825', 'ID041', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 35),
      ('1234567826', 'ID042', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 36),
      ('1234567827', 'ID043', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 37),
      ('1234567828', 'ID044', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 38),
      ('1234567829', 'ID045', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 39),
      ('1234567830', 'ID046', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 40),
      ('1234567831', 'ID047', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 41),
      ('1234567832', 'ID048', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 42),
      ('1234567833', 'ID049', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 43),
      ('1234567834', 'ID050', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 44),
      ('1234567835', 'ID051', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 45),
      ('1234567836', 'ID052', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 46),
      ('1234567837', 'ID053', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 47),
      ('1234567838', 'ID054', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 48),
      ('1234567839', 'ID055', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 49),
      ('1234567840', 'ID056', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 50),
      ('1234567841', 'ID057', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 51),
      ('1234567842', 'ID058', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 52),
      ('1234567843', 'ID059', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 53),
      ('1234567844', 'ID060', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 54),
      ('1234567845', 'ID061', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 55),
      ('1234567846', 'ID062', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 56),
      ('1234567847', 'ID063', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 57),
      ('1234567848', 'ID064', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 58),
      ('1234567849', 'ID065', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 59),
      ('1234567850', 'ID066', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 60),
      ('1234567851', 'ID067', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 61),
      ('1234567852', 'ID068', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 62),
      ('1234567853', 'ID069', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 63),
      ('1234567854', 'ID070', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 64),
      ('1234567855', 'ID071', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 65),
      ('1234567856', 'ID072', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 66),
      ('1234567857', 'ID073', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 67),
      ('1234567858', 'ID074', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 68),
      ('1234567859', 'ID075', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 69),
      ('1234567860', 'ID076', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 70),
      ('1234567861', 'ID077', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 71),
      ('1234567862', 'ID078', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 72),
      ('1234567863', 'ID079', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 73),
      ('1234567864', 'ID080', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 74),
      ('1234567865', 'ID081', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 75),
      ('1234567866', 'ID082', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 76),
      ('1234567867', 'ID083', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 77),
      ('1234567868', 'ID084', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 78),
      ('1234567869', 'ID085', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 79),
      ('1234567870', 'ID086', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80),
      ('1234567871', 'ID087', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 81),
      ('1234567872', 'ID088', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 82),
      ('1234567873', 'ID089', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 83),
      ('1234567874', 'ID090', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 84),
      ('1234567875', 'ID091', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 85),
      ('1234567876', 'ID092', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 86),
      ('1234567877', 'ID093', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 87),
      ('1234567878', 'ID094', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 88),
      ('1234567879', 'ID095', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 89),
      ('1234567880', 'ID096', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 90),
      ('1234567881', 'ID097', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 91),
      ('1234567882', 'ID098', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 92),
      ('1234567883', 'ID099', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 93),
      ('1234567884', 'ID100', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 94),
      ('1234567885', 'ID101', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 95),
      ('1234567886', 'ID102', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 96),
      ('1234567887', 'ID103', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 97),
      ('1234567888', 'ID104', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 98),
      ('1234567889', 'ID105', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 99),
      ('1234567890', 'ID106', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 100);`
    )

    await client.query('COMMIT')
    console.log('Insert residents successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert residents', error)
  } finally {
    client.release()
  }
}

async function insertResidentApartments() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "ResidentApartments" ("createdAt", "updatedAt", "apartmentId", "residentId") VALUES
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 4),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 8),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 10),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 11),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 12),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 13),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 14),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 15),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 16),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 17),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 18),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 19),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 20),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 21),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 22),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 23),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 24),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 25),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 26),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 27),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 28),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 29),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 30),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 31),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 32),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 33),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 34),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 35),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 36),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 37),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 38),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 39),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 40),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11, 41),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11, 42),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11, 43),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11, 44),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12, 45),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12, 46),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12, 47),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12, 48),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13, 49),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13, 50),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13, 51),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13, 52),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14, 53),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14, 54),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14, 55),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14, 56),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15, 57),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15, 58),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15, 59),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15, 60),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16, 61),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16, 62),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16, 63),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16, 64),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17, 65),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17, 66),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17, 67),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17, 68),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18, 69),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18, 70),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18, 71),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18, 72),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19, 73),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19, 74),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19, 75),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19, 76),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20, 77),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20, 78),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20, 79),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20, 80),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21, 81),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21, 82),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21, 83),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21, 84),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22, 85),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22, 86),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22, 87),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22, 88),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23, 89),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23, 90),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23, 91),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23, 92),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24, 93),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24, 94),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24, 95),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24, 96),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25, 97),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25, 98),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25, 99),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25, 100);`
    )

    await client.query('COMMIT')
    console.log('Insert resident apartments successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert resident apartments', error)
  } finally {
    client.release()
  }
}

async function insertComplaints() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Complaints" ("complaintDescription", "complaintDate", "complaintStatus", "createdAt", "updatedAt", "residentId") VALUES
      ('Có tiếng ồn liên tục phát ra từ căn hộ trên tầng tôi vào giờ khuya, điều này đã gây cản trở nghiêm trọng đến giấc ngủ của tôi.', '2024-09-28', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Vòi nước trong bếp của tôi đã bị rò rỉ trong vài ngày qua, khiến nước tích tụ trên mặt bàn và tạo ra sự lộn xộn.', '2024-09-27', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Tôi đã gửi yêu cầu sửa chữa cửa sổ bị hỏng nhưng chưa thấy ai đến kiểm tra.', '2024-09-26', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Máy điều hòa không khí trong căn hộ của tôi không hoạt động đúng cách, khiến tôi không thể làm mát không gian sống của mình.', '2024-09-25', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Có một số cư dân không tuân thủ quy tắc im lặng vào ban đêm, gây khó chịu cho những người khác.', '2024-09-24', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Máy giặt chung trong khu vực giặt ủi thường xuyên bị hỏng, và tôi phải chờ đợi rất lâu để có thể giặt quần áo của mình.', '2024-09-28', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Tôi thấy có nhiều côn trùng trong căn hộ của mình, rất khó chịu và không an toàn.', '2024-09-27', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Hệ thống báo cháy không hoạt động, tôi rất lo ngại về sự an toàn của cư dân.', '2024-09-26', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Có người để rác bừa bãi ở hành lang, gây mất vệ sinh cho khu vực sống.', '2024-09-25', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Cửa ra vào chung bị hỏng, điều này khiến tôi cảm thấy không an toàn khi ở nhà.', '2024-09-24', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Hệ thống nước nóng không hoạt động, tôi không thể tắm vào những ngày lạnh.', '2024-09-28', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Tôi thấy có nhiều người không đeo khẩu trang khi sử dụng thang máy, không đảm bảo an toàn sức khỏe.', '2024-09-27', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Có một số người thường xuyên tụ tập trong khu vực chung, gây mất trật tự.', '2024-09-26', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Hệ thống điện trong căn hộ có dấu hiệu chập chờn, cần được kiểm tra.', '2024-09-25', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Không có đủ chỗ đậu xe cho cư dân, tôi thường phải đậu xa.', '2024-09-24', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Hệ thống camera an ninh không hoạt động, tôi cảm thấy không an toàn.', '2024-09-28', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Có nhiều tiếng ồn phát ra từ các sự kiện trong khu vực, ảnh hưởng đến cuộc sống của tôi.', '2024-09-27', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Phòng tập thể dục không đủ trang thiết bị, tôi không thể tập luyện đúng cách.', '2024-09-26', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Tôi không thể sử dụng internet vì tốc độ quá chậm.', '2024-09-25', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Có nhiều đồ dùng cá nhân bị mất trong khu vực chung.', '2024-09-24', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Cây cối trong khuôn viên không được cắt tỉa, gây mất thẩm mỹ.', '2024-09-28', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Có nhiều người không dọn dẹp sau khi sử dụng khu vực BBQ.', '2024-09-27', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Máy lạnh trong phòng sinh hoạt chung không hoạt động, khiến nơi này trở nên ngột ngạt.', '2024-09-26', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Nhiều cư dân không tuân thủ quy định về thời gian im lặng.', '2024-09-25', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Cần có bảng thông báo rõ ràng hơn về các sự kiện trong tòa nhà.', '2024-09-24', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Có tiếng động lớn phát ra từ hệ thống điều hòa chung.', '2024-09-28', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Hệ thống an ninh không đủ mạnh, khiến tôi cảm thấy không an toàn.', '2024-09-27', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Chúng tôi cần thêm thùng rác ở các khu vực chung.', '2024-09-26', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Tôi cảm thấy không thoải mái khi sử dụng thang máy vì có nhiều người không đeo khẩu trang.', '2024-09-25', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Có rất nhiều người không tuân thủ quy tắc về việc giữ gìn vệ sinh chung.', '2024-09-24', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Hệ thống sưởi trong phòng không hoạt động, khiến tôi rất lạnh.', '2024-09-28', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Nhiều lần tôi không thấy nhân viên bảo trì đến sửa chữa khi cần.', '2024-09-27', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Cửa ra vào bị kẹt, tôi gặp khó khăn khi ra vào.', '2024-09-26', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Có nhiều côn trùng xuất hiện trong nhà, tôi rất lo lắng.', '2024-09-25', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Hệ thống ánh sáng trong hành lang quá tối, không an toàn.', '2024-09-24', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Có mùi hôi thối phát ra từ khu vực rác.', '2024-09-28', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('Tôi không thể sử dụng bể bơi vì có quá nhiều người và không đủ ghế.', '2024-09-27', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('Máy giặt không hoạt động, khiến tôi phải chờ đợi rất lâu để giặt đồ.', '2024-09-26', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('Cần có các biện pháp phòng cháy chữa cháy nghiêm ngặt hơn.', '2024-09-25', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('Tôi không thể tìm thấy thông tin về quy tắc sử dụng khu vực chung.', '2024-09-24', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('Có mùi hôi thối từ hệ thống thoát nước.', '2024-09-28', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('Nhiều cư dân không dọn dẹp sau khi sử dụng khu vực thể dục.', '2024-09-27', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('Có quá nhiều tiếng ồn từ các sự kiện được tổ chức trong khu vực chung.', '2024-09-26', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('Hệ thống điện không ổn định, tôi rất lo lắng về an toàn.', '2024-09-25', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('Nhiều cư dân không tuân thủ các quy định an toàn khi sử dụng thang máy.', '2024-09-24', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('Hệ thống camera an ninh không đủ độ bao phủ cho khu vực chung.', '2024-09-28', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('Có nhiều trường hợp mất mát đồ dùng cá nhân trong khu vực chung.', '2024-09-27', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('Hệ thống nước nóng không hoạt động, tôi không thể tắm.', '2024-09-26', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('Cần có các quy định chặt chẽ hơn về việc sử dụng thang máy.', '2024-09-25', 'Mở', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('Có tiếng ồn lớn phát ra từ căn hộ bên cạnh vào ban đêm.', '2024-09-24', 'Đang xử lý', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10);`
    )

    await client.query('COMMIT')
    console.log('Insert complaints successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert complaints', error)
  } finally {
    client.release()
  }
}

async function insertVehicles() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Vehicles" ("vehicleNumber", "vehicleType", "createdAt", "updatedAt", "residentId") VALUES
      ('ABC123', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('DEF456', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('GHI789', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('JKL012', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('MNO345', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('PQR678', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('STU901', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('VWX234', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('XYZ567', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('LMN890', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10);`
    )

    await client.query('COMMIT')
    console.log('Insert vehicles successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert vehicles', error)
  } finally {
    client.release()
  }
}

async function insertNotifications() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Notifications" ("notificationTitle", "notificationBody", "createdAt", "updatedAt") VALUES
        ('Thông báo thanh toán', 'Nhắc nhở: Hạn thanh toán phí dịch vụ là 30/10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Chương trình giảm giá', 'Giảm giá 20% cho tất cả cư dân trong tháng này', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Cuộc họp cư dân', 'Cuộc họp cư dân sẽ diễn ra vào thứ Ba tuần tới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Chương trình chăm sóc sức khỏe', 'Khám sức khỏe miễn phí cho cư dân vào thứ Bảy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Thông báo về bảo trì đường ống', 'Bảo trì đường ống nước sẽ diễn ra vào thứ Năm', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Đăng ký sự kiện', 'Mời bạn đăng ký tham gia sự kiện thể thao vào cuối tháng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Hạn nộp phí dịch vụ', 'Nhắc nhở: Hạn nộp phí dịch vụ là ngày 30 hàng tháng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Thông báo lịch bảo trì', 'Lịch bảo trì thiết bị sẽ được thông báo sớm', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Tổ chức lễ hội', 'Lễ hội mùa hè sẽ diễn ra vào cuối tháng tới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Khóa học trực tuyến', 'Khóa học kỹ năng mềm miễn phí sẽ bắt đầu vào tuần sau', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Thông báo thời tiết', 'Thời tiết hôm nay sẽ có mưa, hãy chuẩn bị ô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Cảnh báo an toàn', 'Nhắc nhở: Đảm bảo khóa cửa trước khi ra khỏi nhà', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Thông báo kiểm tra an ninh', 'Kiểm tra an ninh sẽ diễn ra vào thứ Sáu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Chương trình hỗ trợ cư dân', 'Cư dân có thể nhận hỗ trợ tài chính từ tháng tới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Cập nhật thông tin liên lạc', 'Thông tin liên lạc của quản lý tòa nhà đã được cập nhật', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Thông báo về bảo trì hệ thống điện', 'Bảo trì hệ thống điện sẽ được thực hiện vào tuần tới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Mời tham gia khảo sát', 'Mời cư dân tham gia khảo sát ý kiến về dịch vụ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Chương trình từ thiện', 'Chương trình từ thiện sẽ diễn ra vào cuối tuần', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Thông báo sự cố nước', 'Có sự cố nước tại tầng 2, vui lòng tránh khu vực đó', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Thông báo cập nhật chính sách', 'Chính sách của tòa nhà đã được cập nhật, vui lòng xem xét', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
    )

    await client.query('COMMIT')
    console.log('Insert notifications successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert notifications', error)
  } finally {
    client.release()
  }
}

async function insertResidentNotifications() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "ResidentNotifications" ("createdAt", "updatedAt", "notificationId", "residentId") VALUES
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 8),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 10),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 8),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 10),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 8),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 10),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 8),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 10),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 8),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 10),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 8),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 10),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 8),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 10),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 8),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 10),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 8),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 10),

      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 8),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 10);`
    )

    await client.query('COMMIT')
    console.log('Insert notification residents successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert notification residents', error)
  } finally {
    client.release()
  }
}
// async function insertNotificationResidents() {
//   const client = await pool.connect()
//   try {
//     await client.query('BEGIN')
//     await client.query(
//       `INSERT INTO "NotificationResident" ("createdAt", "updatedAt", "notificationId", "residentId") VALUES
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 8);`
//     )

//     await client.query('COMMIT')
//     console.log('Insert notification residents successfully')
//   } catch (error) {
//     await client.query('ROLLBACK')
//     console.error('Error insert notification residents', error)
//   } finally {
//     client.release()
//   }
// }

async function insertFacilities() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Facilities" ("facilityName", "facilityDescription", "facilityLocation", "createdAt", "updatedAt") VALUES
      ('Phòng Gym', 'Trung tâm thể hình đầy đủ thiết bị', 'Tầng Trệt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Bể Bơi', 'Bể bơi tiêu chuẩn Olympic', 'Trên Mái', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Sân Chơi', 'Khu vực vui chơi cho trẻ em', 'Sân Sau', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Phòng Giặt', 'Máy giặt và sấy tự động', 'Hầm', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Bãi Đỗ Xe', 'Bãi đỗ xe an toàn cho cư dân', 'Dưới Đất', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
    )

    await client.query('COMMIT')
    console.log('Insert facilities successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert facilities', error)
  } finally {
    client.release()
  }
}

async function insertBuildingFacilities() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "BuildingFacilities" ("buildingId", "facilityId", "createdAt", "updatedAt") VALUES
      (1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `
    )

    await client.query('COMMIT')
    console.log('Insert building facilities successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert building facilities', error)
  } finally {
    client.release()
  }
}

async function insertEvents() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Events" ("eventName", "eventDescription", "eventLocation", "eventDate", "createdAt", "updatedAt", "buildingId") VALUES
      ('Tiệc BBQ Mùa Hè', 'Tiệc BBQ cộng đồng hàng năm', 'Sân sau', '2024-07-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Tiệc Cuối Năm', 'Lễ kỷ niệm cuối năm', 'Hội trường cộng đồng', '2024-12-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Workshop Thể Dục', 'Học các bài tập thể dục mới', 'Phòng tập', '2024-10-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Đêm Chiếu Phim', 'Chiếu phim ngoài trời', 'Mái nhà', '2024-08-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Chợ Đồ Cũ', 'Chợ đồ cũ cộng đồng', 'Bãi đỗ xe', '2024-06-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Lớp Yoga', 'Buổi tập yoga hàng tuần', 'Hội trường cộng đồng', '2024-09-07', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Ngày Trẻ Em', 'Hoạt động vui chơi cho trẻ em', 'Sân chơi', '2024-07-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Cuộc Họp Câu Lạc Bộ Sách', 'Thảo luận sách hàng tháng', 'Thư viện', '2024-11-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),

      ('Tiệc BBQ Mùa Hè', 'Tiệc BBQ cộng đồng hàng năm', 'Sân sau', '2024-07-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Tiệc Cuối Năm', 'Lễ kỷ niệm cuối năm', 'Hội trường cộng đồng', '2024-12-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Workshop Thể Dục', 'Học các bài tập thể dục mới', 'Phòng tập', '2024-10-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Đêm Chiếu Phim', 'Chiếu phim ngoài trời', 'Mái nhà', '2024-08-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Chợ Đồ Cũ', 'Chợ đồ cũ cộng đồng', 'Bãi đỗ xe', '2024-06-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Lớp Yoga', 'Buổi tập yoga hàng tuần', 'Hội trường cộng đồng', '2024-09-07', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Ngày Trẻ Em', 'Hoạt động vui chơi cho trẻ em', 'Sân chơi', '2024-07-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Cuộc Họp Câu Lạc Bộ Sách', 'Thảo luận sách hàng tháng', 'Thư viện', '2024-11-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),

      ('Tiệc BBQ Mùa Hè', 'Tiệc BBQ cộng đồng hàng năm', 'Sân sau', '2024-07-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Tiệc Cuối Năm', 'Lễ kỷ niệm cuối năm', 'Hội trường cộng đồng', '2024-12-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Workshop Thể Dục', 'Học các bài tập thể dục mới', 'Phòng tập', '2024-10-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Đêm Chiếu Phim', 'Chiếu phim ngoài trời', 'Mái nhà', '2024-08-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Chợ Đồ Cũ', 'Chợ đồ cũ cộng đồng', 'Bãi đỗ xe', '2024-06-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Lớp Yoga', 'Buổi tập yoga hàng tuần', 'Hội trường cộng đồng', '2024-09-07', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Ngày Trẻ Em', 'Hoạt động vui chơi cho trẻ em', 'Sân chơi', '2024-07-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Cuộc Họp Câu Lạc Bộ Sách', 'Thảo luận sách hàng tháng', 'Thư viện', '2024-11-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),

      ('Tiệc BBQ Mùa Hè', 'Tiệc BBQ cộng đồng hàng năm', 'Sân sau', '2024-07-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Tiệc Cuối Năm', 'Lễ kỷ niệm cuối năm', 'Hội trường cộng đồng', '2024-12-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Workshop Thể Dục', 'Học các bài tập thể dục mới', 'Phòng tập', '2024-10-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Đêm Chiếu Phim', 'Chiếu phim ngoài trời', 'Mái nhà', '2024-08-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Chợ Đồ Cũ', 'Chợ đồ cũ cộng đồng', 'Bãi đỗ xe', '2024-06-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Lớp Yoga', 'Buổi tập yoga hàng tuần', 'Hội trường cộng đồng', '2024-09-07', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Ngày Trẻ Em', 'Hoạt động vui chơi cho trẻ em', 'Sân chơi', '2024-07-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Cuộc Họp Câu Lạc Bộ Sách', 'Thảo luận sách hàng tháng', 'Thư viện', '2024-11-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),

      ('Tiệc BBQ Mùa Hè', 'Tiệc BBQ cộng đồng hàng năm', 'Sân sau', '2024-07-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Tiệc Cuối Năm', 'Lễ kỷ niệm cuối năm', 'Hội trường cộng đồng', '2024-12-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Workshop Thể Dục', 'Học các bài tập thể dục mới', 'Phòng tập', '2024-10-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Đêm Chiếu Phim', 'Chiếu phim ngoài trời', 'Mái nhà', '2024-08-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Chợ Đồ Cũ', 'Chợ đồ cũ cộng đồng', 'Bãi đỗ xe', '2024-06-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Lớp Yoga', 'Buổi tập yoga hàng tuần', 'Hội trường cộng đồng', '2024-09-07', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Ngày Trẻ Em', 'Hoạt động vui chơi cho trẻ em', 'Sân chơi', '2024-07-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Cuộc Họp Câu Lạc Bộ Sách', 'Thảo luận sách hàng tháng', 'Thư viện', '2024-11-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5)
      `
    )

    await client.query('COMMIT')
    console.log('Insert events successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert events', error)
  } finally {
    client.release()
  }
}

async function insertService() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Services" ("serviceName", "servicePrice", "createdAt", "updatedAt") VALUES
      ('Sửa TV', 100.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Sửa điều hòa', 150.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Sửa máy giặt', 120.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Sửa quạt', 80.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Giặt là', 15.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Dọn dẹp', 50.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
    )

    await client.query('COMMIT')
    console.log('Insert services successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert services', error)
  } finally {
    client.release()
  }
}

async function insertBuildingServices() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "BuildingServices" ("buildingId", "serviceId", "createdAt", "updatedAt") VALUES
      (1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
    )

    await client.query('COMMIT')
    console.log('Insert building services successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert building services', error)
  } finally {
    client.release()
  }
}

async function insertPayments() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Bills" ("residentId", "createdAt", "updatedAt")
        VALUES
        (1, NOW(), NOW()),
        (2, NOW(), NOW()),
        (3, NOW(), NOW()),
        (4, NOW(), NOW()),
        (5, NOW(), NOW()),
        (6, NOW(), NOW()),
        (7, NOW(), NOW()),
        (8, NOW(), NOW()),
        (9, NOW(), NOW()),
        (10, NOW(), NOW());`
    )

    await client.query('COMMIT')
    console.log('Insert payments successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error inserting payments', error)
  } finally {
    client.release()
  }
}

async function insertServiceBookings() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "ServiceBookings" ("serviceId", "residentId", "bookingDate", "bookingStatus", "createdAt", "updatedAt")
      VALUES
      (1, 1, NOW(), 'Pending', NOW(), NOW()),
      (2, 1, NOW(), 'Pending', NOW(), NOW()),
      (3, 1, NOW(), 'Pending', NOW(), NOW()),
      (4, 1, NOW(), 'Pending', NOW(), NOW()),
      (5, 1, NOW(), 'Pending', NOW(), NOW()),
      (6, 1, NOW(), 'Pending', NOW(), NOW()),

      (1, 2, NOW(), 'Pending', NOW(), NOW()),
      (2, 2, NOW(), 'Pending', NOW(), NOW()),
      (3, 2, NOW(), 'Pending', NOW(), NOW()),
      (4, 2, NOW(), 'Pending', NOW(), NOW()),
      (5, 2, NOW(), 'Pending', NOW(), NOW()),
      (6, 2, NOW(), 'Pending', NOW(), NOW()),

      (1, 10, NOW(), 'Pending', NOW(), NOW()),
      (2, 10, NOW(), 'Pending', NOW(), NOW()),
      (3, 10, NOW(), 'Pending', NOW(), NOW()),
      (4, 10, NOW(), 'Pending', NOW(), NOW()),
      (5, 10, NOW(), 'Pending', NOW(), NOW()),
      (6, 10, NOW(), 'Pending', NOW(), NOW());`
    )

    await client.query('COMMIT')
    console.log('Insert service bookings successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert service bookings', error)
  } finally {
    client.release()
  }
}

async function insertBills() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Bills" ("residentId", "createdAt", "updatedAt")
      VALUES
      (1, NOW(), NOW()),
      (2, NOW(), NOW()),
      (3, NOW(), NOW()),
      (4, NOW(), NOW()),
      (5, NOW(), NOW()),
      (6, NOW(), NOW()),
      (7, NOW(), NOW()),
      (8, NOW(), NOW()),
      (9, NOW(), NOW()),
      (10, NOW(), NOW());
      `
    )

    await client.query('COMMIT')
    console.log('Insert bills successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert bills', error)
  } finally {
    client.release()
  }
}

async function insertData() {
  await insertRoles()
  await insertUsers()
  await insertBuildings()
  await insertFloors()
  await insertApartments()
  await insertAdmins()
  await insertResidents()
  await insertResidentApartments()
  await insertComplaints()
  await insertVehicles()
  await insertNotifications()
  await insertFacilities()
  await insertEvents()
  await insertService()
  await insertPayments()
  await insertBuildingServices()
  await insertBuildingFacilities()
  await insertResidentNotifications()
  await insertServiceBookings()
  await insertBills()
}

insertData()
