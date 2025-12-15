# Google Sheets 연동 설정 가이드

견적문의 폼에 입력된 데이터를 Google Sheets에 자동으로 저장하는 방법입니다.

## 📋 단계별 설정 방법

### 1단계: Google Sheets 스프레드시트 생성

1. [Google Sheets](https://sheets.google.com)에 접속
2. 새 스프레드시트 생성
3. 스프레드시트 이름 변경 (예: "견적문의 데이터")
4. **스프레드시트 URL 복사** (나중에 필요합니다)
   - 예: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - `SPREADSHEET_ID` 부분을 복사해두세요

### 2단계: Google Apps Script 설정

1. 스프레드시트에서 **확장 프로그램** > **Apps Script** 클릭
2. 새 프로젝트가 열리면 기본 코드를 모두 삭제
3. `google-apps-script.js` 파일의 내용을 복사하여 붙여넣기
4. **스프레드시트 ID 입력**
   - 코드에서 `YOUR_SPREADSHEET_ID_HERE` 부분을 1단계에서 복사한 ID로 변경
   - 예: `const SPREADSHEET_ID = '1a2b3c4d5e6f7g8h9i0j';`
5. **저장** (Ctrl+S 또는 Cmd+S)
6. 프로젝트 이름 변경 (예: "견적문의 폼 처리기")

### 3단계: 헤더 행 설정 (선택사항)

1. Apps Script 편집기에서 `testConnection` 함수 선택
2. **실행** 버튼 클릭
3. 권한 승인 요청이 나오면 **권한 확인** 클릭
4. Google 계정 선택 후 **고급** > **안전하지 않은 페이지로 이동** 클릭
5. **허용** 클릭
6. 실행이 완료되면 스프레드시트에 헤더 행이 자동으로 생성됩니다

### 4단계: 웹 앱으로 배포

1. Apps Script 편집기에서 **배포** > **새 배포** 클릭
2. **종류 선택** 옆의 톱니바퀴 아이콘 클릭
3. **웹 앱** 선택
4. 배포 설정:
   - **설명**: "견적문의 폼 데이터 수집" (원하는 설명 입력)
   - **실행 사용자**: **나** 선택
   - **액세스 권한**: **모든 사용자** 선택
5. **배포** 버튼 클릭
6. **웹 앱 URL 복사** (이 URL이 중요합니다!)
   - 예: `https://script.google.com/macros/s/AKfycby.../exec`

### 5단계: 웹사이트에 URL 연결

1. `script.js` 파일 열기
2. 파일 상단에서 다음 줄을 찾습니다:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE`를 4단계에서 복사한 웹 앱 URL로 변경
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. 파일 저장

### 6단계: 테스트

1. 웹사이트의 문의하기 페이지로 이동
2. 폼에 테스트 데이터 입력
3. **문의하기** 버튼 클릭
4. Google Sheets를 확인하여 데이터가 추가되었는지 확인

## 📊 데이터 구조

Google Sheets에 다음 형식으로 데이터가 저장됩니다:

| 제출 시간 | 이름 | 회사명 | 이메일 | 전화번호 | 문의 유형 | 메시지 |
|---------|------|--------|--------|---------|----------|--------|
| 2024-12-15 10:30:00 | 홍길동 | ABC회사 | hong@example.com | 010-1234-5678 | 견적 요청 | 안녕하세요... |

## 🔧 문제 해결

### 데이터가 저장되지 않는 경우

1. **웹 앱 URL 확인**: `script.js`의 `GOOGLE_SCRIPT_URL`이 올바른지 확인
2. **권한 확인**: 웹 앱 배포 시 "액세스 권한"이 "모든 사용자"로 설정되었는지 확인
3. **스프레드시트 ID 확인**: Apps Script 코드의 `SPREADSHEET_ID`가 올바른지 확인
4. **브라우저 콘솔 확인**: F12를 눌러 개발자 도구를 열고 Console 탭에서 오류 메시지 확인

### CORS 오류가 발생하는 경우

- `script.js`에서 `mode: 'no-cors'`를 사용하고 있어 CORS 오류는 무시됩니다
- 데이터는 정상적으로 전송되지만 응답을 확인할 수 없습니다

### 권한 오류가 발생하는 경우

1. Apps Script 편집기에서 **실행** > `doPost` 함수 실행
2. 권한 승인 요청이 나오면 승인
3. 웹 앱을 다시 배포

## 🔒 보안 참고사항

- 웹 앱 URL은 공개되어 있어 누구나 접근할 수 있습니다
- 스팸 방지를 위해 추가 검증 로직을 Apps Script에 추가하는 것을 권장합니다
- 민감한 정보는 암호화하여 저장하는 것을 고려하세요

## 📝 추가 기능

### 이메일 알림 추가

Apps Script에 다음 코드를 추가하면 새 문의가 들어올 때 이메일을 받을 수 있습니다:

```javascript
// doPost 함수 내부, sheet.appendRow() 다음에 추가
MailApp.sendEmail({
  to: 'your-email@example.com',
  subject: '새로운 견적문의: ' + (data.name || '이름 없음'),
  body: `새로운 견적문의가 접수되었습니다.\n\n` +
        `이름: ${data.name}\n` +
        `회사: ${data.company}\n` +
        `이메일: ${data.email}\n` +
        `전화: ${data.phone}\n` +
        `문의 유형: ${data.subject}\n` +
        `메시지: ${data.message}`
});
```

## 💡 팁

- 스프레드시트에 필터를 추가하여 데이터를 쉽게 정렬하고 필터링할 수 있습니다
- Apps Script에서 데이터 유효성 검사를 추가하여 잘못된 데이터를 걸러낼 수 있습니다
- 정기적으로 데이터를 백업하는 것을 권장합니다

