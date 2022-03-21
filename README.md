# 🤖 getudy-discord-bot
링크 자동 수집 및 이모지 리액션 디스코드 봇

![image](https://user-images.githubusercontent.com/67459853/159216574-17401cbb-95c8-417e-8948-83d11567e761.png)


## 🚀 배포
배포 링크: https://getudy-bot.herokuapp.com/

위 링크는 실제 스터디원들끼리 사용하는 페이지이므로 아래 페이지로 접속해주세요 👇

🤖 테스트 디스코드 링크: https://discord.gg/aF8BwzZtzE

🤖 테스트 관리자 페이지 링크: https://getudy-bot-test.herokuapp.com/admin

관리자 코드: BC19D3B3C9E45818C670965F21E9A65E2CB6EF2B91265DBB4BAA82124977A58D

## 🔧 기술 스택

### Frontend
`React` `styled-components`

### Backend
`Node.js` `Express.js` `MongoDB` `discord.js`

## ✏️ 주요 기능
### 링크 수집
특정 채널에서 링크를 포함한 메시지가 올라오면 링크를 자동으로 수집하여 DB에 저장

### 링크 검색, 수정, 삭제
- DB에 저장된 링크를 검색, 수정, 삭제
- 디스코드 명령어 또는 관리자 페이지에서 조작 가능

![image](https://user-images.githubusercontent.com/67459853/159218281-0ee6ce83-6b2d-4ca3-9ba4-73409ffb68e0.png)
![image](https://user-images.githubusercontent.com/67459853/159218399-fb619e90-c0ce-4f99-a11f-d02153ac22ba.png)


### 이모지 리액션
- 특정 조건을 만족하면 메시지에 이모지 반응
- 이모지 반응 조건 및 확률을 관리자 페이지에서 설정 가능

![image](https://user-images.githubusercontent.com/67459853/159218712-e9b1fea0-24fc-45b7-b095-2f5f485754d2.png)
![image](https://user-images.githubusercontent.com/67459853/159218804-2bb2a371-be2a-4409-8cea-1af5dc91aca5.png)
![image](https://user-images.githubusercontent.com/67459853/159218986-5087c12c-f5dd-47cf-897b-c46635185378.png)
![getudybot](https://user-images.githubusercontent.com/67459853/159218967-03b96afb-5d3d-4f8b-8623-b4088eca8bbb.png)


### 익명 메시지
- 봇 계정으로 메시지를 입력할 수 있음
- 관리자 페이지에서 입력 가능

![image](https://user-images.githubusercontent.com/67459853/159218850-43c05cc2-b8c6-40ee-92e9-a9e441302780.png)
