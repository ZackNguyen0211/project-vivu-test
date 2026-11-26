Tạo trang mới tại `src/app/<đường-dẫn-trang>/page.tsx` dựa trên thiết kế HTML từ Stitch.io dưới đây.

Tuân thủ nghiêm ngặt quy tắc trong `.github/instructions/new-page.instructions.md`:
1. KHÔNG quét lại toàn bộ `src/`. Dùng đúng layout của route group tương ứng và tái sử dụng `CustomerHeader` / `CustomerFooter` (hoặc `PortalShell`) có sẵn; cắt bỏ hoàn toàn header/footer có trong mã HTML của Stitch.
2. Tách phần giao diện & tương tác client thành `src/components/<tên-feature>/<TênComponent>Client.tsx`, giữ `page.tsx` làm Server Component lấy dữ liệu từ `src/services/`.
3. Chuyển đổi toàn bộ icon và mã màu trong HTML sang thư viện icon và bảng màu chuẩn của ViVuCoach.
4. Kết nối dữ liệu thật từ `src/services/` (nếu đã có hàm tương ứng) hoặc dùng mock data đúng chuẩn TypeScript trong `src/types/`.

Mã HTML thiết kế từ Stitch.io:
```html
<DÁN_CODE_HTML_TỪ_STITCH_VÀO_ĐÂY>
