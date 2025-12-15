/**
 * Google Apps Script 코드
 * 
 * 사용 방법:
 * 1. Google Sheets에서 새 스프레드시트 생성
 * 2. 확장 프로그램 > Apps Script 클릭
 * 3. 아래 코드를 붙여넣기
 * 4. 저장 후 배포 > 새 배포 > 웹 앱으로 배포
 * 5. 실행 사용자를 "나"로 설정하고 액세스 권한을 "모든 사용자"로 설정
 * 6. 배포 URL을 복사하여 script.js의 GOOGLE_SCRIPT_URL에 입력
 */

function doPost(e) {
  try {
    // 스프레드시트 ID를 여기에 입력하세요
    // 스프레드시트 URL에서 /d/ 뒤의 긴 문자열이 ID입니다
    // 예: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    
    // 스프레드시트 열기
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // 받은 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 타임스탬프 추가
    const timestamp = new Date();
    
    // 데이터를 행으로 추가
    sheet.appendRow([
      timestamp,                    // A열: 제출 시간
      data.name || '',             // B열: 이름
      data.company || '',          // C열: 회사명
      data.email || '',            // D열: 이메일
      data.phone || '',            // E열: 전화번호
      data.subject || '',          // F열: 문의 유형
      data.message || ''           // G열: 메시지
    ]);
    
    // 성공 응답 반환
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': '데이터가 성공적으로 저장되었습니다.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 에러 응답 반환
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 테스트용 함수 (선택사항)
 * Apps Script 편집기에서 실행하여 스프레드시트 연결이 제대로 되는지 확인
 */
function testConnection() {
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  
  // 헤더 행이 없으면 추가
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '제출 시간',
      '이름',
      '회사명',
      '이메일',
      '전화번호',
      '문의 유형',
      '메시지'
    ]);
    // 헤더 행 스타일링
    const headerRange = sheet.getRange(1, 1, 1, 7);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
  }
  
  Logger.log('연결 테스트 성공!');
}

