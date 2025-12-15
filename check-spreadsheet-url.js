/**
 * 저장된 스프레드시트 URL 확인 스크립트
 * 
 * 실행 방법:
 * node check-spreadsheet-url.js
 */

require('dotenv').config();
const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/auth/callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

async function checkSpreadsheets() {
  try {
    // 인증이 필요합니다
    console.log('📋 저장된 스프레드시트를 확인하려면:');
    console.log('1. 서버를 실행하고 인증하세요: http://localhost:3000/auth/google');
    console.log('2. 폼을 제출하면 응답에 스프레드시트 URL이 포함됩니다');
    console.log('3. 또는 브라우저 콘솔에서 확인하세요');
    console.log('\n💡 팁: 폼 제출 후 성공 메시지에 스프레드시트 URL이 표시됩니다!');
  } catch (error) {
    console.error('오류:', error.message);
  }
}

checkSpreadsheets();

