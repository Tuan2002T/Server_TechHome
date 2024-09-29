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
      ['John Doe', 'johnd', 'pass1', 'john@example.com', 1],
      ['Jane Smith', 'janes', 'pass2', 'jane@example.com', 2],
      ['Mike Johnson', 'mikej', 'pass3', 'mike@example.com', 2],
      ['Emily Brown', 'emilyb', 'pass4', 'emily@example.com', 2],
      ['David Lee', 'davidl', 'pass5', 'david@example.com', 2],
      ['Sarah Wilson', 'sarahw', 'pass6', 'sarah@example.com', 2],
      ['Chris Taylor', 'christ', 'pass7', 'chris@example.com', 2],
      ['Lisa Anderson', 'lisaa', 'pass8', 'lisa@example.com', 1],
      ['Robert Clark', 'robertc', 'pass9', 'robert@example.com', 2],
      ['Amanda White', 'amandaw', 'pass10', 'amanda@example.com', 2]
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
      ('Sunset Towers', '123 Main St', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Ocean View Apartments', '456 Beach Rd', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Mountain Heights', '789 Hill Ave', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('City Center Residences', '101 Downtown Blvd', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Parkside Condos', '202 Green Park Ln', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Riverside Apartments', '303 River Rd', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Skyline Plaza', '404 High St', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Lakeview Terrace', '505 Lake Dr', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Garden Court', '606 Flower St', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Sunnyvale Apartments', '707 Sunny Ave', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
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
      (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4);`
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
      ('201', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('202', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('301', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('101A', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('101B', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('201A', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('201B', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('101C', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6);`
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
      ('8901234567', 'ID008', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);`
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
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 8);`
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
      ('Noisy neighbors', '2024-09-28', 'Open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Leaky faucet', '2024-09-27', 'In Progress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Broken elevator', '2024-09-26', 'Closed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Poor lighting in hallway', '2024-09-25', 'Open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Parking issues', '2024-09-24', 'In Progress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Trash not collected', '2024-09-23', 'Closed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('AC not working', '2024-09-22', 'Open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Pest problem', '2024-09-21', 'In Progress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);`
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
      ('ABC123', 'Car', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('DEF456', 'Motorcycle', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('GHI789', 'Car', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('JKL012', 'Bicycle', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('MNO345', 'Car', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('PQR678', 'Motorcycle', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('STU901', 'Car', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('VWX234', 'Bicycle', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);`
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
      `INSERT INTO "Notifications" ("notificationTitle", "notificationBody", "createdAt", "updatedAt", "residentId") VALUES
      ('Maintenance Notice', 'Water shut-off scheduled for tomorrow', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Rent Reminder', 'Rent due in 3 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Community Event', 'BBQ this weekend', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Parking Update', 'New parking regulations', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Security Alert', 'Recent break-ins reported', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Amenity Closure', 'Pool closed for cleaning', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Package Arrival', 'You have a package at the front desk', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Noise Complaint', 'Please keep noise levels down after 10 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);`
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

async function insertNotificationResidents() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "NotificationResident" ("createdAt", "updatedAt", "notificationId", "residentId") VALUES
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 3),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 4),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 5),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 6),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 7),
      (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 8);`
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

async function insertFacilities() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Facilities" ("facilityName", "facilityDescription", "facilityLocation", "createdAt", "updatedAt", "buildingId") VALUES
      ('Gym', 'Fully equipped fitness center', 'Ground Floor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Swimming Pool', 'Olympic-sized pool', 'Rooftop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Playground', 'Children''s play area', 'Backyard', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Laundry Room', 'Coin-operated washers and dryers', 'Basement', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Parking Garage', 'Secure parking for residents', 'Underground', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Community Hall', 'For events and gatherings', '1st Floor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Tennis Court', 'Professional tennis court', 'Outdoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Sauna', 'Relaxation area', '2nd Floor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);`
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

async function insertEvents() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Events" ("eventName", "eventDescription", "eventLocation", "eventDate", "createdAt", "updatedAt", "buildingId") VALUES
      ('Summer BBQ', 'Annual community barbecue', 'Backyard', '2024-07-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      ('Holiday Party', 'End-of-year celebration', 'Community Hall', '2024-12-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      ('Fitness Workshop', 'Learn new workout routines', 'Gym', '2024-10-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      ('Movie Night', 'Outdoor movie screening', 'Rooftop', '2024-08-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      ('Garage Sale', 'Community-wide garage sale', 'Parking Lot', '2024-06-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      ('Yoga Class', 'Weekly yoga session', 'Community Hall', '2024-09-07', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      ('Kids'' Day', 'Fun activities for children', 'Playground', '2024-07-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      ('Book Club Meeting', 'Monthly book discussion', 'Library', '2024-11-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);`
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
      `INSERT INTO "Services" ("serviceName", "servicePrice", "createdAt", "updatedAt", "buildingId", "paymentId") VALUES
      ('Cleaning', 50.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, NULL),
      ('Maintenance', 75.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, NULL),
      ('Pet Walking', 25.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, NULL),
      ('Car Wash', 30.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, NULL),
      ('Laundry', 15.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, NULL),
      ('Grocery Delivery', 20.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, NULL),
      ('Pest Control', 60.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, NULL),
      ('Landscaping', 100.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, NULL);`
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

async function insertPayments() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO "Payments" ("paymentAmount", "paymentDate", "paymentStatus", "createdAt", "updatedAt", "residentId") VALUES
      (100, '2024-09-30', 'Paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
      (200, '2024-09-29', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
      (300, '2024-09-28', 'Paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
      (400, '2024-09-27', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
      (500, '2024-09-26', 'Paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
      (600, '2024-09-25', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
      (700, '2024-09-24', 'Paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
      (800, '2024-09-23', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);`
    )

    await client.query('COMMIT')
    console.log('Insert payments successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error insert payments', error)
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
  await insertNotificationResidents()
  await insertFacilities()
  await insertEvents()
  await insertService()
  await insertPayments()
}

insertData()
