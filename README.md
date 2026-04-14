# plcafe (플 카페) - Church-Specific Smart Order System

교회 내 1인 운영 카페의 주문 병목 현상을 해결하기 위한 스마트 오더 시스템입니다.

## 🚀 Key Features

### 1. Context-Aware Order (기압계 기반 층수 계산)
- `expo-sensors`를 사용하여 기압데이터를 분석하고 사용자의 현재 층수(B4F ~ 3F)를 실시간 추정합니다.
- **알림 자동화**: 사용자의 층수와 현재 주문 밀도(Traffic Density)를 계산하여, 사용자가 도착하기 약 5분 전일 때 바리스타에게 제조 시작 권장 알림을 보냅니다.

### 2. 1-Person Staff Survival Mode (피크타임 제어)
- **Peak-Mode**: 어드민에서 피크타임 모드를 활성화하면 클라이언트 앱에서 제조가 복잡한 메뉴가 자동으로 숨겨지고 'Fast-Track' 메뉴만 노출됩니다.
- **Quota System**: 10분 슬롯당 최대 15잔까지만 주문을 허용하여 1인 바리스타의 과부하를 방지합니다.

### 3. Pl-Money Prepaid Wallet
- 선불 포인트 충전 및 결제 시스템.
- 3만 원 이상 5%, 5만 원 이상 10% 추가 보너스 적립.
- 주문 ID가 포함된 QR 코드로 신속한 현장 검증 가능.

### 4. High-Fidelity Design
- **Theme**: Coffee-themed palette (#FDF9F3, #935D37, #3E2723).
- **UI**: Digital Minimalism & Bento Grid 레이아웃.
- **Aesthetics**: 바쁜 바리스타를 위해 모든 UI 요소가 1.5배 크게 디자인되었습니다.

## 🛠 Tech Stack
- **Client**: React Native (Expo), NativeWind (Tailwind v3), Zustand, expo-sensors
- **Admin**: Next.js (React), Tailwind CSS v3, Zustand
- **Backend**: Firebase (Firestore, Auth)

## 📐 Technical Specifications: Floor Estimation Logic
기압($P$)을 고도($h$)로 변환하는 아래 수식을 활용합니다:
$$h = 44330 \times (1 - (P/P_0)^{1/5.255})$$
- $P_0$: 앱 실행 시점의 기준 기압.
- 지하 4층(-12m)부터 지상 3층(+9m)까지 3m 단위로 층수를 매핑합니다.

## 📦 Deployment
- **Admin**: Vercel을 통해 배포 권장.
- **Client**: Expo Application Services (EAS)를 통해 배포 권장.
