# 서버 실행 가이드

## 🚀 두 가지 서버가 필요합니다

### 1. 백엔드 API 서버 (포트 3000)
Google Sheets API를 사용하여 데이터를 저장하는 서버입니다.

**실행 방법:**
```bash
cd /Users/i537468/test
node server-oauth2.js
```

**확인:**
- 브라우저에서 `http://localhost:3000/api/auth/status` 접속
- JSON 응답이 보이면 정상 작동 중

### 2. 프론트엔드 웹 서버 (포트 8080)
HTML 파일을 서빙하는 서버입니다. 파일을 직접 열면 CORS 문제가 발생할 수 있습니다.

**실행 방법:**
```bash
cd /Users/i537468/test
npx http-server -p 8080
```

또는:
```bash
python3 -m http.server 8080
```

**접속:**
- 브라우저에서 `http://localhost:8080` 접속
- `http://localhost:8080/index.html` - 홈페이지
- `http://localhost:8080/contact.html` - 문의하기 페이지

## ⚠️ 중요 사항

### 파일을 직접 열면 안 되는 이유
- `file://` 프로토콜로 열면 CORS 정책으로 인해 `localhost:3000` API에 접근할 수 없습니다
- 반드시 웹 서버를 통해 접근해야 합니다

### 두 서버 모두 실행해야 함
1. **백엔드 서버** (포트 3000) - API 제공
2. **프론트엔드 서버** (포트 8080) - 웹사이트 제공

## 🔧 빠른 시작

### 터미널 1: 백엔드 서버
```bash
cd /Users/i537468/test
node server-oauth2.js
```

### 터미널 2: 프론트엔드 서버
```bash
cd /Users/i537468/test
npx http-server -p 8080
```

### 브라우저에서 접속
- `http://localhost:8080` 접속
- 문의하기 페이지에서 폼 제출 테스트

## ✅ 확인 방법

1. 백엔드 서버 확인:
   ```bash
   curl http://localhost:3000/api/auth/status
   ```

2. 프론트엔드 서버 확인:
   - 브라우저에서 `http://localhost:8080` 접속
   - 페이지가 정상적으로 로드되면 성공

3. 폼 제출 테스트:
   - `http://localhost:8080/contact.html` 접속
   - 폼 작성 후 제출
   - 성공 메시지가 나오면 정상 작동

