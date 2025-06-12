# Real POS Backend 🏪

**Real POS(Point of Sale) 시스템**의 백엔드 API 서버입니다. 실시간 주문 관리와 메뉴 관리를 제공하는 현대적인 POS 솔루션입니다.

## 📋 주요 기능

### 🔐 사용자 인증

- JWT 기반 액세스/리프레시 토큰 인증
- 쿠키 기반 보안 인증 관리
- 회원가입/로그인/로그아웃
- 사용자 프로필 관리

### 🍔 메뉴 관리

- 메뉴 등록/수정/조회
- 카테고리별 메뉴 분류
- 메뉴 활성화/비활성화
- 가격 및 설명 관리

### 📋 주문 관리

- 실시간 주문 생성 및 관리
- 주문 상태 추적 (진행중/완료)
- 오늘/월별 주문 통계
- 주문 항목 세부 관리

### ⚡ 실시간 업데이트

- **Server-Sent Events(SSE)** 기반 실시간 주문 알림
- 주문 생성/완료 시 즉시 알림
- 다중 클라이언트 동시 연결 지원

## 🛠 기술 스택

- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator, class-transformer
- **Security**: bcrypt, cookie-parser
- **Real-time**: Server-Sent Events (SSE)
- **Container**: Docker & Docker Compose

## 📁 프로젝트 구조

```
src/
├── auth/                   # 인증 모듈
│   ├── dto/               # 로그인/회원가입 DTO
│   ├── auth.controller.ts # 인증 컨트롤러
│   ├── auth.service.ts    # 인증 서비스
│   ├── jwt.strategy.ts    # JWT 전략
│   └── jwt-auth.guard.ts  # JWT 가드
├── user/                  # 사용자 모듈
│   ├── user.entity.ts     # 사용자 엔티티
│   ├── user.controller.ts # 사용자 컨트롤러
│   └── user.service.ts    # 사용자 서비스
├── menu/                  # 메뉴 모듈
│   ├── menu.entity.ts     # 메뉴 엔티티
│   ├── menu.controller.ts # 메뉴 컨트롤러
│   └── menu.service.ts    # 메뉴 서비스
├── order/                 # 주문 모듈
│   ├── order.entity.ts         # 주문 엔티티
│   ├── order.controller.ts     # 주문 컨트롤러
│   ├── order.service.ts        # 주문 서비스
│   ├── order.sse.controller.ts # SSE 컨트롤러
│   └── order.sse.service.ts    # SSE 서비스
├── order-item/            # 주문 항목 모듈
│   ├── order-item.entity.ts     # 주문 항목 엔티티
│   ├── order-item.controller.ts # 주문 항목 컨트롤러
│   └── order-item.service.ts    # 주문 항목 서비스
├── common/                # 공통 모듈
│   └── filters/          # 예외 필터
└── main.ts               # 애플리케이션 진입점
```

## 🚀 설치 및 실행

### 1. 환경 설정

`.env` 파일을 프로젝트 루트에 생성하세요:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=real_pos

# JWT Configuration
JWT_ACCESS_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=8080
NODE_ENV=development
```

### 2. 로컬 개발 환경

```bash
# 의존성 설치
yarn install

# 개발 모드 실행
yarn start:dev

# 프로덕션 빌드
yarn build

# 프로덕션 모드 실행
yarn start:prod
```

### 3. Docker를 이용한 실행

```bash
# Docker Compose로 전체 환경 실행 (MySQL 포함)
docker-compose up -d

# 또는 애플리케이션만 빌드 후 실행
docker build -t real-pos-backend .
docker run -p 8080:8080 real-pos-backend
```

## 📡 API 엔드포인트

### 🔐 인증 (Auth)

```
POST /auth/signup       # 회원가입
POST /auth/signin       # 로그인
POST /auth/logout       # 로그아웃
POST /auth/refresh      # 토큰 갱신
```

### 👤 사용자 (User)

```
GET  /user/me          # 내 정보 조회
PUT  /user/me          # 내 정보 수정
DELETE /user/me        # 회원 탈퇴
```

### 🍔 메뉴 (Menu)

```
GET  /menus            # 메뉴 목록 조회
POST /menus            # 메뉴 등록
PATCH /menus/:id       # 메뉴 수정
```

### 📋 주문 (Order)

```
GET  /orders           # 내 주문 전체 조회
GET  /orders/today     # 오늘 주문 조회
GET  /orders/monthly   # 월별 주문 조회
GET  /orders/:id       # 주문 상세 조회
POST /orders           # 주문 생성
PATCH /orders/:id      # 주문 수정
PATCH /orders/:id/complete  # 주문 완료
DELETE /orders/:id     # 주문 삭제
```

### 📦 주문 항목 (Order Item)

```
GET  /order-item/order/:orderId  # 주문별 항목 조회
POST /order-item/order/:orderId  # 주문 항목 추가
PATCH /order-item/:id           # 주문 항목 수정
DELETE /order-item/:id          # 주문 항목 삭제
```

### ⚡ 실시간 (SSE)

```
GET  /orders/sse?userId=:id     # 실시간 주문 알림 구독
```

### 🏥 헬스체크

```
GET  /health           # 서버 상태 확인
```

## 🔧 개발 도구

### 테스트 실행

```bash
# 단위 테스트
yarn test

# E2E 테스트
yarn test:e2e

# 테스트 커버리지
yarn test:cov
```

### 코드 품질

```bash
# 린트 검사 및 자동 수정
yarn lint

# 코드 포맷팅
yarn format
```

## 🗄️ 데이터베이스 스키마

### Users (사용자)

- `id`: 사용자 고유 ID
- `email`: 이메일 (로그인 ID)
- `password`: 암호화된 비밀번호
- `store_name`: 매장명
- `phone`: 전화번호

### Menus (메뉴)

- `id`: 메뉴 고유 ID
- `name`: 메뉴명
- `price`: 가격
- `category`: 카테고리
- `description`: 설명
- `is_active`: 활성화 여부

### Orders (주문)

- `id`: 주문 고유 ID
- `status`: 주문 상태 (IN_PROGRESS, COMPLETED)
- `user_id`: 사용자 ID (FK)

### OrderItems (주문 항목)

- `id`: 주문 항목 고유 ID
- `order_id`: 주문 ID (FK)
- `menu_id`: 메뉴 ID (FK)
- `quantity`: 수량
- `price`: 단가

## 🔒 보안 기능

- **JWT 토큰**: 액세스/리프레시 토큰 기반 인증
- **쿠키 보안**: HttpOnly, Secure, SameSite 설정
- **비밀번호 암호화**: bcrypt 해싱
- **CORS 설정**: 프론트엔드 도메인 제한
- **입력 검증**: class-validator를 통한 DTO 검증

## 🌐 실시간 기능

Server-Sent Events(SSE)를 통해 다음과 같은 실시간 기능을 제공합니다:

1. **새 주문 알림**: 주문 생성 시 즉시 알림
2. **주문 상태 변경**: 주문 완료 시 실시간 업데이트
3. **다중 연결**: 여러 클라이언트 동시 지원
4. **자동 재연결**: 연결 끊김 시 자동 복구

```javascript
// 프론트엔드에서 SSE 연결 예시
const eventSource = new EventSource(`/orders/sse?userId=${userId}`);
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('새 주문:', data);
};
```

## 🐳 배포

### Docker 배포

1. 이미지 빌드: `docker build -t real-pos-backend .`
2. 컨테이너 실행: `docker run -p 8080:8080 real-pos-backend`

### 환경별 설정

- **개발**: `NODE_ENV=development`
- **운영**: `NODE_ENV=production` (DB 동기화 비활성화)

## 📄 라이선스

이 프로젝트는 UNLICENSED 라이선스를 따릅니다.

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

---

**Real POS Backend** - 현대적이고 확장 가능한 POS 시스템을 위한 RESTful API 서버
