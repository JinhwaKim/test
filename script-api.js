/**
 * Google Sheets API를 사용하는 경우의 프론트엔드 코드
 * 
 * 사용 방법:
 * 1. script.js의 contactForm 부분을 이 파일의 코드로 교체
 * 2. API_URL을 백엔드 서버 URL로 변경
 */

// Contact Form Handling with Google Sheets API (Backend)
const contactForm = document.getElementById('contactForm');

// ⚠️ 중요: 백엔드 서버 URL로 변경하세요!
// 로컬 개발: http://localhost:3000/api/contact
// 프로덕션: https://your-domain.com/api/contact
const API_URL = 'http://localhost:3000/api/contact';

if (contactForm) {
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
            // 백엔드 API로 데이터 전송
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                alert('문의가 성공적으로 전송되었습니다!\n빠른 시일 내에 연락드리겠습니다.');
                contactForm.reset();
            } else {
                alert('전송 중 오류가 발생했습니다: ' + (result.message || '알 수 없는 오류'));
            }
            
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
        } catch (error) {
            console.error('전송 중 오류 발생:', error);
            alert('전송 중 오류가 발생했습니다. 네트워크 연결을 확인하고 잠시 후 다시 시도해주세요.');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

