/**
 * Google Sheets를 프로그래밍 방식으로 생성하는 스크립트
 * 
 * 실행 방법:
 * 1. npm install googleapis google-auth-library
 * 2. node create-sheet.js
 */

const { google } = require('googleapis');
require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/auth/callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

async function createSpreadsheet() {
  try {
    console.log('🔐 인증 URL을 생성합니다...');
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ],
      prompt: 'consent'
    });

    console.log('\n📋 다음 URL로 이동하여 인증하세요:');
    console.log(authUrl);
    console.log('\n인증 후 리디렉션된 URL의 code 파라미터를 입력하세요:');
    
    // 실제로는 사용자가 브라우저에서 인증하고 코드를 받아야 합니다
    // 여기서는 간단한 안내만 제공
    
    return null;
  } catch (error) {
    console.error('오류:', error);
  }
}

// 직접 실행 시
if (require.main === module) {
  createSpreadsheet();
}

module.exports = { createSpreadsheet };

