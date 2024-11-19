SELECT * FROM "Roles"
SELECT * FROM "Events"
SELECT * FROM "Services"
SELECT * FROM "Floors"
SELECT * FROM "Apartments"
SELECT * FROM "Residents"
SELECT * FROM "ChatResident"
SELECT * FROM "Chats"
SELECT * FROM "Messages"
SELECT * FROM "Files"
SELECT * FROM "MessageFiles"
SELECT * FROM "Services"
SELECT * FROM "BuildingServices"
INSERT INTO "Roles" ("roleName", "createdAt", "updatedAt") VALUES
('Admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Resident', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Admins" ("createdAt", "updatedAt", "userId", "buildingId") VALUES
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2);

SELECT * FROM "Users"
INSERT INTO "Users" ("fullname", "username", "password", "email", "createdAt", "updatedAt", "roleId") VALUES
('John Doe', 'johnd', 'hashedpass1', 'john@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('Jane Smith', 'janes', 'hashedpass2', 'jane@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Mike Johnson', 'mikej', 'hashedpass3', 'mike@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Emily Brown', 'emilyb', 'hashedpass4', 'emily@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('David Lee', 'davidl', 'hashedpass5', 'david@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Sarah Wilson', 'sarahw', 'hashedpass6', 'sarah@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Chris Taylor', 'christ', 'hashedpass7', 'chris@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Lisa Anderson', 'lisaa', 'hashedpass8', 'lisa@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('Robert Clark', 'robertc', 'hashedpass9', 'robert@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Amanda White', 'amandaw', 'hashedpass10', 'amanda@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2);

SELECT * FROM "Buildings"
INSERT INTO "Buildings" ("buildingName", "buildingAddress", "createdAt", "updatedAt") VALUES
('Sunset Towers', '123 Main St', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ocean View Apartments', '456 Beach Rd', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mountain Heights', '789 Hill Ave', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('City Center Residences', '101 Downtown Blvd', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Parkside Condos', '202 Green Park Ln', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Riverside Apartments', '303 River Rd', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Skyline Plaza', '404 High St', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Lakeview Terrace', '505 Lake Dr', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Garden Court', '606 Flower St', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sunnyvale Apartments', '707 Sunny Ave', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT * FROM "Floors"
INSERT INTO "Floors" ("floorNumber", "createdAt", "updatedAt", "buildingId") VALUES
(1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
(2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
(3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
(1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
(2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
(1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
(2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
(3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
(1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
(2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4);

SELECT * FROM "Apartments"
INSERT INTO "Apartments" ("apartmentNumber", "apartmentType", "createdAt", "updatedAt", "floorId") VALUES
('101', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('102', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('201', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('202', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('301', 'Penthouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('101A', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
('101B', '1BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
('201A', '2BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
('201B', '3BR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
('101C', 'Studio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6);

SELECT * FROM "Residents"
INSERT INTO "Residents" ("phonenumber", "idcard", "active", "createdAt", "updatedAt", "userId") VALUES
('1234567890', 'ID001', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
('2345678901', 'ID002', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10),
('3456789012', 'ID003', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('4567890123', 'ID004', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
('5678901234', 'ID005', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
('6789012345', 'ID006', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
('7890123456', 'ID007', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
('8901234567', 'ID008', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);

INSERT INTO "ResidentApartments" ("createdAt", "updatedAt", "apartmentId", "residentId") VALUES
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 3),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 4),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 5),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 6),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 7),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 8);

INSERT INTO "Complaints" ("complaintDescription", "complaintDate", "complaintStatus", "createdAt", "updatedAt", "residentId") VALUES
('Noisy neighbors', '2024-09-28', 'Open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('Leaky faucet', '2024-09-27', 'In Progress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Broken elevator', '2024-09-26', 'Closed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('Poor lighting in hallway', '2024-09-25', 'Open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
('Parking issues', '2024-09-24', 'In Progress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
('Trash not collected', '2024-09-23', 'Closed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
('AC not working', '2024-09-22', 'Open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
('Pest problem', '2024-09-21', 'In Progress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);


INSERT INTO "Vehicles" ("vehicleNumber", "vehicleType", "createdAt", "updatedAt", "residentId") VALUES
('ABC123', 'Car', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('DEF456', 'Motorcycle', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('GHI789', 'Car', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('JKL012', 'Bicycle', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
('MNO345', 'Car', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
('PQR678', 'Motorcycle', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
('STU901', 'Car', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
('VWX234', 'Bicycle', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);

INSERT INTO "Notifications" ("notificationTitle", "notificationBody", "createdAt", "updatedAt", "residentId") VALUES
('Maintenance Notice', 'Water shut-off scheduled for tomorrow', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('Rent Reminder', 'Rent due in 3 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Community Event', 'BBQ this weekend', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('Parking Update', 'New parking regulations', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
('Security Alert', 'Recent break-ins reported', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
('Amenity Closure', 'Pool closed for cleaning', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
('Package Arrival', 'You have a package at the front desk', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
('Noise Complaint', 'Please keep noise levels down after 10 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);

INSERT INTO "NotificationResident" ("createdAt", "updatedAt", "notificationId", "residentId") VALUES
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 3),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 4),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 5),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 6),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 7),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 8);

INSERT INTO "Facilities" ("facilityName", "facilityDescription", "facilityLocation", "createdAt", "updatedAt", "buildingId") VALUES
('Gym', 'Fully equipped fitness center', 'Ground Floor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('Swimming Pool', 'Olympic-sized pool', 'Rooftop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Playground', 'Children''s play area', 'Backyard', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('Laundry Room', 'Coin-operated washers and dryers', 'Basement', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
('Parking Garage', 'Secure parking for residents', 'Underground', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
('Community Hall', 'For events and gatherings', '1st Floor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
('Tennis Court', 'Professional tennis court', 'Outdoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
('Sauna', 'Relaxation area', '2nd Floor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);

INSERT INTO "Events" ("eventName", "eventDescription", "eventLocation", "eventDate", "createdAt", "updatedAt", "buildingId") VALUES
('Summer BBQ', 'Annual community barbecue', 'Backyard', '2024-07-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('Holiday Party', 'End-of-year celebration', 'Community Hall', '2024-12-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Fitness Workshop', 'Learn new workout routines', 'Gym', '2024-10-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('Movie Night', 'Outdoor movie screening', 'Rooftop', '2024-08-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
('Garage Sale', 'Community-wide garage sale', 'Parking Lot', '2024-06-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
('Yoga Class', 'Weekly yoga session', 'Community Hall', '2024-09-07', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
('Kids'' Day', 'Fun activities for children', 'Playground', '2024-07-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
('Book Club Meeting', 'Monthly book discussion', 'Library', '2024-11-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);

INSERT INTO "Services" ("serviceName", "servicePrice", "createdAt", "updatedAt", "buildingId", "paymentId") VALUES
('Cleaning', 50.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, NULL),
('Maintenance', 75.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, NULL),
('Pet Walking', 25.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, NULL),
('Car Wash', 30.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, NULL),
('Laundry', 15.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, NULL),
('Grocery Delivery', 20.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, NULL),
('Pest Control', 60.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, NULL),
('Landscaping', 100.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, NULL);

INSERT INTO "Payments" ("paymentAmount", "paymentDate", "paymentStatus", "createdAt", "updatedAt", "residentId") VALUES
(1000.00, '2024-09-01', 'Paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
(1200.00, '2024-09-02', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
(950.00, '2024-09-03', 'Paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
(1100.00, '2024-09-04', 'Overdue', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
(1300.00, '2024-09-05', 'Paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
(900.00, '2024-09-06', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
(1150.00, '2024-09-07', 'Paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
(1050.00, '2024-09-08', 'Overdue', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);



SELECT 
  r."id" AS resident_id,
  r."phonenumber",
  r."idcard",
  r."active",
  u."fullname",
  u."username",
  u."email",
  a."apartmentNumber",
  a."apartmentType",
  f."floorNumber",
  b."buildingName",
  b."buildingAddress"
FROM 
  "Residents" r
JOIN 
  "Users" u ON r."userId" = u."userId"
JOIN 
  "ResidentApartments" ra ON ra."residentId" = r."id"
JOIN 
  "Apartments" a ON ra."apartmentId" = a."id"
JOIN 
  "Floors" f ON a."floorId" = f."id"
JOIN 
  "Buildings" b ON f."buildingId" = b."id"
WHERE 
  r."id" = 1;

