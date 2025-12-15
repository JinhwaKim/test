/**
 * Mixpanel 설정 및 이벤트 추적 유틸리티
 * 
 * 사용 방법:
 * 1. Mixpanel 프로젝트에서 토큰을 가져옵니다
 * 2. 아래 MIXPANEL_TOKEN을 실제 토큰으로 변경합니다
 * 3. 이벤트 추적이 자동으로 시작됩니다
 */

// ⚠️ 중요: Mixpanel 프로젝트 토큰으로 변경하세요
const MIXPANEL_TOKEN = '951a42e2009f89c11e01ea359dac0810';

// Mixpanel 초기화
let mixpanel;
if (typeof window !== 'undefined' && window.mixpanel && MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'YOUR_MIXPANEL_TOKEN_HERE') {
  try {
    window.mixpanel.init(MIXPANEL_TOKEN, {
      debug: false, // 프로덕션에서는 false로 설정
      track_pageview: true,
      persistence: 'localStorage'
    });
    mixpanel = window.mixpanel;
    console.log('✅ Mixpanel 초기화 완료');
  } catch (error) {
    console.error('Mixpanel 초기화 오류:', error);
    mixpanel = {
      track: () => {},
      identify: () => {},
      people: {
        set: () => {}
      }
    };
  }
} else {
  // Mixpanel이 로드되지 않았거나 토큰이 설정되지 않은 경우
  if (MIXPANEL_TOKEN === 'YOUR_MIXPANEL_TOKEN_HERE') {
    console.warn('⚠️ Mixpanel 토큰이 설정되지 않았습니다. mixpanel-config.js 파일에서 토큰을 설정하세요.');
  } else if (!window.mixpanel) {
    console.warn('⚠️ Mixpanel 스크립트가 로드되지 않았습니다.');
  }
  
  // 더미 함수로 대체 (에러 방지)
  mixpanel = {
    track: () => {},
    identify: () => {},
    people: {
      set: () => {}
    }
  };
}

// 페이지뷰 추적
function trackPageView(pageName, properties = {}) {
  if (mixpanel && mixpanel.track) {
    mixpanel.track('Page Viewed', {
      page_name: pageName,
      page_url: window.location.href,
      page_path: window.location.pathname,
      ...properties
    });
  }
}

// 버튼 클릭 추적
function trackButtonClick(buttonName, properties = {}) {
  const mp = window.mixpanel || mixpanel;
  if (mp && mp.track) {
    mp.track('Button Clicked', {
      button_name: buttonName,
      ...properties
    });
  }
}

// 폼 제출 추적
function trackFormSubmit(formName, properties = {}) {
  const mp = window.mixpanel || mixpanel;
  if (mp && mp.track) {
    mp.track('Form Submitted', {
      form_name: formName,
      ...properties
    });
  }
}

// 제품 필터 추적
function trackProductFilter(category) {
  const mp = window.mixpanel || mixpanel;
  if (mp && mp.track) {
    mp.track('Product Filtered', {
      category: category
    });
  }
}

// 제품 카드 클릭 추적
function trackProductClick(productName, category) {
  const mp = window.mixpanel || mixpanel;
  if (mp && mp.track) {
    mp.track('Product Clicked', {
      product_name: productName,
      category: category
    });
  }
}

// 사용자 식별 (이메일 등)
function identifyUser(userId, properties = {}) {
  const mp = window.mixpanel || mixpanel;
  if (mp && mp.identify) {
    mp.identify(userId);
    if (mp.people && mp.people.set) {
      mp.people.set(properties);
    }
  }
}

// 사용자 속성 설정
function setUserProperties(properties) {
  const mp = window.mixpanel || mixpanel;
  if (mp && mp.people && mp.people.set) {
    mp.people.set(properties);
  }
}

// 이벤트 추적 (범용)
function trackEvent(eventName, properties = {}) {
  const mp = window.mixpanel || mixpanel;
  if (mp && mp.track) {
    mp.track(eventName, properties);
  }
}

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trackPageView,
    trackButtonClick,
    trackFormSubmit,
    trackProductFilter,
    trackProductClick,
    identifyUser,
    setUserProperties,
    trackEvent
  };
}

