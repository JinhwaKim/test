/**
 * Google Sheets API를 API 키로 사용하는 방법
 * 
 * ⚠️ 주의: API 키만으로는 Google Sheets에 쓰기 작업을 할 수 없습니다.
 * 읽기 전용 작업만 가능하며, 쓰기를 위해서는 OAuth 2.0 또는 서비스 계정이 필요합니다.
 * 
 * 이 파일은 API 키를 사용한 읽기 전용 예제입니다.
 * 쓰기 작업을 위해서는 server-example.js의 서비스 계정 방법을 사용하세요.
 */

// API 키 설정
const GOOGLE_API_KEY = 'AIzaSyA4ZYab_5F_Jeu8eSTCabmTQisFAbacbp0';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

/**
 * Google Sheets API v4를 사용하여 데이터 읽기 (예제)
 */
async function readSheetData() {
  try {
    const range = 'Sheet1!A1:G10'; // 읽을 범위
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.values) {
      console.log('Sheet data:', data.values);
      return data.values;
    } else {
      console.error('Error reading sheet:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

/**
 * ⚠️ API 키만으로는 쓰기 작업이 불가능합니다!
 * 쓰기를 위해서는 다음 중 하나가 필요합니다:
 * 1. OAuth 2.0 인증 (사용자 인증)
 * 2. 서비스 계정 (서버에서 사용)
 * 3. Google Apps Script (현재 구현된 방법)
 */

// 사용 예제
// readSheetData();

