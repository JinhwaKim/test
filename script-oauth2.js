/**
 * 클라이언트 측 OAuth 2.0을 사용한 Google Sheets API 연동
 * 
 * ⚠️ 주의: 클라이언트 측 OAuth는 보안상 권장되지 않습니다.
 * 프로덕션 환경에서는 서버 측 OAuth 또는 서비스 계정을 사용하세요.
 */

// Google OAuth 2.0 설정
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const REDIRECT_URI = window.location.origin + '/auth/callback';

// Google API 라이브러리 로드
function loadGoogleAPI() {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', resolve);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Google API 초기화
async function initGoogleAPI() {
  await loadGoogleAPI();
  
  await window.gapi.client.init({
    apiKey: 'AIzaSyA4ZYab_5F_Jeu8eSTCabmTQisFAbacbp0', // 제공받은 API 키
    clientId: GOOGLE_CLIENT_ID,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets'
  });
  
  return window.gapi.auth2.getAuthInstance();
}

// Google Sheets에 데이터 추가
async function addToSheet(data) {
  try {
    const authInstance = await initGoogleAPI();
    const isSignedIn = authInstance.isSignedIn.get();
    
    if (!isSignedIn) {
      // 로그인 요청
      await authInstance.signIn();
    }
    
    const values = [[
      new Date().toLocaleString('ko-KR'),
      data.name || '',
      data.company || '',
      data.email || '',
      data.phone || '',
      data.subject || '',
      data.message || ''
    ]];
    
    const response = await window.gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:G',
      valueInputOption: 'RAW',
      resource: {
        values: values
      }
    });
    
    return { success: true, response };
  } catch (error) {
    console.error('Error adding to sheet:', error);
    throw error;
  }
}

// Contact Form Handling with OAuth 2.0
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  // Google API 초기화 (페이지 로드 시)
  initGoogleAPI().catch(console.error);
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.company || !data.message) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '전송 중...';
    submitButton.disabled = true;

    try {
      await addToSheet(data);
      alert('문의가 성공적으로 전송되었습니다!\n빠른 시일 내에 연락드리겠습니다.');
      contactForm.reset();
    } catch (error) {
      console.error('전송 중 오류 발생:', error);
      alert('전송 중 오류가 발생했습니다: ' + error.message);
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
}

