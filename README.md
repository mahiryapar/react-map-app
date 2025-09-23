<div align="center">

# React + .NET Core + PostGIS + GeoServer Harita Uygulaması

Çok katmanlı (frontend + backend + veritabanı + harita sunucusu) basit ama genişletilebilir bir polygon yönetim uygulaması.

</div>

## İçindekiler
- [Genel Bakış](#genel-bakış)
- [Mimari](#mimari)
- [Teknolojiler](#teknolojiler)
- [Özellikler](#özellikler)
- [Hızlı Başlangıç](#hızlı-başlangıç)
	- [Ön Koşullar](#ön-koşullar)
	- [Backend Kurulumu](#backend-kurulumu)
	- [Veritabanı (PostgreSQL + PostGIS)](#veritabanı-postgresql--postgis)
	- [GeoServer Kurulumu ve Katman Yayını](#geoserver-kurulumu-ve-katman-yayını)
	- [Frontend Kurulumu](#frontend-kurulumu)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Veri Modeli](#veri-modeli)
- [Örnek İstek / Cevaplar](#örnek-istek--cevaplar)
- [İstemci (Frontend) Akışı](#istemci-frontend-akışı)
- [Hata Yönetimi & Validasyon](#hata-yönetimi--validasyon)
- [Geliştirme / Migration Yönetimi](#geliştirme--migration-yönetimi)
- [İyileştirme Fikirleri](#iyileştirme-fikirleri)
- [Sorun Giderme](#sorun-giderme)

---

## Genel Bakış
Uygulama harita üzerinde polygon çizip:
1. GeoJSON formatında frontend'de üretir.
2. .NET Web API'ye gönderir.
3. API polygonu Postgres + PostGIS üzerinde saklar (geometry (Polygon, 4326), ek alanlar jsonb).
4. GeoServer ilgili tabloyu WMS / WFS servisleri olarak sunar.
5. Frontend WMS katmanını yenileyerek güncel geometriyi haritada gösterir.

Amaç: Basit bir kurulumla temel coğrafi CRUD işlemlerinin uçtan uca örneklenmesi.

## Mimari
```
React (Leaflet / OpenLayers benzeri Map bileşeni)
				│  (fetch + GeoJSON)
				▼
ASP.NET Core 9 Web API  (Controller -> Service -> Repository -> EF Core)
				│  (Npgsql + NetTopologySuite)
				▼
PostgreSQL + PostGIS (geometry + jsonb)
				│  (JDBC / Native bağlantı)
				▼
GeoServer (WMS / WFS yayın)
```

Katmanlar:
- Controller: `PolygonsController` uç noktaları.
- Service: İş mantığı, GeoJSON -> NTS Polygon dönüşümü, DTO üretimi.
- Repository / UnitOfWork: EF Core veri erişim soyutlaması.
- DbContext: PostGIS uzantısı + kolon tipleri (`geometry (Polygon,4326)`, `jsonb`).

## Teknolojiler
- Frontend: React (create-react-app yapısı), Fetch API.
- Backend: .NET 9, ASP.NET Core, EF Core, Npgsql, NetTopologySuite.
- Veritabanı: PostgreSQL + PostGIS uzantısı.
- Harita Yayını: GeoServer (WMS / isteğe göre WFS).
- Veri formatı: GeoJSON (Polygon).
- JSON depolama: `jsonb` (özellikler / serbest metadata).

## Özellikler
- Polygon çizme ve kaydetme.
- Mevcut polygonu seçip özelliklerini / geometrisini güncelleme (editMode).
- Polygon silme.
- Identify modu (tıklayınca seçme paneli açar).
- GeoServer WMS katmanını manuel / otomatik yenileyebilme (refresh fonksiyonu).
- Dinamik özellik alanı (ör: `ad`).

## Hızlı Başlangıç

### Ön Koşullar
- Node.js 18+ (veya LTS önerilir)
- .NET SDK 9.0
- PostgreSQL 14+ (PostGIS eklentisi kurulabilir olmalı)
- GeoServer (aynı makinede veya ayrı sunucuda)

### Backend Kurulumu
```powershell
cd backend
dotnet restore
dotnet build
```
`appsettings.Development.json` içinde bağlantı dizesini düzenleyin:
```jsonc
{
	"ConnectionStrings": {
		"DefaultConnection": "Host=localhost;Port=5432;Database=geo_db;Username=postgres;Password=YourStrongPassword"
	}
}
```
Çalıştırma:
```powershell
dotnet run
```
Varsayılan (örnek) URL: `http://localhost:5108` (launch profile / port sizde farklı olabilir).

Swagger (development): `http://localhost:5108/swagger`

### Veritabanı (PostgreSQL + PostGIS)
1. PostgreSQL kurun.
2. Veritabanı oluşturun (ör: `geo_db`).
3. PostGIS eklentisini etkinleştirin:
	 ```sql
	 CREATE EXTENSION IF NOT EXISTS postgis;
	 ```
4. API ilk açıldığında migration + `CREATE EXTENSION` kontrolü yapar.

### GeoServer Kurulumu ve Katman Yayını
1. GeoServer'ı başlatın (varsayılan: `http://localhost:8080/geoserver`).
2. Workspace oluşturun (ör: `geo_ws`).
3. Store ekleyin: PostGIS store (host, db, user, password girin).
4. `polygons` tablosunu (veya EF'in oluşturduğu tablo adını) layer olarak yayınlayın.
5. EPSG:4326 CRS doğrulayın / gerekirse bounding box hesaplayın.
6. WMS isteği örneği:
	 ```
	 http://localhost:8080/geoserver/geo_ws/wms?service=WMS&version=1.1.0&request=GetMap&layers=geo_ws:polygons&styles=&bbox=...&width=768&height=512&srs=EPSG:4326&format=image/png
	 ```
7. Frontend harita bileşeninizde bu WMS URL'sini kullanın. Değişiklik sonrası `refreshWMS()` çağrısı ile tile cache yenilenir (kodda `mapApiRef.current?.refreshWMS?.()`).

### Frontend Kurulumu
```powershell
cd frontend
npm install
npm start
```
Varsayılan: `http://localhost:3000`

Backend farklı bir portta ise `.env` dosyası oluşturun:
```
REACT_APP_API_URL=http://localhost:5108
```

## Ortam Değişkenleri
| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| REACT_APP_API_URL | Frontend'in hit ettiği API taban adresi | http://localhost:5108 |

## API Dokümantasyonu
Base URL: `http://<api-host>:<port>`

### 1. Polygon Oluştur
POST `/polygons`
Body:
```json
{
	"geometry": { "type": "Polygon", "coordinates": [[[30.1,40.1],[30.2,40.2],[30.3,40.1],[30.1,40.1]]] },
	"properties": { "ad": "Alan A", "renk": "kirmizi" }
}
```
Response 200:
```json
{
	"message": "Polygon Başarıyla Kaydedildi!",
	"entity": {
		"id": 1,
		"name": "Alan A",
		"properties": { "ad": "Alan A", "renk": "kirmizi" },
		"geometry": { "type": "Polygon", "coordinates": [[[30.1,40.1],[30.2,40.2],[30.3,40.1],[30.1,40.1]]] }
	}
}
```

### 2. Tüm Polygonları Getir
GET `/polygons`
Response 200: `PolygonDto[]`

### 3. Polygon Güncelle
PUT `/polygons`
Body:
```json
{
	"id": 1,
	"geometry": { "type": "Polygon", "coordinates": [[[30.1,40.1],[30.4,40.3],[30.3,40.1],[30.1,40.1]]] },
	"properties": { "ad": "Alan A - Güncel" }
}
```
Response 200 benzeri "Polygon Başarıyla Güncellendi!".

### 4. Polygon Sil
DELETE `/polygons/{id}`
Response 200: `{ "message": "Polygon Başarıyla Silindi!" }`

### Hata Örnekleri
```json
{ "message": "Polygon kaydedilirken bir hata oluştu.", "error": "Koordinatlar eksik." }
```

## Veri Modeli
Backend Entity (`PolygonEntity`):
| Alan | Tip | Açıklama |
|------|-----|----------|
| Id | int | PK |
| Name | string? | `properties["ad"]` den set ediliyor |
| Properties | jsonb | Serbest sözlük (Dictionary<string,string>) |
| Geometry | geometry(POLYGON,4326) | NTS `Polygon` | 

DTO (`PolygonDto`) Geometry + Properties GeoJSON uyumlu `JsonObject` olarak döner.

İstek Modeli (`PolygonModel`):
```json
{
	"id": 0,
	"geometry": { "type": "Polygon", "coordinates": [...] },
	"properties": { "ad": "..." }
}
```

### GeoJSON Beklentileri
- `type` mutlaka `Polygon` olmalı.
- Koordinatlar: Dış halka + opsiyonel delikler: `[[[lon,lat],...]]`.
- İlk ve son nokta aynı değilse backend otomatik kapatır.
- CRS varsayılan: EPSG:4326 (lon, lat sırası önemlidir).

## Örnek İstek / Cevaplar
### Başarılı Kayıt Senaryosu
1. Çizim biter -> `onPolygonComplete` -> `SidebarForm` açılır.
2. Kullanıcı özellik girer -> `savePolygon()` -> API 200.
3. Frontend `onSuccess` -> form kapanır -> `refreshWMS()` çağrılır.

### Güncelleme Senaryosu
1. Identify modunda polygon seçilir -> sol panel açılır.
2. Edit Mode aktifleştirilir, geometri değiştirilir.
3. Kaydet -> `updatePolygon()` -> API PUT.

## İstemci (Frontend) Akışı
- `MapView` komponenti çizim / seçim / mod değiştirme olaylarını yönetir.
- `mapApiRef` üzerinden harita API fonksiyonları (ör: `refreshWMS`, `enableDrawing`).
- State Yönetimi: Basit React state (global store kullanılmıyor).

## Hata Yönetimi & Validasyon
- Null / eksik `geometry` -> 400 BadRequest.
- Geçersiz ID -> 400.
- Bulunmayan kaynak silme / güncelleme -> 404 veya özel mesaj.
- Service katmanında GeoJSON parse hataları kullanıcıya açıklayıcı mesajla döner.

## Geliştirme / Migration Yönetimi
Yeni migration eklemek istediğinizde:
```powershell
cd backend
dotnet ef migrations add <MigrationAdi>
dotnet ef database update
```
Not: `NetTopologySuite` için `UseNpgsql(..., o => o.UseNetTopologySuite())` zaten ekli.

## İyileştirme Fikirleri
- WFS entegrasyonu ile attribute sorgulama.
- Çoklu geometry tip desteği (MultiPolygon, LineString vs.).
- Yetkilendirme / kimlik doğrulama (JWT).
- Versiyonlama / geometry history.
- Spatial index tuning ve performans testleri.
- CI/CD pipeline (GitHub Actions) + otomatik migration.
- Testler (Service katmanı için birim testleri, integration testleri).

## Sorun Giderme
| Sorun | Olası Neden | Çözüm |
|-------|-------------|-------|
|  CORS hatası  | Origin izinli değil | `Program.cs` CORS policy'ye yeni origin ekleyin |
|  Geometry kaydedilmiyor | Koordinat dizisi eksik | GeoJSON formatını doğrulayın (`[[[lon,lat],...]]`) |
|  GeoServer'da layer görünmüyor | Tablo yok / schema farklı | EF tablo adını ve store konfigürasyonunu kontrol edin |
|  WMS güncellenmiyor | Cache | Tile cache temizleyin veya `refreshWMS()` çağrısını doğrulayın |
|  Migration hatası | PostGIS yok | Veritabanında `CREATE EXTENSION postgis;` çalıştırın |

---

Geri bildirimler ve katkılar memnuniyetle karşılanır. İsterseniz yeni özellik isteklerini Issue olarak açabilirsiniz.

---

## İletişim / Hazırlayan ✨

<div align="center">

### **Mahir Yapar**

[![Mail](https://img.shields.io/badge/E--posta-mahiryapar2453%40gmail.com-blue?style=flat-square&logo=gmail&logoColor=white)](mailto:mahiryapar2453@gmail.com)


"Harita verisi en iyi yaşayan bir döngüde; çiz → kaydet → görüntüle → güncelle adımı hızlandırdıkça değer üretir." 

</div>




