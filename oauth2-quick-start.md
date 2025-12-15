# OAuth 2.0 빠른 시작 가이드

## 🚀 5분 안에 설정하기

### 1단계: Google Cloud Console 설정 (2분)

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 생성
3. **API 및 서비스** > **사용 설정된 API** > **+ API 및 서비스 사용 설정**
4. "Google Sheets API" 검색 후 **사용 설정**

### 2단계: OAuth 클라이언트 ID 생성 (2분)

1. **API 및 서비스** > **사용자 인증 정보** > **+ 사용자 인증 정보 만들기** > **OAuth 클라이언트 ID**
2. 동의 화면 구성 (처음인 경우):
   - 사용자 유형: **외부**
   - 앱 이름: "TechSemiconductor"
   - 이메일 입력
   - 테스트 사용자에 본인 이메일 추가
3. OAuth 클라이언트 ID 생성:
   - 애플리케이션 유형: **웹 애플리케이션**
   - 이름: "Web Client"
   - 승인된 JavaScript 원본: `http://localhost:3000`
   - 승인된 리디렉션 URI: `http://localhost:3000/auth/callback`
   - **만들기** 클릭
4. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

### 3단계: 환경 변수 설정 (1분)

`.env` 파일 생성:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
REDIRECT_URI=http://localhost:3000/auth/callback
SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_API_KEY=AIzaSyA4ZYab_5F_Jeu8eSTCabmTQisFAbacbp0
PORT=3000
```

### 4단계: 서버 실행

```bash
npm install
node server-oauth2.js
```

### 5단계: 인증 및 테스트

1. 브라우저에서 `http://localhost:3000/auth/google` 접속
2. Google 계정으로 로그인 및 권한 승인
3. 문의 폼 제출 테스트

## 📝 프론트엔드 연결

`script.js`를 `script-oauth2.js`의 코드로 교체하거나, 백엔드 API를 사용:

```javascript
// script.js 수정
const API_URL = 'http://localhost:3000/api/contact';

// fetch 부분은 script-api.js 참고
```

## ✅ 완료!

이제 폼 제출 시 Google Sheets에 자동으로 저장됩니다!

## 🔧 문제 해결

### "인증이 필요합니다" 오류
- `/auth/google`로 이동하여 인증 완료

### "리디렉션 URI 불일치" 오류
- Google Cloud Console에서 리디렉션 URI 확인
- 정확히 `http://localhost:3000/auth/callback`로 설정

### "스프레드시트를 찾을 수 없습니다" 오류
- SPREADSHEET_ID 확인
- 스프레드시트에 접근 권한 확인

## 💡 다음 단계

- 프로덕션 배포 시 리디렉션 URI 업데이트
- 토큰을 데이터베이스에 저장 (현재는 메모리)
- 리프레시 토큰 자동 갱신 구현

