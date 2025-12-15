# Google API 키 사용 가이드

제공하신 Google API 키: `AIzaSyA4ZYab_5F_Jeu8eSTCabmTQisFAbacbp0`

## ⚠️ 중요 사항

**Google Sheets API 키만으로는 데이터를 쓰기(추가)할 수 없습니다!**

- ✅ API 키로 가능: **읽기 전용** 작업
- ❌ API 키로 불가능: **쓰기** 작업 (데이터 추가, 수정, 삭제)

데이터를 Google Sheets에 저장하려면 다음 중 하나가 필요합니다:
1. **Google Apps Script** (가장 간단, 현재 구현됨)
2. **서비스 계정** (백엔드 서버 필요)
3. **OAuth 2.0** (사용자 인증 필요)

## 🔑 API 키 사용 방법

### 방법 1: Google Apps Script와 함께 사용 (권장)

Google Apps Script는 API 키 없이도 작동하지만, API 키를 사용하여 추가 기능을 구현할 수 있습니다.

### 방법 2: Google Sheets API v4로 읽기 작업

```javascript
// 읽기 전용 예제
const API_KEY = 'AIzaSyA4ZYab_5F_Jeu8eSTCabmTQisFAbacbp0';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

async function readSheet() {
  const range = 'Sheet1!A1:G10';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  return data.values;
}
```

### 방법 3: 서비스 계정과 함께 사용

API 키는 공개 API 접근에 사용되고, 서비스 계정은 인증된 쓰기 작업에 사용됩니다.

## 📝 추천 방법

**현재 구현된 Google Apps Script 방법을 계속 사용하는 것을 권장합니다.**

이유:
- ✅ 설정이 간단함
- ✅ API 키 불필요
- ✅ 쓰기 작업 가능
- ✅ 무료
- ✅ 서버 불필요

## 🔒 API 키 보안

⚠️ **API 키를 공개 저장소에 업로드하지 마세요!**

- `.gitignore`에 추가:
  ```
  *.env
  *-key.json
  ```

- 환경 변수로 관리:
  ```javascript
  const API_KEY = process.env.GOOGLE_API_KEY;
  ```

## 🚀 다음 단계

1. **Google Apps Script 방법 사용** (현재 구현됨)
   - `GOOGLE_SHEETS_SETUP.md` 참고

2. **서비스 계정 방법 사용** (더 안전함)
   - `GOOGLE_SHEETS_API_SETUP.md` 참고
   - API 키는 공개 API 접근에만 사용

3. **API 키로 읽기 작업만 수행**
   - `google-sheets-api-key.js` 참고

## 💡 API 키 활용 예시

API 키를 사용하여 다른 Google API를 활용할 수 있습니다:

- Google Maps API
- Google Places API
- Google Translate API
- 등등...

하지만 Google Sheets에 데이터를 저장하는 목적이라면, Google Apps Script가 가장 적합합니다.

