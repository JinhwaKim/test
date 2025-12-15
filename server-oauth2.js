/**
 * 서버 측 OAuth 2.0을 사용한 Google Sheets API 연동
 * 
 * 설치:
 * npm install express google-auth-library googleapis cors dotenv
 * 
 * 실행:
 * 1. .env 파일에 설정 추가
 * 2. node server-oauth2.js
 */

const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// 환경 변수
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/auth/callback';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyA4ZYab_5F_Jeu8eSTCabmTQisFAbacbp0';

// OAuth 2.0 클라이언트 생성
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// 인증 URL 생성
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ],
    prompt: 'consent'
  });
  res.redirect(authUrl);
});

// OAuth 콜백 처리
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // 토큰을 세션이나 데이터베이스에 저장 (실제 구현 시)
    // 여기서는 간단히 메모리에 저장
    req.app.locals.tokens = tokens;
    
    res.send(`
      <html>
        <body>
          <h1>인증 성공!</h1>
          <p>이 창을 닫고 폼을 다시 제출하세요.</p>
          <script>
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error getting token:', error);
    res.status(500).send('인증 실패');
  }
});

// Google Sheets 생성 함수
async function createSpreadsheet(tokens) {
  if (!tokens) {
    throw new Error('인증이 필요합니다.');
  }
  
  oauth2Client.setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  // 새 스프레드시트 생성
  const spreadsheet = await sheets.spreadsheets.create({
    resource: {
      properties: {
        title: 'TechSemiconductor 견적문의 데이터 - ' + new Date().toLocaleDateString('ko-KR')
      },
      sheets: [{
        properties: {
          title: '문의 데이터'
        }
      }]
    }
  });
  
  const newSpreadsheetId = spreadsheet.data.spreadsheetId;
  
  // 헤더 추가
  await sheets.spreadsheets.values.update({
    spreadsheetId: newSpreadsheetId,
    range: '문의 데이터!A1',
    valueInputOption: 'RAW',
    resource: {
      values: [[
        '제출 시간',
        '이름',
        '회사명',
        '이메일',
        '전화번호',
        '문의 유형',
        '메시지'
      ]]
    }
  });
  
  // 헤더 스타일링
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: newSpreadsheetId,
    resource: {
      requests: [{
        repeatCell: {
          range: {
            sheetId: 0,
            startRowIndex: 0,
            endRowIndex: 1
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.26, green: 0.52, blue: 0.96 },
              textFormat: {
                foregroundColor: { red: 1, green: 1, blue: 1 },
                bold: true
              }
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)'
        }
      }]
    }
  });
  
  console.log(`✅ 새 스프레드시트 생성됨: ${newSpreadsheetId}`);
  console.log(`📊 URL: https://docs.google.com/spreadsheets/d/${newSpreadsheetId}/edit`);
  
  return newSpreadsheetId;
}

// Google Sheets에 데이터 추가
async function addToSheet(data, tokens, spreadsheetId) {
  if (!tokens) {
    throw new Error('인증이 필요합니다. /auth/google로 이동하세요.');
  }
  
  oauth2Client.setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
  
  const targetSpreadsheetId = spreadsheetId || SPREADSHEET_ID;
  
  if (!targetSpreadsheetId) {
    // 스프레드시트가 없으면 생성
    const newId = await createSpreadsheet(tokens);
    // .env 파일 업데이트 (선택사항)
    return await addToSheet(data, tokens, newId);
  }
  
  // 스프레드시트 정보 가져오기 (시트 이름 확인)
  let sheetName = 'Sheet1'; // 기본값
  try {
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: targetSpreadsheetId
    });
    
    // 첫 번째 시트의 이름 가져오기
    if (spreadsheetInfo.data.sheets && spreadsheetInfo.data.sheets.length > 0) {
      sheetName = spreadsheetInfo.data.sheets[0].properties.title;
    }
  } catch (error) {
    console.log('시트 정보 가져오기 실패, 기본값 사용:', error.message);
  }
  
  // 헤더 확인 및 추가
  try {
    const headerCheck = await sheets.spreadsheets.values.get({
      spreadsheetId: targetSpreadsheetId,
      range: `${sheetName}!A1:G1`
    });
    
    if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: targetSpreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        resource: {
          values: [[
            '제출 시간',
            '이름',
            '회사명',
            '이메일',
            '전화번호',
            '문의 유형',
            '메시지'
          ]]
        }
      });
    }
  } catch (error) {
    // 시트가 없거나 다른 이름일 수 있음, 무시하고 계속 진행
    console.log('헤더 확인 중 오류 (무시됨):', error.message);
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
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: targetSpreadsheetId,
    range: `${sheetName}!A:G`,
    valueInputOption: 'RAW',
    resource: {
      values: [[
        timestamp,
        data.name || '',
        data.company || '',
        data.email || '',
        data.phone || '',
        data.subject || '',
        data.message || ''
      ]]
    }
  });
  
  return targetSpreadsheetId;
}

// API 엔드포인트
app.post('/api/contact', async (req, res) => {
  try {
    const tokens = req.app.locals.tokens;
    
    if (!tokens) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.',
        authUrl: `http://localhost:${PORT}/auth/google`
      });
    }
    
    // 데이터 검증
    const { name, email, company, message } = req.body;
    
    if (!name || !email || !company || !message) {
      return res.status(400).json({
        success: false,
        message: '모든 필수 항목을 입력해주세요.'
      });
    }
    
    // 토큰 갱신 (만료된 경우)
    oauth2Client.setCredentials(tokens);
    oauth2Client.on('tokens', (newTokens) => {
      if (newTokens.refresh_token) {
        req.app.locals.tokens.refresh_token = newTokens.refresh_token;
      }
      req.app.locals.tokens.access_token = newTokens.access_token;
    });
    
    // Google Sheets에 추가 (스프레드시트가 없으면 자동 생성)
    const spreadsheetId = await addToSheet(req.body, tokens);
    
    // 생성된 스프레드시트 ID를 응답에 포함
    res.json({
      success: true,
      message: '문의가 성공적으로 전송되었습니다!',
      spreadsheetId: spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
    });
  } catch (error) {
    console.error('Error:', error);
    
    // 토큰 만료 또는 무효한 경우
    if (error.code === 401) {
      req.app.locals.tokens = null;
      return res.status(401).json({
        success: false,
        message: '인증이 만료되었습니다. 다시 인증해주세요.',
        authUrl: `http://localhost:${PORT}/auth/google`
      });
    }
    
    res.status(500).json({
      success: false,
      message: '저장 중 오류가 발생했습니다: ' + error.message
    });
  }
});

// 인증 상태 확인
app.get('/api/auth/status', (req, res) => {
  const tokens = req.app.locals.tokens;
  res.json({
    authenticated: !!tokens,
    authUrl: tokens ? null : `http://localhost:${PORT}/auth/google`,
    spreadsheetId: SPREADSHEET_ID || null
  });
});

// Google Sheets 생성 엔드포인트
app.post('/api/create-sheet', async (req, res) => {
  try {
    const tokens = req.app.locals.tokens;
    
    if (!tokens) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.',
        authUrl: `http://localhost:${PORT}/auth/google`
      });
    }
    
    const spreadsheetId = await createSpreadsheet(tokens);
    
    res.json({
      success: true,
      spreadsheetId: spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      message: '스프레드시트가 생성되었습니다!'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: '스프레드시트 생성 중 오류가 발생했습니다: ' + error.message
    });
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Auth URL: http://localhost:${PORT}/auth/google`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/contact`);
});

