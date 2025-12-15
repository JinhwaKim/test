# Mixpanel Project Token 찾는 방법

## 🔑 Project Token 위치

### 방법 1: 프로젝트 설정에서 찾기

1. [Mixpanel](https://mixpanel.com/)에 로그인
2. 좌측 상단에서 **프로젝트 선택** (현재 프로젝트 이름 클릭)
3. **Project Settings** (프로젝트 설정) 클릭
4. **Project Settings** 페이지에서:
   - **Project Token** 섹션 찾기
   - 토큰이 표시됩니다 (예: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
   - **Copy** 버튼 클릭하여 복사

### 방법 2: Settings 메뉴에서 찾기

1. Mixpanel 대시보드 접속
2. 우측 상단 **Settings** (⚙️ 아이콘) 클릭
3. 좌측 메뉴에서 **Project Settings** 선택
4. **Project Token** 섹션에서 토큰 확인

### 방법 3: JavaScript SDK 설치 가이드에서 찾기

1. Mixpanel 대시보드 접속
2. 좌측 메뉴에서 **Data Management** > **Integrations** 클릭
3. **JavaScript** 선택
4. 설치 가이드에서 토큰 확인

## 📋 토큰 형식

Project Token은 보통 다음과 같은 형식입니다:
- 길이: 약 32자
- 형식: 영문자와 숫자 조합
- 예: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

## ⚠️ 중요 사항

- **토큰은 공개되어도 안전합니다** (프론트엔드에서 사용)
- 하지만 **서버 측 비밀 키**는 절대 공개하지 마세요
- 토큰을 복사한 후 `mixpanel-config.js` 파일에 붙여넣으세요

## 🔧 토큰 설정 방법

토큰을 찾은 후:

1. `mixpanel-config.js` 파일 열기
2. 다음 줄을 찾기:
   ```javascript
   const MIXPANEL_TOKEN = 'YOUR_MIXPANEL_TOKEN_HERE';
   ```
3. 실제 토큰으로 변경:
   ```javascript
   const MIXPANEL_TOKEN = '여기에_실제_토큰_붙여넣기';
   ```
4. 파일 저장

## ✅ 확인 방법

토큰 설정 후:

1. 웹사이트 접속
2. 브라우저 개발자 도구 (F12) 열기
3. Console 탭 확인
4. Mixpanel 초기화 메시지 확인
5. Mixpanel 대시보드에서 이벤트 확인 (몇 분 소요)

## 🆘 토큰을 찾을 수 없는 경우

1. **프로젝트가 생성되었는지 확인**
   - 새 프로젝트를 생성해야 할 수 있습니다

2. **권한 확인**
   - 프로젝트 소유자 또는 관리자 권한이 필요합니다

3. **다른 프로젝트 확인**
   - 여러 프로젝트가 있는 경우 올바른 프로젝트를 선택했는지 확인

4. **Mixpanel 지원팀 문의**
   - 문제가 계속되면 Mixpanel 지원팀에 문의하세요

