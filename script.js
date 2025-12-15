// Mixpanel 초기화 및 페이지뷰 추적
document.addEventListener('DOMContentLoaded', () => {
  // 페이지 이름 추출
  const pageName = document.title.replace(' - TechSemiconductor', '') || 'Home';
  
  // 페이지뷰 추적
  if (typeof trackPageView === 'function') {
    trackPageView(pageName);
  } else if (window.mixpanel && window.mixpanel.track) {
    window.mixpanel.track('Page Viewed', {
      page_name: pageName,
      page_url: window.location.href,
      page_path: window.location.pathname
    });
  }
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            
            // Mixpanel: 네비게이션 클릭 추적
            if (typeof trackButtonClick === 'function') {
                trackButtonClick('Navigation', { link_text: link.textContent, link_url: link.href });
            }
        });
    });
}

// Product Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const productCategories = document.querySelectorAll('.product-category');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            
            // Mixpanel: 제품 필터 추적
            if (typeof trackProductFilter === 'function') {
                trackProductFilter(category);
            } else if (window.mixpanel && window.mixpanel.track) {
                window.mixpanel.track('Product Filtered', { category: category });
            }

            // Show/hide product categories
            productCategories.forEach(categoryEl => {
                if (category === 'all' || categoryEl.getAttribute('data-category') === category) {
                    categoryEl.style.display = 'block';
                    setTimeout(() => {
                        categoryEl.style.opacity = '1';
                        categoryEl.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    categoryEl.style.opacity = '0';
                    categoryEl.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        categoryEl.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handling with Google Sheets API (OAuth 2.0)
const contactForm = document.getElementById('contactForm');

// 백엔드 API URL (서버가 실행 중이어야 함)
const API_URL = 'http://localhost:3000/api/contact';
const AUTH_STATUS_URL = 'http://localhost:3000/api/auth/status';

// 인증 상태 확인
async function checkAuthStatus() {
    try {
        const response = await fetch(AUTH_STATUS_URL);
        const status = await response.json();
        return status;
    } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        return { authenticated: false };
    }
}

if (contactForm) {
    // 페이지 로드 시 인증 상태 확인
    checkAuthStatus().then(status => {
        if (!status.authenticated) {
            console.log('인증이 필요합니다. 서버를 실행하고 /auth/google로 이동하세요.');
        }
    });

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
                // Mixpanel: 폼 제출 성공 추적
                const urlParams = new URLSearchParams(window.location.search);
                if (typeof trackFormSubmit === 'function') {
                    trackFormSubmit('Contact Form', {
                        form_type: data.subject || 'unknown',
                        has_product: !!urlParams.get('product')
                    });
                } else if (window.mixpanel && window.mixpanel.track) {
                    window.mixpanel.track('Form Submitted', {
                        form_name: 'Contact Form',
                        form_type: data.subject || 'unknown',
                        has_product: !!urlParams.get('product')
                    });
                }
                
                // 사용자 식별 (이메일)
                if (typeof identifyUser === 'function' && data.email) {
                    identifyUser(data.email, {
                        name: data.name,
                        company: data.company
                    });
                } else if (window.mixpanel && window.mixpanel.identify && data.email) {
                    window.mixpanel.identify(data.email);
                    if (window.mixpanel.people && window.mixpanel.people.set) {
                        window.mixpanel.people.set({
                            name: data.name,
                            company: data.company
                        });
                    }
                }
                
                let message = '문의가 성공적으로 전송되었습니다!\n빠른 시일 내에 연락드리겠습니다.';
                
                // 스프레드시트가 생성된 경우 URL 표시
                if (result.spreadsheetUrl) {
                    message += `\n\n데이터가 다음 스프레드시트에 저장되었습니다:\n${result.spreadsheetUrl}`;
                }
                
                alert(message);
                contactForm.reset();
            } else {
                // 인증이 필요한 경우
                if (result.authUrl) {
                    const shouldAuth = confirm('인증이 필요합니다. 인증 페이지로 이동하시겠습니까?');
                    if (shouldAuth) {
                        // 절대 URL로 변환
                        const authUrl = result.authUrl.startsWith('http') 
                            ? result.authUrl 
                            : `http://localhost:3000${result.authUrl}`;
                        window.open(authUrl, '_blank');
                    }
                } else {
                    alert('전송 중 오류가 발생했습니다: ' + (result.message || '알 수 없는 오류'));
                }
            }
            
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
        } catch (error) {
            console.error('전송 중 오류 발생:', error);
            alert('전송 중 오류가 발생했습니다. 서버가 실행 중인지 확인하고 잠시 후 다시 시도해주세요.\n\n서버 실행: node server-oauth2.js');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Product Card "견적 요청" Button Handler
document.querySelectorAll('.product-card .btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Redirect to contact page with product name
        window.location.href = `contact.html?product=${encodeURIComponent(productName)}`;
    });
});

// Pre-fill contact form if product parameter exists
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    
    if (product && contactForm) {
        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.value = `다음 제품에 대한 견적을 요청합니다: ${product}\n\n`;
        }
        messageField.focus();
    }
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .category-card, .product-card, .value-card, .team-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Number counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '') + 
                                 (element.textContent.includes('%') ? '%' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '') + 
                                 (element.textContent.includes('%') ? '%' : '');
        }
    };
    
    updateCounter();
};

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}


