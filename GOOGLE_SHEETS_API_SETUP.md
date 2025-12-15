# Google Sheets API 사용 방법

Google Sheets API를 사용하여 폼 데이터를 직접 Google Sheets에 저장하는 방법입니다.

## 📋 방법 비교

### 방법 1: Google Apps Script (현재 구현)
- ✅ 설정이 간단함
- ✅ 무료
- ✅ 서버 없이 클라이언트에서 직접 호출 가능
- ❌ URL이 노출되면 스팸 가능성

### 방법 2: Google Sheets API (서버 필요)
- ✅ 더 안전함
- ✅ 더 많은 제어 가능
- ❌ 서버가 필요함
- ❌ 설정이 복잡함

## 🚀 Google Sheets API 사용 방법

### 옵션 A: 백엔드 서버 사용 (권장)

#### 1단계: Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **라이브러리** 이동
4. "Google Sheets API" 검색 후 **사용 설정** 클릭

#### 2단계: 서비스 계정 생성

1. **API 및 서비스** > **사용자 인증 정보** 이동
2. **사용자 인증 정보 만들기** > **서비스 계정** 클릭
3. 서비스 계정 이름 입력 (예: "sheets-api-service")
4. **만들기 및 계속** 클릭
5. 역할은 선택하지 않고 **완료** 클릭

#### 3단계: 키 다운로드

1. 생성된 서비스 계정 클릭
2. **키** 탭으로 이동
3. **키 추가** > **새 키 만들기** 클릭
4. **JSON** 선택 후 **만들기** 클릭
5. 다운로드된 JSON 파일을 안전한 곳에 보관

#### 4단계: 스프레드시트 공유

1. Google Sheets 스프레드시트 열기
2. **공유** 버튼 클릭
3. 서비스 계정 이메일 주소 입력 (JSON 파일의 `client_email` 필드)
4. 권한을 **편집자**로 설정
5. **완료** 클릭

#### 5단계: 백엔드 서버 구현

**Node.js 예제:**

```javascript
// server.js
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 서비스 계정 키 파일 경로
const SERVICE_ACCOUNT_KEY = require('./service-account-key.json');
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// Google Sheets 문서 열기
async function addToSheet(data) {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  
  // 서비스 계정으로 인증
  await doc.useServiceAccountAuth({
    client_email: SERVICE_ACCOUNT_KEY.client_email,
    private_key: SERVICE_ACCOUNT_KEY.private_key,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0]; // 첫 번째 시트 사용

  // 헤더가 없으면 추가
  if (sheet.rowCount === 0) {
    await sheet.setHeaderRow([
      '제출 시간',
      '이름',
      '회사명',
      '이메일',
      '전화번호',
      '문의 유형',
      '메시지'
    ]);
  }

  // 데이터 추가
  await sheet.addRow({
    '제출 시간': new Date().toISOString(),
    '이름': data.name,
    '회사명': data.company,
    '이메일': data.email,
    '전화번호': data.phone,
    '문의 유형': data.subject,
    '메시지': data.message
  });
}

// API 엔드포인트
app.post('/api/contact', async (req, res) => {
  try {
    await addToSheet(req.body);
    res.json({ success: true, message: '데이터가 저장되었습니다.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: '저장 중 오류가 발생했습니다.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Python 예제:**

```python
# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# 서비스 계정 키 파일 경로
SERVICE_ACCOUNT_FILE = 'service-account-key.json'
SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# 인증 및 서비스 생성
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)
service = build('sheets', 'v4', credentials=credentials)

@app.route('/api/contact', methods=['POST'])
def add_contact():
    try:
        data = request.json
        
        # 데이터 준비
        values = [[
            datetime.now().isoformat(),
            data.get('name', ''),
            data.get('company', ''),
            data.get('email', ''),
            data.get('phone', ''),
            data.get('subject', ''),
            data.get('message', '')
        ]]
        
        # Google Sheets에 추가
        body = {'values': values}
        result = service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range='Sheet1!A:G',
            valueInputOption='RAW',
            body=body
        ).execute()
        
        return jsonify({
            'success': True,
            'message': '데이터가 저장되었습니다.'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=3000)
```

### 옵션 B: 클라이언트에서 직접 사용 (제한적)

클라이언트에서 직접 Google Sheets API를 사용하는 것은 보안상 권장되지 않습니다. API 키가 노출되기 때문입니다.

## 🔧 프론트엔드 코드 수정

백엔드 서버를 사용하는 경우 `script.js`를 다음과 같이 수정:

```javascript
// script.js의 GOOGLE_SCRIPT_URL 부분을 백엔드 API URL로 변경
const API_URL = 'http://localhost:3000/api/contact'; // 또는 배포된 서버 URL

// fetch 부분 수정
const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
});

const result = await response.json();
if (result.success) {
    alert('문의가 성공적으로 전송되었습니다!');
} else {
    alert('전송 중 오류가 발생했습니다.');
}
```

## 📦 필요한 패키지 설치

### Node.js
```bash
npm install express google-spreadsheet google-auth-library cors
```

### Python
```bash
pip install flask flask-cors google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

## 🔒 보안 고려사항

1. **서비스 계정 키 파일을 절대 공개 저장소에 업로드하지 마세요**
2. 환경 변수 사용:
   ```bash
   # .env 파일
   SPREADSHEET_ID=your_spreadsheet_id
   SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json
   ```
3. CORS 설정을 적절히 구성하세요
4. Rate limiting을 추가하여 스팸 방지

## 🌐 배포 옵션

### 무료 호스팅 서비스
- **Vercel** (Node.js/Serverless)
- **Netlify Functions** (Serverless)
- **Railway** (Node.js/Python)
- **Render** (Node.js/Python)

### Serverless 함수 예제 (Vercel)

```javascript
// api/contact.js (Vercel)
const { GoogleSpreadsheet } = require('google-spreadsheet');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    await sheet.addRow({
      '제출 시간': new Date().toISOString(),
      '이름': req.body.name,
      '회사명': req.body.company,
      '이메일': req.body.email,
      '전화번호': req.body.phone,
      '문의 유형': req.body.subject,
      '메시지': req.body.message
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## 💡 추천 방법

**간단한 프로젝트**: Google Apps Script (현재 구현)
**프로덕션 환경**: Google Sheets API + 백엔드 서버

## 📚 참고 자료

- [Google Sheets API 문서](https://developers.google.com/sheets/api)
- [google-spreadsheet 라이브러리](https://theoephraim.github.io/node-google-spreadsheet/)
- [Google Cloud Console](https://console.cloud.google.com/)

