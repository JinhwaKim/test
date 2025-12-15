# Mixpanel 연동 가이드

## 📋 설정 방법

### 1단계: Mixpanel 계정 생성 및 프로젝트 생성

1. [Mixpanel](https://mixpanel.com/) 접속
2. 무료 계정 생성
3. 새 프로젝트 생성
4. 프로젝트 설정에서 **Project Token** 복사

### 2단계: 토큰 설정

1. `mixpanel-config.js` 파일 열기
2. `YOUR_MIXPANEL_TOKEN_HERE`를 실제 토큰으로 변경:
   ```javascript
   const MIXPANEL_TOKEN = '실제_토큰_여기에_입력';
   ```

### 3단계: 확인

1. 웹사이트 접속
2. 브라우저 개발자 도구 (F12) 열기
3. Console 탭에서 Mixpanel 초기화 메시지 확인
4. Mixpanel 대시보드에서 이벤트 확인 (몇 분 소요)

## 📊 추적되는 이벤트

### 자동 추적 이벤트

1. **Page Viewed** - 페이지뷰
   - `page_name`: 페이지 이름
   - `page_url`: 전체 URL
   - `page_path`: 경로

2. **Button Clicked** - 버튼 클릭
   - `button_name`: 버튼 이름 (Hero Button, CTA Button, Navigation 등)
   - `button_text`: 버튼 텍스트
   - `link_url`: 링크 URL (네비게이션의 경우)

3. **Product Filtered** - 제품 필터링
   - `category`: 필터 카테고리 (memory, system, analog, rf 등)

4. **Product Quote Requested** - 제품 견적 요청
   - `product_name`: 제품 이름
   - `category`: 제품 카테고리

5. **Form Submitted** - 폼 제출
   - `form_name`: 폼 이름
   - `form_type`: 문의 유형 (product, quote, support 등)
   - `has_product`: 제품 관련 문의 여부

## 🔧 커스텀 이벤트 추가

`script.js`에서 다음과 같이 이벤트를 추가할 수 있습니다:

```javascript
// 범용 이벤트 추적
if (typeof trackEvent === 'function') {
  trackEvent('Custom Event Name', {
    property1: 'value1',
    property2: 'value2'
  });
}

// 또는 직접 Mixpanel 사용
if (window.mixpanel && window.mixpanel.track) {
  window.mixpanel.track('Custom Event Name', {
    property1: 'value1',
    property2: 'value2'
  });
}
```

## 👤 사용자 식별

폼 제출 시 사용자 이메일로 식별:

```javascript
// contactForm 제출 성공 후
if (typeof identifyUser === 'function') {
  identifyUser(data.email, {
    name: data.name,
    company: data.company,
    phone: data.phone
  });
}
```

## 📈 Mixpanel 대시보드에서 확인

1. **Insights** - 이벤트 분석
2. **Flows** - 사용자 여정 분석
3. **Funnels** - 전환 퍼널 분석
4. **Retention** - 사용자 재방문 분석

## 💡 추천 분석

### 1. 전환 퍼널
- 홈페이지 방문 → 제품 페이지 → 제품 필터 → 견적 요청 → 폼 제출

### 2. 사용자 여정
- 어떤 페이지에서 시작하는가?
- 가장 많이 클릭하는 버튼은?
- 제품 필터 사용 패턴

### 3. 이벤트 분석
- 가장 많이 제출되는 문의 유형
- 인기 있는 제품 카테고리
- CTA 버튼 클릭률

## 🔒 개인정보 보호

- 이메일은 해시 처리하여 저장하는 것을 권장합니다
- GDPR 준수를 위해 사용자 동의를 받는 것을 고려하세요

## 📝 참고

- Mixpanel 무료 플랜: 월 20M 이벤트
- 이벤트는 실시간으로 전송됩니다
- 대시보드에서 데이터 확인까지 몇 분 소요될 수 있습니다

