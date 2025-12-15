/**
 * Google Sheets API를 사용하는 백엔드 서버 예제
 * 
 * 설치 방법:
 * npm install express google-spreadsheet google-auth-library cors dotenv
 * 
 * 실행 방법:
 * 1. .env 파일 생성 및 설정
 * 2. node server-example.js
 */

const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// 환경 변수에서 설정 읽기
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Google Sheets에 데이터 추가 함수
async function addToSheet(data) {
  if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_PRIVATE_KEY) {
    throw new Error('환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.');
  }

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  
  // 서비스 계정으로 인증
  await doc.useServiceAccountAuth({
    client_email: SERVICE_ACCOUNT_EMAIL,
    private_key: SERVICE_ACCOUNT_PRIVATE_KEY,
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
    
    // 헤더 스타일링 (선택사항)
    await sheet.loadCells('A1:G1');
    const headerRange = sheet.getCell(0, 0);
    // 스타일링은 google-spreadsheet의 제한으로 인해 Apps Script를 사용하는 것이 더 좋습니다
  }

  // 데이터 추가
  const timestamp = new Date().toLocaleString('ko-KR', { 
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  await sheet.addRow({
    '제출 시간': timestamp,
    '이름': data.name || '',
    '회사명': data.company || '',
    '이메일': data.email || '',
    '전화번호': data.phone || '',
    '문의 유형': data.subject || '',
    '메시지': data.message || ''
  });

  return { success: true };
}

// API 엔드포인트
app.post('/api/contact', async (req, res) => {
  try {
    // 데이터 검증
    const { name, email, company, message } = req.body;
    
    if (!name || !email || !company || !message) {
      return res.status(400).json({
        success: false,
        message: '모든 필수 항목을 입력해주세요.'
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 주소를 입력해주세요.'
      });
    }

    // Google Sheets에 추가
    await addToSheet(req.body);
    
    res.json({
      success: true,
      message: '문의가 성공적으로 전송되었습니다!'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: '저장 중 오류가 발생했습니다: ' + error.message
    });
  }
});

// Health check 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

