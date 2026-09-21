# 🚀 Hướng Dẫn & Thông Tin Deploy Coolify - Fortrade Platform

Tài liệu này lưu trữ toàn bộ thông tin cấu hình, định danh và lệnh triển khai (deploy) hệ thống Fortrade lên Coolify trên VPS.

---

## 📌 1. Thông Tin VPS & Coolify Dashboard

* **IP VPS:** `36.50.27.243`
* **Coolify Dashboard URL:** [http://36.50.27.243:8000](http://36.50.27.243:8000)
* **Trang ứng dụng trên Coolify:** [http://36.50.27.243:8000/project/aqnezl8zirnsii03463s59hs/environment/fkl1155uo3584nc4ihvfxmh3/application/0hxokfidre7k9xizdoepxcy0](http://36.50.27.243:8000/project/aqnezl8zirnsii03463s59hs/environment/fkl1155uo3584nc4ihvfxmh3/application/0hxokfidre7k9xizdoepxcy0)
* **Coolify API Token:** `3|XwWCIcBLKpHa5J1NlOCPsN0jpKn0n88Isv4X0JsVe006b493`

---

## 🏗️ 2. Định Danh Ứng Dụng (UUIDs)

| Thuộc tính | Giá trị |
| :--- | :--- |
| **Project UUID** | `aqnezl8zirnsii03463s59hs` (Dự án: `fortrade`) |
| **Environment UUID** | `fkl1155uo3584nc4ihvfxmh3` (Môi trường: `production`) |
| **Application UUID** | `0hxokfidre7k9xizdoepxcy0` |
| **Git Repository** | `nhnamdev/spotline888` |
| **Git Branch** | `master` |
| **Live Domains (FQDN)** | `https://www.fortrade.mocmoc.vn`, `https://fortrade.mocmoc.vn` |
| **Container Port** | `3000` |

---

## 🗄️ 3. Cơ Sở Dữ Liệu MySQL từ xa

* **Host:** `36.50.27.243`
* **Port:** `3306`
* **User:** `fortrade_user`
* **Database:** `fortrade_db`

---

## ⚡ 4. Cách Kích Hoạt Deploy Tự Động Qua API

### Cách 1: PowerShell (Windows)
```powershell
Invoke-RestMethod -Uri "http://36.50.27.243:8000/api/v1/deploy?uuid=0hxokfidre7k9xizdoepxcy0" `
  -Headers @{ Authorization = "Bearer 3|XwWCIcBLKpHa5J1NlOCPsN0jpKn0n88Isv4X0JsVe006b493" } `
  -Method Post
```

### Cách 2: cURL (Linux / Mac / Bash)
```bash
curl -X POST "http://36.50.27.243:8000/api/v1/deploy?uuid=0hxokfidre7k9xizdoepxcy0" \
  -H "Authorization: Bearer 3|XwWCIcBLKpHa5J1NlOCPsN0jpKn0n88Isv4X0JsVe006b493"
```

---

## 📝 5. Lịch Sử Cập Nhật (Changelog Gần Nhất)

### Phiên bản: `2026-09-21`
1. **Logo thương hiệu**: Chuyển toàn bộ logo cũ "SPOT" sang logo vector SVG chuẩn thương hiệu **"fortrade"** (gradient cyan/blue + chữ "trade" sắc nét) tại Header trang chủ, trang Đăng nhập và Đăng ký.
2. **Nút bấm modal**: Đổi nút modal từ tiếng Việt `"Đóng"` sang tiếng Trung `"关闭"` và bổ sung đa ngôn ngữ cho tất cả các thứ tiếng.
3. **Sửa dãn cách chữ tiếng Anh**: Khắc phục dứt điểm lỗi chữ tiếng Anh bị kéo dãn to (*"英文间隙很大"*) bằng cách thay `text-justify` thành `text-left break-words leading-[1.65]`.
4. **Thời gian thông báo**: Cập nhật thời gian thông báo sứ mệnh về **`2022-09-09 10:30`** đồng bộ cả MySQL Database, migration seed và frontend formatting.
5. **Sửa script dev-all.js**: Khắc phục lỗi đường dẫn có khoảng trắng trên Windows.
