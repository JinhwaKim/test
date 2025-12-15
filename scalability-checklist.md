# 월 100만명 접속 대비 체크리스트

## 📊 트래픽 분석
- **월 100만명** = 일일 약 **33,000명** = 시간당 약 **1,400명** = 분당 약 **23명**
- **피크 시간대** (오전 9-12시, 오후 2-5시) 고려 시 시간당 **3,000-5,000명** 가능

## ⚠️ 현재 상태의 주요 문제점

### 🔴 Critical (즉시 해결 필요)

#### 1. **서버 확장성 문제**
- ❌ 단일 Node.js 서버 인스턴스
- ❌ 로드 밸런싱 없음
- ❌ 수평 확장 불가능
- **해결책**: 
  - 클라우드 서버 (AWS, GCP, Azure) 사용
  - 로드 밸런서 추가
  - 여러 서버 인스턴스 실행

#### 2. **OAuth 토큰 관리 문제**
- ❌ 메모리에 토큰 저장 (`req.app.locals.tokens`)
- ❌ 서버 재시작 시 토큰 손실
- ❌ 여러 서버 인스턴스 간 토큰 공유 불가
- **해결책**:
  - Redis 또는 데이터베이스에 토큰 저장
  - 세션 관리 시스템 도입

#### 3. **Google Sheets API 할당량 제한**
- ⚠️ Google Sheets API 할당량:
  - **읽기**: 분당 300 요청
  - **쓰기**: 분당 300 요청
- **문제**: 분당 23명 접속 시 API 제한에 도달 가능
- **해결책**:
  - 요청 큐 시스템 구현
  - 배치 처리 (여러 요청을 모아서 한 번에 처리)
  - Google Sheets 대신 데이터베이스 사용 고려

#### 4. **정적 파일 호스팅**
- ❌ Node.js 서버에서 정적 파일 제공 (비효율적)
- **해결책**:
  - CDN 사용 (Cloudflare, AWS CloudFront)
  - 정적 파일을 별도 호스팅 (Vercel, Netlify, S3)

### 🟡 High Priority (중요)

#### 5. **데이터베이스 없음**
- ❌ 모든 데이터를 Google Sheets에 저장
- ❌ 검색, 필터링, 분석 기능 제한적
- **해결책**:
  - PostgreSQL, MySQL 등 데이터베이스 도입
  - Google Sheets는 백업/보고용으로만 사용

#### 6. **에러 처리 및 모니터링**
- ❌ 에러 로깅 시스템 없음
- ❌ 성능 모니터링 없음
- ❌ 알림 시스템 없음
- **해결책**:
  - Sentry, LogRocket 등 에러 추적 도구
  - New Relic, Datadog 등 APM 도구
  - 알림 시스템 (Slack, Email)

#### 7. **캐싱 전략 없음**
- ❌ 정적 파일 캐싱 없음
- ❌ API 응답 캐싱 없음
- **해결책**:
  - HTTP 캐싱 헤더 설정
  - Redis 캐싱
  - CDN 캐싱

#### 8. **보안 문제**
- ⚠️ CORS 설정이 모든 도메인 허용 (`cors()`)
- ⚠️ Rate limiting 없음 (DDoS 공격 취약)
- ⚠️ 입력 검증 부족
- **해결책**:
  - CORS 화이트리스트 설정
  - Rate limiting (express-rate-limit)
  - 입력 검증 강화 (Joi, express-validator)

### 🟢 Medium Priority (개선 권장)

#### 9. **비용 최적화**
- ⚠️ Google Sheets API 사용량에 따른 비용
- ⚠️ 서버 리소스 사용량
- **해결책**:
  - 서버리스 아키텍처 고려 (AWS Lambda, Vercel Functions)
  - 데이터베이스로 전환하여 비용 절감

#### 10. **성능 최적화**
- ⚠️ 이미지 최적화 없음
- ⚠️ 코드 번들링/압축 없음
- **해결책**:
  - 이미지 최적화 (WebP, 압축)
  - 코드 번들링 (Webpack, Vite)
  - Gzip/Brotli 압축

## ✅ 권장 아키텍처

### 현재 구조
```
[사용자] → [단일 Node.js 서버] → [Google Sheets]
```

### 개선된 구조
```
[사용자] 
  ↓
[CDN (Cloudflare)] → 정적 파일
  ↓
[로드 밸런서 (AWS ALB)]
  ↓
[여러 Node.js 서버 인스턴스] → [Redis (세션/캐시)]
  ↓
[데이터베이스 (PostgreSQL)] → [Google Sheets (백업)]
```

## 📋 즉시 구현해야 할 항목

### 1. Rate Limiting 추가
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // 최대 100 요청
});

app.use('/api/', limiter);
```

### 2. Redis로 토큰 저장
```javascript
const redis = require('redis');
const client = redis.createClient();

// 토큰 저장
await client.set('oauth_tokens', JSON.stringify(tokens));

// 토큰 가져오기
const tokens = JSON.parse(await client.get('oauth_tokens'));
```

### 3. 요청 큐 시스템
```javascript
const Queue = require('bull');
const sheetsQueue = new Queue('google-sheets', {
  redis: { host: 'localhost', port: 6379 }
});

// 작업 추가
sheetsQueue.add('add-row', data, {
  attempts: 3,
  backoff: 'exponential'
});
```

### 4. 데이터베이스 도입
- PostgreSQL 또는 MySQL 설치
- 데이터베이스에 먼저 저장
- Google Sheets는 배치로 동기화

### 5. 모니터링 도구 추가
- Sentry (에러 추적)
- New Relic 또는 Datadog (성능 모니터링)
- Uptime Robot (가동 시간 모니터링)

## 💰 예상 비용 (월 100만명 기준)

### 현재 구조
- 서버 호스팅: $20-50/월
- Google Sheets API: 무료 (제한 내)
- **총: $20-50/월**

### 개선된 구조
- CDN (Cloudflare): 무료 플랜
- 로드 밸런서: $20-50/월
- 서버 인스턴스 (2-3개): $50-150/월
- 데이터베이스: $20-50/월
- Redis: $10-30/월
- 모니터링: $10-30/월
- **총: $130-310/월**

## 🚀 단계별 마이그레이션 계획

### Phase 1 (즉시, 1주일)
1. ✅ Rate limiting 추가
2. ✅ CORS 화이트리스트 설정
3. ✅ 에러 로깅 추가
4. ✅ 입력 검증 강화

### Phase 2 (1개월)
1. ✅ Redis 도입 (토큰 저장)
2. ✅ 요청 큐 시스템 구현
3. ✅ 데이터베이스 도입
4. ✅ CDN 설정

### Phase 3 (2-3개월)
1. ✅ 로드 밸런서 설정
2. ✅ 여러 서버 인스턴스 실행
3. ✅ 모니터링 시스템 구축
4. ✅ 자동 스케일링 설정

## 📊 성능 목표

- **응답 시간**: < 200ms (95th percentile)
- **가동 시간**: 99.9% (월 43분 다운타임 허용)
- **동시 사용자**: 1,000명 이상 지원
- **API 처리량**: 초당 100+ 요청

## ⚠️ 위험 요소

1. **Google Sheets API 제한**: 가장 큰 병목
2. **단일 서버 장애**: 전체 서비스 중단
3. **메모리 누수**: 장기 실행 시 서버 다운
4. **DDoS 공격**: Rate limiting 없어 취약

## ✅ 체크리스트 요약

- [ ] Rate limiting 구현
- [ ] Redis 도입 (토큰 저장)
- [ ] 데이터베이스 도입
- [ ] CDN 설정
- [ ] 로드 밸런서 설정
- [ ] 여러 서버 인스턴스
- [ ] 모니터링 시스템
- [ ] 에러 로깅
- [ ] 요청 큐 시스템
- [ ] 보안 강화
- [ ] 성능 테스트
- [ ] 부하 테스트
- [ ] 백업 시스템
- [ ] 재해 복구 계획

