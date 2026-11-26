-- Realistic ViVuCoach demo data
insert into public.operators (id, code, name, hotline, description, rating, review_count_label, fleet_highlight, status)
values
  ('10000000-0000-0000-0000-000000000001','OP-FUTA','Phương Trang (FUTA Bus Lines)','19006067','Mạng lưới bao phủ 63 tỉnh thành, xuất bến đúng giờ, tần suất 15 phút/chuyến.',4.9,'120k+','Hơn 1.200 xe giường nằm','ACTIVE'),
  ('10000000-0000-0000-0000-000000000002','OP-TBUOI','Thành Bưởi Limousine','19006079','Chuyên cơ mặt đất tuyến Sài Gòn - Đà Lạt - Cần Thơ, dịch vụ tiếp viên 5 sao.',4.8,'85k+','Cabin Cung Điện VIP','ACTIVE'),
  ('10000000-0000-0000-0000-000000000003','OP-SAOVIET','Sao Việt Express','19006746','Đơn vị dẫn đầu tuyến Hà Nội - Lào Cai - Sa Pa, phòng nằm riêng tư cặp đôi.',4.9,'42k+','Xe chạy đường cao tốc','ACTIVE'),
  ('10000000-0000-0000-0000-000000000004','OP-KUMHO','Kumho Samco Express','19006746','Tuyến liên tỉnh trọng điểm miền Nam với xe ghế ngả tiện nghi.',4.7,'18k+','Ghế ngả thư giãn','ACTIVE'),
  ('10000000-0000-0000-0000-000000000005','OP-HOAMAI','Hoa Mai Limousine','19009227','Đón trả trung tâm TP.HCM và TP. Vũng Tàu, xuất bến liên tục mỗi 15 phút.',4.8,'64k+','Limousine đón tận nhà','ACTIVE'),
  ('10000000-0000-0000-0000-000000000006','OP-HAIVAN','Hải Vân Royal Limousine','19006763','Nhà xe Limousine cao cấp phục vụ miền Trung.',4.6,'9k+','Phòng riêng cao cấp','PENDING_APPROVAL')
on conflict (id) do update set name=excluded.name, hotline=excluded.hotline, description=excluded.description,
  rating=excluded.rating, review_count_label=excluded.review_count_label, fleet_highlight=excluded.fleet_highlight, status=excluded.status;

insert into public.locations (id, province_name, station_name, address, type)
values
  ('20000000-0000-0000-0000-000000000001','TP. Hồ Chí Minh','Bến xe Miền Đông mới','501 Hoàng Hữu Nam, TP. Thủ Đức','BOTH'),
  ('20000000-0000-0000-0000-000000000002','TP. Hồ Chí Minh','VP Hàng Xanh','486 Điện Biên Phủ, Bình Thạnh','PICKUP'),
  ('20000000-0000-0000-0000-000000000003','Đà Lạt (Lâm Đồng)','Bến xe Liên tỉnh Đà Lạt','01 Tô Hiến Thành, Phường 3, Đà Lạt','BOTH'),
  ('20000000-0000-0000-0000-000000000004','Đà Lạt (Lâm Đồng)','VP Phan Bội Châu','55 Phan Bội Châu, Phường 1, Đà Lạt','DROPOFF'),
  ('20000000-0000-0000-0000-000000000005','Phan Thiết (Bình Thuận)','Bến xe Bắc Phan Thiết','Nguyễn Đình Chiểu, Hàm Tiến','BOTH'),
  ('20000000-0000-0000-0000-000000000006','Nha Trang (Khánh Hòa)','Bến xe Phía Nam Nha Trang','Km6 Đường 23/10, Vĩnh Trung','BOTH'),
  ('20000000-0000-0000-0000-000000000007','Vũng Tàu (BR-VT)','Bến xe Vũng Tàu','Nam Kỳ Khởi Nghĩa, Phường Thắng Tam','BOTH'),
  ('20000000-0000-0000-0000-000000000008','Hà Nội','Bến xe Mỹ Đình','Lê Đức Thọ, Nam Từ Liêm','BOTH'),
  ('20000000-0000-0000-0000-000000000009','Sa Pa (Lào Cai)','Bến xe Trung tâm Sa Pa','Quốc lộ 4D, Sa Pa','BOTH'),
  ('20000000-0000-0000-0000-000000000010','Hà Giang','Bến xe Khách Hà Giang','Đường 19/5, Phường Nguyễn Trãi','BOTH'),
  ('20000000-0000-0000-0000-000000000011','Đà Nẵng','Bến xe Trung tâm Đà Nẵng','Tôn Đức Thắng, Liên Chiểu','BOTH')
on conflict (id) do update set province_name=excluded.province_name, station_name=excluded.station_name,
  address=excluded.address, type=excluded.type;

insert into public.routes (id, operator_id, departure_province, destination_province, estimated_duration_minutes, base_price,
  highway_note, coach_label, badge_text, is_hot, description, image_url, amenities, daily_trips_count)
values
  ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','TP. Hồ Chí Minh','Đà Lạt (Lâm Đồng)',390,290000,'Cao tốc Dầu Giây','Xe Cung Điện 22/36','Tuyến Hot Nhất',true,'Đón trả linh hoạt tại Bến xe Miền Đông mới và trung tâm Đà Lạt, hỗ trợ trung chuyển miễn phí.','https://images.unsplash.com/photo-1544620347-c4fd4a3d5957', '[{"icon":"wifi","label":"WiFi tốc độ cao"},{"icon":"power","label":"Cổng sạc Type-C"},{"icon":"water_drop","label":"Nước suối & khăn"}]'::jsonb,28),
  ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','TP. Hồ Chí Minh','Phan Thiết (Bình Thuận)',165,180000,'Cao tốc Dầu Giây - Phan Thiết','Limousine Massage','Cao tốc thông suốt',false,'Ghế ngả thương gia bọc da, massage đa điểm và đón trả tuyến Mũi Né.','https://images.unsplash.com/photo-1570125909232-eb263c188f7e','[{"icon":"airline_seat_recline_extra","label":"Ghế Massage VIP"},{"icon":"shield","label":"Bảo hiểm trọn gói"}]'::jsonb,34),
  ('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000003','TP. Hồ Chí Minh','Nha Trang (Khánh Hòa)',435,320000,'Cao tốc Cam Lâm','Chuyên Cơ Mặt Đất','Cabin 22 Phòng VIP',false,'Không gian riêng tư, rèm kín và nệm cao cấp cho hành trình đêm.','https://images.unsplash.com/photo-1541410965313-d53b3c16ef17','[{"icon":"tv","label":"Smart TV"},{"icon":"headphones","label":"Tai nghe khử ồn"}]'::jsonb,22),
  ('30000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000005','TP. Hồ Chí Minh','Vũng Tàu (BR-VT)',120,160000,'Cao tốc Long Thành','Limousine VIP','Đón trả tận nhà',false,'Xe đón trả tận nơi nội thành TP.HCM và trung tâm Vũng Tàu.','https://images.unsplash.com/photo-1544620347-c4fd4a3d5957','[{"icon":"flight_takeoff","label":"Đón tại Sân Bay"},{"icon":"schedule","label":"15 phút/chuyến"}]'::jsonb,45),
  ('30000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000003','Hà Nội','Sa Pa (Lào Cai)',330,350000,'Cao tốc Nội Bài - Lào Cai','Cabin Cung Điện','Cabin Đôi Tình Yêu',true,'Phòng riêng kính Panorama ngắm đèo Hoàng Liên Sơn.','https://images.unsplash.com/photo-1494515843206-f3117d3f3b57','[{"icon":"wc","label":"Toilet trên xe"},{"icon":"landscape","label":"Cửa sổ Panorama"}]'::jsonb,30),
  ('30000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','Hà Nội','Hà Giang',360,300000,'Cao tốc Tuyên Quang','Cung Điện Ánh Sáng','Khám Phá Đông Bắc',false,'Giảm xóc khí nén êm ái, đón tại phố cổ Hà Nội.','https://images.unsplash.com/photo-1530789253388-582c481c54b0','[{"icon":"two_wheeler","label":"Điểm thuê xe máy"},{"icon":"hotel","label":"Đón khách sạn"}]'::jsonb,18)
on conflict (id) do update set departure_province=excluded.departure_province,destination_province=excluded.destination_province,
  estimated_duration_minutes=excluded.estimated_duration_minutes,base_price=excluded.base_price,description=excluded.description;

insert into public.route_stops (id, route_id, location_id, stop_type, offset_minutes, station_name, address)
values
  ('40000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','PICKUP',0,'VP Hàng Xanh','486 Điện Biên Phủ, P.21, Bình Thạnh'),
  ('40000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','PICKUP',30,'Bến xe Miền Đông Mới','501 Hoàng Hữu Nam, Long Bình, TP. Thủ Đức'),
  ('40000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','DROPOFF',390,'Bến xe Liên tỉnh Đà Lạt','01 Tô Hiến Thành, Phường 3, Đà Lạt'),
  ('40000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','DROPOFF',410,'VP Phan Bội Châu','55 Phan Bội Châu, Phường 1, Đà Lạt'),
  ('40000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','PICKUP',0,'Bến xe Miền Đông Mới','501 Hoàng Hữu Nam, TP. Thủ Đức'),
  ('40000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000005','DROPOFF',165,'Bến xe Bắc Phan Thiết','Nguyễn Đình Chiểu, Hàm Tiến'),
  ('40000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000001','PICKUP',0,'Bến xe Miền Đông Mới','501 Hoàng Hữu Nam, TP. Thủ Đức'),
  ('40000000-0000-0000-0000-000000000008','30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000006','DROPOFF',435,'Bến xe Phía Nam Nha Trang','Km6 Đường 23/10, Vĩnh Trung'),
  ('40000000-0000-0000-0000-000000000009','30000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000008','PICKUP',0,'Bến xe Mỹ Đình','Lê Đức Thọ, Nam Từ Liêm'),
  ('40000000-0000-0000-0000-000000000010','30000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000009','DROPOFF',330,'Bến xe Trung tâm Sa Pa','Quốc lộ 4D, Sa Pa')
on conflict (id) do update set stop_type=excluded.stop_type,offset_minutes=excluded.offset_minutes,
  station_name=excluded.station_name,address=excluded.address;

insert into public.coaches (id, operator_id, license_plate, coach_type, seat_layout_json, status)
values
  ('50000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','51B-298.12','LIMOUSINE_22','{"decks":2,"rows_per_deck":11}'::jsonb,'ACTIVE'),
  ('50000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','51B-441.09','SLEEPER_36','{"decks":2,"rows":18}'::jsonb,'ACTIVE'),
  ('50000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000004','51B-882.01','SEATER_45','{"decks":1,"rows":15}'::jsonb,'ACTIVE'),
  ('50000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000003','29B-772.05','LIMOUSINE_22','{"decks":2,"rows_per_deck":11}'::jsonb,'ACTIVE'),
  ('50000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000003','29B-451.88','SLEEPER_36','{"decks":2,"rows":18}'::jsonb,'ACTIVE')
on conflict (id) do update set license_plate=excluded.license_plate,coach_type=excluded.coach_type,
  seat_layout_json=excluded.seat_layout_json,status=excluded.status;

insert into public.trips (id, trip_code, route_id, coach_id, departure_time, arrival_time, ticket_price, status)
values
  ('60000000-0000-0000-0000-000000000001','TRIP-DL-2200','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','2026-11-20 22:00:00+07','2026-11-21 04:30:00+07',450000,'BOARDING'),
  ('60000000-0000-0000-0000-000000000002','TRIP-DL-2300','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002','2026-11-20 23:00:00+07','2026-11-21 05:15:00+07',340000,'SCHEDULED'),
  ('60000000-0000-0000-0000-000000000003','TRIP-DL-0800','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000004','2026-11-21 08:00:00+07','2026-11-21 14:30:00+07',260000,'SCHEDULED'),
  ('60000000-0000-0000-0000-000000000004','TRIP-NT-2130','30000000-0000-0000-0000-000000000003','50000000-0000-0000-0000-000000000005','2026-11-20 21:30:00+07','2026-11-21 05:00:00+07',420000,'ON_ROUTE'),
  ('60000000-0000-0000-0000-000000000005','TRIP-SP-2200','30000000-0000-0000-0000-000000000005','50000000-0000-0000-0000-000000000006','2026-11-21 22:00:00+07','2026-11-22 03:30:00+07',350000,'SCHEDULED')
on conflict (id) do update set departure_time=excluded.departure_time,arrival_time=excluded.arrival_time,
  ticket_price=excluded.ticket_price,status=excluded.status;

insert into public.bookings (id, booking_code, trip_id, customer_name, customer_phone, customer_email,
  pickup_stop_id, dropoff_stop_id, total_amount, status, qr_token, expired_at)
values
  ('70000000-0000-0000-0000-000000000001','VVC-261118-8892','60000000-0000-0000-0000-000000000001','Nguyễn Hà Thành','0912 345 678','thanh.nguyen@gmail.com','40000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003',900000,'PAID','eyJhbGciOiJIUzI1NiJ9.VVC-261118-8892.SIG',null),
  ('70000000-0000-0000-0000-000000000002','VVC-261118-8893','60000000-0000-0000-0000-000000000001','Trần Hoàng Long','0988 112 334','hoanglong@gmail.com','40000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000004',450000,'PAID','VVC-261118-8893-TOKEN',null),
  ('70000000-0000-0000-0000-000000000003','VVC-261118-8901','60000000-0000-0000-0000-000000000001','Lê Minh Châu','0903 556 778','minhchau@gmail.com','40000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003',450000,'CHECKED_IN','VVC-261118-8901-TOKEN',null),
  ('70000000-0000-0000-0000-000000000004','VVC-261118-8915','60000000-0000-0000-0000-000000000001','Phạm Quốc Anh','0937 889 001','quocanh@gmail.com','40000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000004',450000,'PENDING','VVC-261118-8915-TOKEN','2026-11-20 22:10:00+07')
on conflict (id) do update set status=excluded.status,expired_at=excluded.expired_at,total_amount=excluded.total_amount;

insert into public.booking_seats (booking_id, trip_id, seat_code, price)
values
  ('70000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001','A03',450000),
  ('70000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001','A04',450000),
  ('70000000-0000-0000-0000-000000000002','60000000-0000-0000-0000-000000000001','A02',450000),
  ('70000000-0000-0000-0000-000000000003','60000000-0000-0000-0000-000000000001','B01',450000),
  ('70000000-0000-0000-0000-000000000004','60000000-0000-0000-0000-000000000001','B04',450000)
on conflict do nothing;

insert into public.payments (booking_id, provider, transaction_id, amount, status, paid_at)
values
  ('70000000-0000-0000-0000-000000000001','SEPAY_VIETQR','FT263229901823',900000,'PAID','2026-11-18 17:15:08+07'),
  ('70000000-0000-0000-0000-000000000002','MOMO','MOMO-20261118-4421',450000,'PAID','2026-11-18 18:20:12+07'),
  ('70000000-0000-0000-0000-000000000003','SEPAY_VIETQR','FT263229902101',450000,'PAID','2026-11-18 19:05:44+07')
on conflict do nothing;

insert into public.vouchers (id, code, badge, icon, title, description, is_vip_club)
values
  ('80000000-0000-0000-0000-000000000001','VIVUVIETNAM','Khách hàng mới','loyalty','Giảm 30.000₫ vé đầu tiên','Áp dụng cho mọi tuyến xe khi thanh toán VietQR qua SePay.',false),
  ('80000000-0000-0000-0000-000000000002','MOMOVIVU','Ví MoMo 1 chạm','account_balance_wallet','Giảm ngay 10% tối đa 50K','Hoàn tiền trực tiếp vào Ví MoMo liên kết.',false),
  ('80000000-0000-0000-0000-000000000003','DALATWEEKEND','Chuyến đêm VIP','bedtime','Giảm 40.000₫ Sài Gòn ⇄ Đà Lạt','Dành riêng cho Limousine 22 phòng và Giường Nằm 36 chỗ.',false),
  ('80000000-0000-0000-0000-000000000004','VIVUCLUB','Đặc quyền VIP','stars','Đồng bộ vé & Ưu tiên giữ chỗ','Tự động liên kết lịch sử đặt vé qua Gmail.',true)
on conflict (id) do update set badge=excluded.badge,title=excluded.title,description=excluded.description;

insert into public.testimonials (id, customer_name, initials, route_info, rating, comment)
values
  ('90000000-0000-0000-0000-000000000001','Trần Hoàng Long','TH','Tuyến: Sài Gòn ⇄ Đà Lạt (Limousine 22 phòng)',5,'Đi công tác gấp lên Đà Lạt, mình đặt vé lúc 22h30 quét mã VietQR là nhận vé QR qua email liền tay. Cabin riêng tư cực êm.'),
  ('90000000-0000-0000-0000-000000000002','Nguyễn Mai Anh','MA','Tuyến: Sài Gòn ⇄ Phan Thiết Mũi Né',5,'Chọn đúng số giường trên sơ đồ ghế trực tiếp. Giữ chỗ 10 phút thanh toán rất yên tâm.'),
  ('90000000-0000-0000-0000-000000000003','Đỗ Văn Minh','ĐV','Tuyến: Hà Nội ⇄ Sa Pa (Cabin VIP)',5,'Lần đầu đặt vé khi chưa đăng nhập, sau đó login bằng Google thấy hệ thống tự động đồng bộ vé vào mục Vé của tôi.')
on conflict (id) do update set customer_name=excluded.customer_name,route_info=excluded.route_info,rating=excluded.rating,comment=excluded.comment;

insert into public.admin_payouts (id, settlement_code, operator_id, bank_info, cycle_label, total_bookings, gross_amount, platform_fee, refund_deduction, net_payout, payment_gateway_match, status)
values
  ('a0000000-0000-0000-0000-000000000001','STL-202611-W3-FUTA','10000000-0000-0000-0000-000000000001','Vietcombank • 0071000889999','11/11/2026 - 17/11/2026',3420,1240000000,62000000,18500000,1159500000,'MATCHED_100','READY_TO_PAY'),
  ('a0000000-0000-0000-0000-000000000002','STL-202611-W3-TBUOI','10000000-0000-0000-0000-000000000002','ACB • 190888999','11/11/2026 - 17/11/2026',1890,685000000,37675000,9200000,638125000,'MATCHED_100','READY_TO_PAY'),
  ('a0000000-0000-0000-0000-000000000003','STL-202611-W3-SAOVIET','10000000-0000-0000-0000-000000000003','BIDV • 3141000667788','11/11/2026 - 17/11/2026',1120,412000000,20600000,4500000,386900000,'DISCREPANCY','HOLD')
on conflict (id) do update set net_payout=excluded.net_payout,status=excluded.status;
