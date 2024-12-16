const { Client, Pool } = require('pg')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const { residentId } = require('../src/Model/ResidentModel')
dotenv.config()
const isDocker = process.env.USE_DOCKER === 'true'
const pool = new Pool({
  user: process.env.USERNAMEPG,
  host: isDocker ? process.env.HOST_DOCKER : process.env.HOST,
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
      ('Tòa nhà A - Khu Cụm Tòa Nhà', 'Khu Phố ABC, Đường 123, TP.HCM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Tòa nhà B - Khu Cụm Tòa Nhà', 'Khu Phố ABC, Đường 123, TP.HCM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `
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


      (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2);
`
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
      ('104', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('105', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
    
      ('201', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('202', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('203', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('204', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('205', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
    
      ('301', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('302', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('303', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('304', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('305', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
    
      ('401', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('402', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('403', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('404', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('405', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
    
      ('501', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('502', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('503', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('504', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('505', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
    
      ('601', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('602', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('603', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('604', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('605', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
    
      ('701', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('702', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('703', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('704', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('705', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
    
      ('801', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('802', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('803', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('804', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('805', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
    
      ('901', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('902', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('903', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('904', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('905', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
    
      ('1001', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('1002', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('1003', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('1004', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('1005', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10);`
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
      ('0912345678', '123456789012', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('0912345679', '123456789013', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('0912345680', '123456789014', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('0912345681', '123456789015', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('0912345682', '123456789016', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('0912345683', '123456789017', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('0912345684', '123456789018', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('0912345685', '123456789019', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('0912345686', '123456789020', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('0912345687', '123456789021', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('0912345688', '123456789022', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('0912345689', '123456789023', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('0912345690', '123456789024', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('0912345691', '123456789025', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('0912345692', '123456789026', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('0912345693', '123456789027', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('0912345694', '123456789028', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11),
      ('0912345695', '123456789029', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12),
      ('0912345696', '123456789030', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13),
      ('0912345697', '123456789031', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14),
      ('0912345698', '123456789032', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15),
      ('0912345699', '123456789033', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16),
      ('0912345700', '123456789034', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17),
      ('0912345701', '123456789035', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18),
      ('0912345702', '123456789036', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19),
      ('0912345703', '123456789037', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20),
      ('0912345704', '123456789038', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21),
      ('0912345705', '123456789039', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22),
      ('0912345706', '123456789040', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23),
      ('0912345707', '123456789041', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24),
      ('0912345708', '123456789042', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25),
      ('0912345709', '123456789043', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 26),
      ('0912345710', '123456789044', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 27),
      ('0912345711', '123456789045', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 28),
      ('0912345712', '123456789046', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 29),
      ('0912345713', '123456789047', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 30),
      ('0912345714', '123456789048', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 31),
      ('0912345715', '123456789049', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 32),
      ('0912345716', '123456789050', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 33),
      ('0912345717', '123456789051', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 34),
      ('0912345718', '123456789052', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 35),
      ('0912345719', '123456789053', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 36),
      ('0912345720', '123456789054', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 37),
      ('0912345721', '123456789055', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 38),
      ('0912345722', '123456789056', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 39),
      ('0912345723', '123456789057', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 40),
      ('0912345724', '123456789058', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 41),
      ('0912345725', '123456789059', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 42),
      ('0912345726', '123456789060', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 43),
      ('0912345727', '123456789061', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 44),
      ('0912345728', '123456789062', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 45),
      ('0912345729', '123456789063', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 46),
      ('0912345730', '123456789064', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 47),
      ('0912345731', '123456789065', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 48),
      ('0912345732', '123456789066', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 49),
      ('0912345733', '123456789067', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 50),
      ('0912345734', '123456789068', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 51),
      ('0912345735', '123456789069', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 52),
      ('0912345736', '123456789070', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 53),
      ('0912345737', '123456789071', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 54),
      ('0912345738', '123456789072', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 55),
      ('0912345739', '123456789073', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 56),
      ('0912345740', '123456789074', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 57),
      ('0912345741', '123456789075', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 58),
      ('0912345742', '123456789076', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 59),
      ('0912345743', '123456789077', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 60),
      ('0912345744', '123456789078', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 61),
      ('0912345745', '123456789079', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 62),
      ('0912345746', '123456789080', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 63),
      ('0912345747', '123456789081', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 64),
      ('0912345748', '123456789082', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 65),
      ('0912345749', '123456789083', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 66),
      ('0912345750', '123456789084', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 67),
      ('0912345751', '123456789085', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 68),
      ('0912345752', '123456789086', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 69),
      ('0912345753', '123456789087', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 70),
      ('0912345754', '123456789088', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 71),
      ('0912345755', '123456789089', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 72),
      ('0912345756', '123456789090', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 73),
      ('0912345757', '123456789091', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 74),
      ('0912345758', '123456789092', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 75),
      ('0912345759', '123456789093', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 76),
      ('0912345760', '123456789094', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 77),
      ('0912345761', '123456789095', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 78),
      ('0912345762', '123456789096', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 79),
      ('0912345763', '123456789097', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80),
      ('0912345764', '123456789098', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 81),
      ('0912345765', '123456789099', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 82),
      ('0912345766', '123456789100', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 83),
      ('0912345767', '123456789101', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 84),
      ('0912345768', '123456789102', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 85),
      ('0912345769', '123456789103', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 86),
      ('0912345770', '123456789104', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 87),
      ('0912345771', '123456789105', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 88),
      ('0912345772', '123456789106', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 89),
      ('0912345773', '123456789107', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 90),
      ('0912345774', '123456789108', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 91),
      ('0912345775', '123456789109', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 92),
      ('0912345776', '123456789110', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 93),
      ('0912345777', '123456789111', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 94),
      ('0912345778', '123456789112', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 95),
      ('0912345779', '123456789113', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 96),
      ('0912345780', '123456789114', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 97),
      ('0912345781', '123456789115', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 98),
      ('0912345782', '123456789116', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 99),
      ('0912345783', '123456789117', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 100);`
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
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 4),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 6),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 8),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 9),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 10),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 11),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 12),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 13),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 14),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 15),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 16),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 17),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 18),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 19),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 20),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11, 21),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11, 22),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12, 23),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12, 24),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13, 25),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13, 26),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14, 27),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14, 28),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15, 29),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15, 30),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16, 31),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16, 32),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17, 33),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17, 34),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18, 35),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18, 36),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19, 37),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19, 38),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20, 39),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20, 40),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21, 41),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21, 42),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22, 43),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22, 44),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23, 45),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23, 46),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24, 47),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24, 48),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25, 49),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25, 50),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 26, 51),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 26, 52),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 27, 53),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 27, 54),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 28, 55),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 28, 56),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 29, 57),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 29, 58),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 30, 59),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 30, 60),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 31, 61),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 31, 62),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 32, 63),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 32, 64),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 33, 65),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 33, 66),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 34, 67),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 34, 68),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 35, 69),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 35, 70),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 36, 71),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 36, 72),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 37, 73),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 37, 74),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 38, 75),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 38, 76),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 39, 77),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 39, 78),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 40, 79),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 40, 80),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 41, 81),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 41, 82),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 42, 83),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 42, 84),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 43, 85),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 43, 86),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 44, 87),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 44, 88),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 45, 89),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 45, 90),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 46, 91),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 46, 92),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 47, 93),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 47, 94),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 48, 95),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 48, 96),
    
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 49, 97),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 49, 98);`
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
      `INSERT INTO "Complaints" ("complaintTitle", "complaintDescription", "complaintDate", "complaintStatus", "createdAt", "updatedAt", "residentId") VALUES
      ('Tiếng ồn vào ban đêm', 'Có tiếng ồn liên tục phát ra từ căn hộ trên tầng tôi vào giờ khuya, điều này đã gây cản trở nghiêm trọng đến giấc ngủ của tôi.', '2024-09-28', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Rò rỉ vòi nước', 'Vòi nước trong bếp của tôi đã bị rò rỉ trong vài ngày qua, khiến nước tích tụ trên mặt bàn và tạo ra sự lộn xộn.', '2024-09-27', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Cửa sổ hỏng', 'Tôi đã gửi yêu cầu sửa chữa cửa sổ bị hỏng nhưng chưa thấy ai đến kiểm tra.', '2024-09-26', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Máy điều hòa không hoạt động', 'Máy điều hòa không khí trong căn hộ của tôi không hoạt động đúng cách, khiến tôi không thể làm mát không gian sống của mình.', '2024-09-25', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Tiếng ồn không tuân thủ quy định', 'Có một số cư dân không tuân thủ quy tắc im lặng vào ban đêm, gây khó chịu cho những người khác.', '2024-09-24', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Máy giặt chung bị hỏng', 'Máy giặt chung trong khu vực giặt ủi thường xuyên bị hỏng, và tôi phải chờ đợi rất lâu để có thể giặt quần áo của mình.', '2024-09-28', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Côn trùng trong căn hộ', 'Tôi thấy có nhiều côn trùng trong căn hộ của mình, rất khó chịu và không an toàn.', '2024-09-27', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Hệ thống báo cháy không hoạt động', 'Hệ thống báo cháy không hoạt động, tôi rất lo ngại về sự an toàn của cư dân.', '2024-09-26', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Rác thải bừa bãi', 'Có người để rác bừa bãi ở hành lang, gây mất vệ sinh cho khu vực sống.', '2024-09-25', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Cửa ra vào chung bị hỏng', 'Cửa ra vào chung bị hỏng, điều này khiến tôi cảm thấy không an toàn khi ở nhà.', '2024-09-24', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Hệ thống nước nóng không hoạt động', 'Hệ thống nước nóng không hoạt động, tôi không thể tắm vào những ngày lạnh.', '2024-09-28', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Không đeo khẩu trang trong thang máy', 'Tôi thấy có nhiều người không đeo khẩu trang khi sử dụng thang máy, không đảm bảo an toàn sức khỏe.', '2024-09-27', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Tụ tập gây mất trật tự', 'Có một số người thường xuyên tụ tập trong khu vực chung, gây mất trật tự.', '2024-09-26', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Hệ thống điện chập chờn', 'Hệ thống điện trong căn hộ có dấu hiệu chập chờn, cần được kiểm tra.', '2024-09-25', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Thiếu chỗ đậu xe', 'Không có đủ chỗ đậu xe cho cư dân, tôi thường phải đậu xa.', '2024-09-24', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Hệ thống camera an ninh không hoạt động', 'Hệ thống camera an ninh không hoạt động, tôi cảm thấy không an toàn.', '2024-09-28', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Tiếng ồn từ sự kiện trong khu vực', 'Có nhiều tiếng ồn phát ra từ các sự kiện trong khu vực, ảnh hưởng đến cuộc sống của tôi.', '2024-09-27', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Phòng gym thiếu thiết bị', 'Phòng tập thể dục không đủ trang thiết bị, tôi không thể tập luyện đúng cách.', '2024-09-26', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Internet quá chậm', 'Tôi không thể sử dụng internet vì tốc độ quá chậm.', '2024-09-25', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Mất đồ dùng cá nhân', 'Có nhiều đồ dùng cá nhân bị mất trong khu vực chung.', '2024-09-24', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Cây cối trong khuôn viên không được cắt tỉa', 'Cây cối trong khuôn viên không được cắt tỉa, gây mất thẩm mỹ.', '2024-09-28', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Không dọn dẹp sau BBQ', 'Có nhiều người không dọn dẹp sau khi sử dụng khu vực BBQ.', '2024-09-27', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Máy lạnh trong phòng sinh hoạt chung hỏng', 'Máy lạnh trong phòng sinh hoạt chung không hoạt động, khiến nơi này trở nên ngột ngạt.', '2024-09-26', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Không tuân thủ quy định im lặng', 'Nhiều cư dân không tuân thủ quy định về thời gian im lặng.', '2024-09-25', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Thông báo sự kiện không rõ ràng', 'Cần có bảng thông báo rõ ràng hơn về các sự kiện trong tòa nhà.', '2024-09-24', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Tiếng động lớn từ hệ thống điều hòa chung', 'Có tiếng động lớn phát ra từ hệ thống điều hòa chung.', '2024-09-28', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Hệ thống an ninh không đủ mạnh', 'Hệ thống an ninh không đủ mạnh, khiến tôi cảm thấy không an toàn.', '2024-09-27', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Thiếu thùng rác', 'Chúng tôi cần thêm thùng rác ở các khu vực chung.', '2024-09-26', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Không đeo khẩu trang khi dùng thang máy', 'Tôi cảm thấy không thoải mái khi sử dụng thang máy vì có nhiều người không đeo khẩu trang.', '2024-09-25', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Không giữ gìn vệ sinh chung', 'Có rất nhiều người không tuân thủ quy tắc về việc giữ gìn vệ sinh chung.', '2024-09-24', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Hệ thống sưởi không hoạt động', 'Hệ thống sưởi trong phòng không hoạt động, khiến tôi rất lạnh.', '2024-09-28', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Nhân viên bảo trì không đến sửa chữa', 'Nhiều lần tôi không thấy nhân viên bảo trì đến sửa chữa khi cần.', '2024-09-27', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Cửa ra vào bị kẹt', 'Cửa ra vào bị kẹt, tôi gặp khó khăn khi ra vào.', '2024-09-26', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Côn trùng trong nhà', 'Có nhiều côn trùng xuất hiện trong nhà, tôi rất lo lắng.', '2024-09-25', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Ánh sáng hành lang quá tối', 'Hệ thống ánh sáng trong hành lang quá tối, không an toàn.', '2024-09-24', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Mùi hôi thối từ khu vực rác', 'Có mùi hôi thối phát ra từ khu vực rác.', '2024-09-28', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('Không đủ ghế ở bể bơi', 'Tôi không thể sử dụng bể bơi vì có quá nhiều người và không đủ ghế.', '2024-09-27', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('Máy giặt hỏng', 'Máy giặt không hoạt động, khiến tôi phải chờ đợi rất lâu để giặt đồ.', '2024-09-26', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('Thiếu biện pháp phòng cháy chữa cháy', 'Cần có các biện pháp phòng cháy chữa cháy nghiêm ngặt hơn.', '2024-09-25', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('Thiếu thông tin quy tắc sử dụng khu vực chung', 'Tôi không thể tìm thấy thông tin về quy tắc sử dụng khu vực chung.', '2024-09-24', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
      ('Mùi hôi từ hệ thống thoát nước', 'Có mùi hôi thối từ hệ thống thoát nước.', '2024-09-28', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('Không dọn dẹp sau khu vực thể dục', 'Nhiều cư dân không dọn dẹp sau khi sử dụng khu vực thể dục.', '2024-09-27', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('Tiếng ồn từ các sự kiện trong khu vực chung', 'Có quá nhiều tiếng ồn từ các sự kiện được tổ chức trong khu vực chung.', '2024-09-26', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('Hệ thống điện không ổn định', 'Hệ thống điện không ổn định, tôi rất lo lắng về an toàn.', '2024-09-25', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('Không tuân thủ quy định thang máy', 'Nhiều cư dân không tuân thủ các quy định an toàn khi sử dụng thang máy.', '2024-09-24', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
      ('Camera an ninh không đủ độ bao phủ', 'Hệ thống camera an ninh không đủ độ bao phủ cho khu vực chung.', '2024-09-28', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('Mất đồ dùng cá nhân trong khu vực chung', 'Có nhiều trường hợp mất mát đồ dùng cá nhân trong khu vực chung.', '2024-09-27', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('Hệ thống nước nóng không hoạt động', 'Hệ thống nước nóng không hoạt động, tôi không thể tắm.', '2024-09-26', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('Quy định sử dụng thang máy chưa rõ ràng', 'Cần có các quy định chặt chẽ hơn về việc sử dụng thang máy.', '2024-09-25', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
      ('Tiếng ồn từ căn hộ bên cạnh', 'Có tiếng ồn lớn phát ra từ căn hộ bên cạnh vào ban đêm.', '2024-09-24', 'Rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10);`
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
      `INSERT INTO "Vehicles" ("vehicleNumber", "vehicleType", "createdAt", "updatedAt", "residentId")
        VALUES
        ('29A-00123', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
        ('29A-00124', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
        ('29A-00125', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
        ('29A-00126', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
        ('29A-00127', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
        ('29A-00128', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
        ('29A-00129', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
        ('29A-00130', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
        ('29A-00131', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
        ('29A-00132', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
        ('29A-00133', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11),
        ('29A-00134', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12),
        ('29A-00135', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13),
        ('29A-00136', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14),
        ('29A-00137', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15),
        ('29A-00138', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16),
        ('29A-00139', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17),
        ('29A-00140', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18),
        ('29A-00141', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19),
        ('29A-00142', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20),

        ('29D1-10001', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21),
        ('29D1-10002', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22),
        ('29D1-10003', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23),
        ('29D1-10004', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24),
        ('29D1-10005', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25),
        ('29D1-10006', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 26),
        ('29D1-10007', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 27),
        ('29D1-10008', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 28),
        ('29D1-10009', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 29),
        ('29D1-10010', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 30),
        ('29D1-10011', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 31),
        ('29D1-10012', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 32),
        ('29D1-10013', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 33),
        ('29D1-10014', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 34),
        ('29D1-10015', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 35),
        ('29D1-10016', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 36),
        ('29D1-10017', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 37),
        ('29D1-10018', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 38),
        ('29D1-10019', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 39),
        ('29D1-10020', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 40),

        -- Xe đạp
        ('29B1-00101', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 41),
        ('29B1-00102', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 42),
        ('29B1-00103', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 43),
        ('29B1-00104', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 44),
        ('29B1-00105', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 45),
        ('29B1-00106', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 46),
        ('29B1-00107', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 47),
        ('29B1-00108', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 48),
        ('29B1-00109', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 49),
        ('29B1-00110', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 50),
        ('29B1-00111', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 51),
        ('29B1-00112', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 52),
        ('29B1-00113', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 53),
        ('29B1-00114', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 54),
        ('29B1-00115', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 55),
        ('29B1-00116', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 56),
        ('29B1-00117', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 57),
        ('29B1-00118', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 58),
        ('29B1-00119', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 59),
        ('29B1-00120', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 60),

        -- Xe máy
        ('29D1-10021', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 61),
        ('29D1-10022', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 62),
        ('29D1-10023', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 63),
        ('29D1-10024', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 64),
        ('29D1-10025', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 65),
        ('29D1-10026', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 66),
        ('29D1-10027', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 67),
        ('29D1-10028', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 68),
        ('29D1-10029', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 69),
        ('29D1-10030', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 70),

        -- Ô tô
        ('29A-00143', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 71),
        ('29A-00144', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 72),
        ('29A-00145', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 73),
        ('29A-00146', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 74),
        ('29A-00147', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 75),
        ('29A-00148', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 76),
        ('29A-00149', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 77),
        ('29A-00150', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 78),
        ('29A-00151', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 79),
        ('29A-00152', 'Ô tô', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80),

        -- Xe đạp
        ('29B1-00120', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 81),
        ('29B1-00121', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 82),
        ('29B1-00122', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 83),
        ('29B1-00123', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 84),
        ('29B1-00124', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 85),
        ('29B1-00125', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 86),
        ('29B1-00126', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 87),
        ('29B1-00127', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 88),
        ('29B1-00128', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 89),
        ('29B1-00129', 'Xe đạp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 90),

        -- Xe máy
        ('29D1-10031', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 91),
        ('29D1-10032', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 92),
        ('29D1-10033', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 93),
        ('29D1-10034', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 94),
        ('29D1-10035', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 95),
        ('29D1-10036', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 96),
        ('29D1-10037', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 97),
        ('29D1-10038', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 98),
        ('29D1-10039', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 99),
        ('29D1-10040', 'Xe máy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 100);
        `
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

// async function insertResidentNotifications() {
//   const client = await pool.connect()
//   try {
//     await client.query('BEGIN')
//     await client.query(
//       `INSERT INTO "ResidentNotifications" ("createdAt", "updatedAt", "notificationId", "residentId") VALUES
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 8),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 9),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 10),

//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 8),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 9),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 10),

//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 8),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 9),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 10),

//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 8),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 9),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 10),

//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 8),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 9),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 10),

//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 8),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 9),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 10),

//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 8),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 9),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 10),

//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 8),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 9),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 10),

//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 8),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 9),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 10),

//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 1),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 2),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 3),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 4),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 5),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 6),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 7),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 8),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 9),
//       (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 10);`
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
      ('Bể Bơi', 'Bể bơi đạt chuẩn quốc tế, thiết kế hiện đại', 'Trên Mái', '2024-10-27 22:51:14.599129+07', '2024-10-27 22:51:14.599129+07'),
      ('Phòng Gym', 'Phòng gym đầy đủ thiết bị hiện đại phục vụ cư dân', 'Tầng Trệt', '2024-10-27 22:51:14.599129+07', '2024-10-27 22:51:14.599129+07'),
      ('Khu Vui Chơi', 'Khu vực vui chơi an toàn và hấp dẫn cho trẻ em', 'Sân Sau', '2024-10-27 22:51:14.599129+07', '2024-10-27 22:51:14.599129+07'),
      ('Khu BBQ', 'Khu vực BBQ ngoài trời với không gian rộng rãi, thoáng mát', 'Sân Trước', '2024-10-27 22:51:14.599129+07', '2024-10-27 22:51:14.599129+07'),
      ('Sân Tennis', 'Sân tennis chất lượng cao, phục vụ nhu cầu thể thao cho cư dân', 'Sân Sau', '2024-10-27 22:51:14.599129+07', '2024-10-27 22:51:14.599129+07'),
      ('Sân Cầu Lông', 'Sân cầu lông đạt chuẩn, thoải mái cho mọi lứa tuổi', 'Sân Sau', '2024-10-27 22:51:14.599129+07', '2024-10-27 22:51:14.599129+07'),
      ('Sân Bóng Rổ', 'Sân bóng rổ đa năng, phục vụ cho các hoạt động thể thao', 'Sân Sau', '2024-10-27 22:51:14.599129+07', '2024-10-27 22:51:14.599129+07');`
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
      (1, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
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
      ('Cuộc Họp Câu Lạc Bộ Sách', 'Thảo luận sách hàng tháng', 'Thư viện', '2024-11-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2);`
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
      ('Sửa điều hoà', 150.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Sửa máy giặt', 120.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Sửa ống nước', 130.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Giặt là', 15.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Dọn dẹp', 50.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Sửa điện', 80.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
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
      (1, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
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

// async function insertPayments() {
//   const client = await pool.connect()
//   try {
//     await client.query('BEGIN')
//     await client.query(
//       `INSERT INTO "Bills" ("residentId", "createdAt", "updatedAt")
//         VALUES
//         (1, NOW(), NOW()),
//         (2, NOW(), NOW()),
//         (3, NOW(), NOW()),
//         (4, NOW(), NOW()),
//         (5, NOW(), NOW()),
//         (6, NOW(), NOW()),
//         (7, NOW(), NOW()),
//         (8, NOW(), NOW()),
//         (9, NOW(), NOW()),
//         (10, NOW(), NOW());`
//     )

//     await client.query('COMMIT')
//     console.log('Insert payments successfully')
//   } catch (error) {
//     await client.query('ROLLBACK')
//     console.error('Error inserting payments', error)
//   } finally {
//     client.release()
//   }
// }

// async function insertServiceBookings() {
//   const client = await pool.connect()
//   try {
//     await client.query('BEGIN')
//     await client.query(
//       `INSERT INTO "ServiceBookings" ("serviceId", "residentId", "bookingDate", "bookingStatus", "createdAt", "updatedAt")
//       VALUES
//       (1, 1, NOW(), 'Pending', NOW(), NOW()),
//       (2, 1, NOW(), 'Pending', NOW(), NOW()),
//       (3, 1, NOW(), 'Pending', NOW(), NOW()),
//       (4, 1, NOW(), 'Pending', NOW(), NOW()),
//       (5, 1, NOW(), 'Pending', NOW(), NOW()),
//       (6, 1, NOW(), 'Pending', NOW(), NOW()),

//       (1, 2, NOW(), 'Pending', NOW(), NOW()),
//       (2, 2, NOW(), 'Pending', NOW(), NOW()),
//       (3, 2, NOW(), 'Pending', NOW(), NOW()),
//       (4, 2, NOW(), 'Pending', NOW(), NOW()),
//       (5, 2, NOW(), 'Pending', NOW(), NOW()),
//       (6, 2, NOW(), 'Pending', NOW(), NOW()),

//       (1, 10, NOW(), 'Pending', NOW(), NOW()),
//       (2, 10, NOW(), 'Pending', NOW(), NOW()),
//       (3, 10, NOW(), 'Pending', NOW(), NOW()),
//       (4, 10, NOW(), 'Pending', NOW(), NOW()),
//       (5, 10, NOW(), 'Pending', NOW(), NOW()),
//       (6, 10, NOW(), 'Pending', NOW(), NOW());`
//     )

//     await client.query('COMMIT')
//     console.log('Insert service bookings successfully')
//   } catch (error) {
//     await client.query('ROLLBACK')
//     console.error('Error insert service bookings', error)
//   } finally {
//     client.release()
//   }
// }

// async function insertBills() {
//   const client = await pool.connect()
//   try {
//     await client.query('BEGIN')
//     await client.query(
//       `INSERT INTO "Bills" ("residentId", "createdAt", "updatedAt")
//       VALUES
//       (1, NOW(), NOW()),
//       (2, NOW(), NOW()),
//       (3, NOW(), NOW()),
//       (4, NOW(), NOW()),
//       (5, NOW(), NOW()),
//       (6, NOW(), NOW()),
//       (7, NOW(), NOW()),
//       (8, NOW(), NOW()),
//       (9, NOW(), NOW()),
//       (10, NOW(), NOW());
//       `
//     )

//     await client.query('COMMIT')
//     console.log('Insert bills successfully')
//   } catch (error) {
//     await client.query('ROLLBACK')
//     console.error('Error insert bills', error)
//   } finally {
//     client.release()
//   }
// }

async function insertChatBot() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(`
      INSERT INTO "Chats" ("chatName", "adminId", "chatType", "chatDate", "createdAt", "updatedAt") VALUES
      ('Chat cư dân - Tòa A', 1, 'apartment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat cư dân - Tòa B', 1, 'apartment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Trợ lý chung cư', 1, 'bot', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 1', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 2', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 3', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 4', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 5', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 6', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 7', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 8', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 9', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 10', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 11', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 12', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 13', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 14', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 15', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 16', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 17', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 18', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 19', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 20', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 21', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 22', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 23', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 24', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 25', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 26', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 27', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 28', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 29', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 30', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 31', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 32', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 33', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 34', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 35', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 36', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 37', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 38', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 39', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 40', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 41', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 42', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 43', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 44', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 45', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 46', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 47', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 48', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 49', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 50', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 51', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 52', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 53', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 54', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 55', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 56', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 57', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 58', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 59', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 60', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 61', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 62', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 63', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 64', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 65', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 66', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 67', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 68', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 69', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 70', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 71', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 72', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 73', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 74', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 75', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 76', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 77', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 78', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 79', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 80', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 81', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 82', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 83', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 84', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 85', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 86', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 87', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 88', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 89', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 90', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 91', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 92', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 93', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 94', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 95', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 96', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 97', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Chat Admin 98', 1, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `)

    await client.query('COMMIT')
    console.log('Insert chatbot successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert chatbot', error)
  } finally {
    client.release()
  }
}

async function insertChatResidents() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    let values = []
    for (let i = 2; i <= 50; i++) {
      values.push(`(1, ${i}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`)
    }
    await client.query(`
      INSERT INTO "ChatResident" ("chatId", "residentId", "createdAt", "updatedAt") VALUES
      ${values.join(', ')};
    `)

    values = []
    for (let i = 51; i <= 98; i++) {
      values.push(`(2, ${i}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`)
    }
    await client.query(`
      INSERT INTO "ChatResident" ("chatId", "residentId", "createdAt", "updatedAt") VALUES
      ${values.join(', ')};
    `)

    values = []
    for (let i = 1; i <= 98; i++) {
      values.push(`(2, ${i}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`)
    }
    await client.query(`
      INSERT INTO "ChatResident" ("chatId", "residentId", "createdAt", "updatedAt") VALUES
      ${values.join(', ')};
    `)

    values = []
    for (let chatId = 4; chatId <= 102; chatId++) {
      for (let residentId = 1; residentId <= 98; residentId++) {
        values.push(
          `(${chatId}, ${residentId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
        )
      }
    }

    await client.query(`
      INSERT INTO "ChatResident" ("chatId", "residentId", "createdAt", "updatedAt") VALUES
      ${values.join(', ')};
    `)

    await client.query('COMMIT')
    console.log('Inserted ChatResidents successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error inserting ChatResidents', error)
  } finally {
    client.release()
  }
}

async function insertChatResidentsResident() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    let values = []
    for (let i = 2; i <= 50; i++) {
      values.push(`(1, ${i}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`)
    }
    await client.query(`
      INSERT INTO "ChatResident" ("chatId", "residentId", "createdAt", "updatedAt") VALUES
      ${values.join(', ')};
    `)

    await client.query('COMMIT')
    console.log('Inserted ChatResidents resident  successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error inserting ChatResidents', error)
  } finally {
    client.release()
  }
}

async function insertChatResidentsResident2() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    let values = []
    for (let i = 51; i <= 98; i++) {
      values.push(`(1, ${i}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`)
    }
    await client.query(`
      INSERT INTO "ChatResident" ("chatId", "residentId", "createdAt", "updatedAt") VALUES
      ${values.join(', ')};
    `)

    await client.query('COMMIT')
    console.log('Inserted ChatResidents resident  successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error inserting ChatResidents', error)
  } finally {
    client.release()
  }
}

async function insertChatResidentsBot() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    let values = []
    for (let i = 1; i <= 98; i++) {
      values.push(`(3, ${i}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`)
    }
    await client.query(`
      INSERT INTO "ChatResident" ("chatId", "residentId", "createdAt", "updatedAt") VALUES
      ${values.join(', ')};
    `)

    await client.query('COMMIT')
    console.log('Inserted ChatResidents bot  successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error inserting ChatResidents', error)
  } finally {
    client.release()
  }
}

async function insertChatResidentsAdmin() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    let values = []
    let residentId = 1
    for (let chatId = 4; chatId <= 101; chatId++) {
      values.push(
        `(${chatId}, ${residentId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      )
      residentId++
    }

    await client.query(`
      INSERT INTO "ChatResident" ("chatId", "residentId", "createdAt", "updatedAt") VALUES
      ${values.join(', ')};
    `)

    await client.query('COMMIT')
    console.log('Inserted ChatResidents bot  successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error inserting ChatResidents', error)
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
  // // await insertPayments()
  await insertBuildingServices()
  await insertBuildingFacilities()
  // await insertResidentNotifications()
  // // await insertServiceBookings()
  // // await insertBills()
  await insertChatBot()
  await insertChatResidentsResident()
  await insertChatResidentsResident2()
  await insertChatResidentsBot()
  await insertChatResidentsAdmin()
  process.exit()
}

insertData()
