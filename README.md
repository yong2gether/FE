## 개발 환경 세팅

- 메인 레포지토리에서 본인의 레포지토리로 fork 진행
- git clone
- 터미널을 열고 `npm install`을 입력하여 패키지를 모두 설치
- `npm run start` 명령어로 개발 서버를 실행
- 새로운 라이브러리 추가시 다시 `npm install` 입력해 설치

## 작업 방식
1. 작업할 기능에 대해 Issue 생성 (이슈 템플릿 적용되어 있으니 확인해보고 생성하면 됨 + 우측에 label까지 적용하면 좋음)
2. fork한 레포지토리에서 feat/페이지 브랜치 생성(git switch -c feat/페이지)
3. `Feat: 작업내용`으로 commit 메시지 생성, push (git commit -m "Feat:작업내용" / git push)
4. PR 보내는 경우 -> 작업하던 브랜치에서 본인이 fork한 레포지토리의 main 브랜치로 PR 1차 생성 (PR 템플릿 형식 지킬 것)
5. 해당 PR이 Issue를 해결한다면 Issue도 꼭 닫을 것. "close #이슈번호" 쓰면 Issue도 함께 닫힘 (안 닫힐 경우 수동으로 닫을 것)
6. 해당 페이지에 대해 제작이 전부다 완료된 경우: yong2gether의 main 브랜치로 PR 2차 생성
7. 팀장 코드 피드백 완료 후 merge 진행
8. merge 완료 -> fork한 레포지토리로 돌아가 pull 받고 최신화 진행
9. 다시 1번으로 돌아가 진행 
