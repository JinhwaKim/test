# OAuth 403 오류 해결 가이드

## 문제
"Access blocked: TechSemiconductor has not completed the Google verification process"
"Error 403: access_denied"

## 원인
OAuth 동의 화면이 "테스트" 모드로 설정되어 있어서, 테스트 사용자로 등록되지 않은 계정은 접근할 수 없습니다.

## 해결 방법

### 방법 1: 테스트 사용자 추가 (권장, 가장 빠름)

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택
3. **API 및 서비스** > **OAuth 동의 화면** 클릭
4. **테스트 사용자** 섹션으로 스크롤
5. **+ 사용자 추가** 클릭
6. 접근할 이메일 주소 입력:
   - `joliekjh@gmail.com` (또는 사용할 모든 이메일)
7. **추가** 클릭
8. 저장

### 방법 2: 앱을 프로덕션으로 게시 (복잡함)

1. Google Cloud Console > OAuth 동의 화면
2. **앱을 프로덕션으로 게시** 클릭
3. Google 검토 프로세스 진행 (시간 소요)
4. 승인되면 모든 사용자가 접근 가능

## 빠른 해결 (방법 1 권장)

1. https://console.cloud.google.com/apis/credentials/consent 접속
2. 프로젝트 선택
3. "테스트 사용자" 섹션에서 **+ 사용자 추가**
4. `joliekjh@gmail.com` 입력
5. 저장

## 확인

테스트 사용자 추가 후:
1. 브라우저 캐시 삭제 (선택사항)
2. 다시 `http://localhost:3000/auth/google` 접속
3. 정상적으로 로그인 가능해야 함

## 참고

- 테스트 모드에서는 최대 100명의 테스트 사용자 추가 가능
- 프로덕션 모드로 전환하면 모든 사용자가 접근 가능하지만 Google 검토 필요
- 개발/테스트 단계에서는 테스트 사용자 추가가 가장 간단함

