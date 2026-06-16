# Audit Checklist App

감사 업무에서 사용할 수 있는 간단한 체크리스트 웹앱입니다. 실제 회사명, 개인정보, 내부자료 없이 예시 수준의 점검 항목을 사용해 테스트할 수 있습니다.

## 실행 방법

별도 설치나 빌드 과정이 필요하지 않습니다.

1. 저장소를 내려받습니다.
2. `index.html` 파일을 브라우저에서 엽니다.
3. 점검 항목, 분야, 우선순위를 입력한 뒤 **추가** 버튼을 눌러 체크리스트를 관리합니다.

로컬 서버로 실행하려면 다음 명령을 사용할 수도 있습니다.

```bash
python3 -m http.server 8000
```

그다음 브라우저에서 `http://localhost:8000`에 접속합니다.

## 주요 기능

- 점검 항목 추가
- 분야 선택: 계약, 예산, 복무, 보안, 기타
- 우선순위 선택: 높음, 보통, 낮음
- 목록에서 항목명, 분야, 우선순위, 완료 여부를 한눈에 확인
- 항목명, 분야, 우선순위, 완료 여부 기준 검색
- 전체 항목 수와 완료 항목 수 상단 표시
- 항목 완료 표시 및 완료 취소
- 항목 삭제
- 브라우저 `localStorage`를 사용한 새로고침 후 목록 유지
- 새로 추가된 분야와 우선순위 정보도 `localStorage`에 함께 저장
- 외부 라이브러리 없이 HTML, CSS, JavaScript만 사용
- 공공기관 업무용 화면을 참고한 단정하고 읽기 쉬운 PC 중심 디자인

## Notes

This project uses only sample data.
Do not include confidential, personal, or company internal information.
