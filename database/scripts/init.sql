CREATE DATABASE smu8ticket;
CREATE USER admin IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON smu8ticket.* TO 'admin'@'%';

USE smu8ticket;

CREATE TABLE `회원` (
    `ID` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '영문명: user_id / 회원 식별자',
    `로그인_ID` varchar(100) UNIQUE NOT NULL COMMENT '영문명: login_id / 로그인 화면에서 입력하는 아이디',
    `비밀번호암호값` varchar(255) NOT NULL COMMENT '영문명: password_hash / 암호화된 비밀번호',
    `닉네임` varchar(50) NOT NULL COMMENT '영문명: nickname / 마이페이지 내정보에서 표시 및 수정',
    `권한` varchar(20) NOT NULL COMMENT '영문명: role / USER 또는 ADMIN',
    `회원상태` varchar(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '영문명: member_status / ACTIVE, WITHDRAWN 등'
);

CREATE TABLE `공연장` (
    `공연장_ID` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '영문명: venue_id / 공연장 식별자',
    `공연장코드` varchar(30) UNIQUE NOT NULL COMMENT '영문명: venue_code / 관리자 공연장 화면의 공연장 코드',
    `공연장명` varchar(100) NOT NULL COMMENT '영문명: venue_name / 공연장 이름',
    `주소` varchar(255) NOT NULL COMMENT '영문명: address / 공연장 주소',
    `운영자` varchar(100) COMMENT '영문명: operator / 관리자 공연장 목록의 운영자'
);

CREATE TABLE `공연` (
    `공연_ID` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '영문명: performance_id / 공연 식별자',
    `공연코드` varchar(30) UNIQUE NOT NULL COMMENT '영문명: performance_code / 관리자 공연 상세의 공연 코드',
    `등록관리자_ID` bigint NOT NULL COMMENT '영문명: created_by_member_id / 공연을 등록한 관리자 회원',
    `수정관리자_ID` bigint COMMENT '영문명: updated_by_member_id / 공연을 마지막 수정한 관리자 회원',
    `공연장_ID` bigint NOT NULL COMMENT '영문명: venue_id / 공연이 열리는 공연장',
    `공연명` varchar(200) NOT NULL COMMENT '영문명: title / 공연명 또는 아티스트명이 포함된 공연 제목',
    `공연상태` varchar(30) NOT NULL COMMENT '영문명: performance_status / 예매임박, 예매중, 판매종료 등',
    `관람회차_관람시간` varchar(50) COMMENT '영문명: running_time / 공연 상세의 관람시간',
    `관람등급` varchar(50) COMMENT '영문명: age_rating / 공연 상세의 관람등급',
    `작품설명` text COMMENT '영문 명: description / 공연 상세 설명',
    `공지사항` text COMMENT '영문명: notice / 공연 상세 공지사항',
    `가격정보` text COMMENT '영문명: price_notice / 공연 상세 가격 정보',
    `공연포스터_카드형` bigint,
    `공연포스터_스크린형` bigint
);

CREATE TABLE `공연회차` (
    `공연회차_ID` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '영문명: round_id / 공연회차 식별자',
    `공연_ID` bigint UNIQUE NOT NULL COMMENT '영문명: performance_id / 연결 공연',
    `공연날짜` datetime NOT NULL COMMENT '영문명: show_start_at / 공연 날짜와 시간',
    `예매시작일시` datetime NOT NULL,
    `열크기_좌석번호` integer NOT NULL,
    `행크기_열번호` integer NOT NULL
);

CREATE TABLE `좌석등급` (
    `좌석등급_ID` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '영문명: seat_grade_id / 좌석등급 식별자',
    `공연_ID` bigint NOT NULL COMMENT '영문명: performance_id / 연결 공연',
    `등급명` varchar(50) NOT NULL COMMENT '영문명: grade_name / 전석, R석, S석 등',
    `가격` int NOT NULL COMMENT '영문명: price / 좌석 가격',
    `색상` varchar(20) COMMENT '영문명: color / 좌석도 표시 색상'
);

CREATE TABLE `좌석` (
    `좌석_ID` bigint PRIMARY KEY,
    `공연회차_ID` bigint,
    `좌석등급_ID` bigint NOT NULL COMMENT '영문명: seat_grade_id / 연결 좌석등급',
    `행_위치` varchar(20) NOT NULL COMMENT '영문명: row_name / 좌석 행',
    `열_위치` int NOT NULL COMMENT '영문명: seat_no / 좌석 번호'
);

CREATE TABLE `예매` (
    `예매_ID` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '영문명: reservation_id / 예매 식별자',
    `예매번호` varchar(50) UNIQUE NOT NULL COMMENT '영문명: reservation_no / 화면 표시 예매번호',
    `회원_ID` bigint NOT NULL COMMENT '영문명: member_id / 예매 회원',
    `공연회차_ID` bigint NOT NULL COMMENT '영문명: round_id / 예매한 공연회차',
    `예매상태` varchar(30) NOT NULL COMMENT '영문명: reservation_status / 결제대기, 예매완료, 취소 등',
    `총수량` int NOT NULL COMMENT '영문명: total_quantity / 예매 좌석 수',
    `총금액` int NOT NULL COMMENT '영문명: total_amount / 총 결제 금액',
    `예매일시` datetime NOT NULL COMMENT '영문명: reserved_at / 예매 일시'
);

CREATE TABLE `예매좌석` (
    `예매좌석_ID` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '영문명: reservation_seat_id / 예매좌석 식별자',
    `예매_ID` bigint NOT NULL COMMENT '영문명: reservation_id / 연결 예매',
    `회차별좌석_ID` bigint UNIQUE NOT NULL COMMENT '영문명: round_seat_id / 예매된 실제 좌석'
);

CREATE TABLE `취소` (
    `취소_ID` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '영문명: cancellation_id / 취소 식별자',
    `예매_ID` bigint NOT NULL COMMENT '영문명: reservation_id / 취소 대상 예매',
    `취소사유` text NOT NULL COMMENT '영문명: cancel_reason / 취소 사유',
    `취소금액` int NOT NULL COMMENT '영문명: cancel_amount / 취소 금액',
    `취소상태` varchar(30) NOT NULL COMMENT '영문명: cancel_status / 취소 상태',
    `취소일시` datetime NOT NULL COMMENT '영문명: canceled_at / 취소 일시'
);

ALTER TABLE `회원` COMMENT = '영문 테이블명: user / 사용자와 관리자를 같은 테이블에서 관리.';

ALTER TABLE `공연장` COMMENT = '영문 테이블명: venues / 공연 등록, 공연 상세, 관리자 공연장 관리에 사용. 공연장 검색 전용 데이터는 두지 않는다.';

ALTER TABLE `공연` COMMENT = '영문 테이블명: performances / 관리자가 직접 등록한 공연. 공연 날짜와 시간은 공연회차에서 관리.';

ALTER TABLE `공연회차` COMMENT = '영문 테이블명: performance_rounds / 공연의 실제 날짜와 시간.';

ALTER TABLE `좌석등급` COMMENT = '영문 테이블명: seat_grades / 공연별 좌석 등급과 가격.';

ALTER TABLE `좌석` COMMENT = '영문 테이블명: seat_templates / 공연 기준 좌석 배치 원본.';

ALTER TABLE `예매` COMMENT = '영문 테이블명: reservations / 예매 주문의 기본 정보.';

ALTER TABLE `예매좌석` COMMENT = '영문 테이블명: reservation_seats / 예매와 회차별좌석의 N:N 성격을 해소.';

ALTER TABLE `취소` COMMENT = '영문 테이블명: cancellations / 예매 취소 정보.';

ALTER TABLE `공연` ADD CONSTRAINT `회원_공연_등록관리자` FOREIGN KEY (`등록관리자_ID`) REFERENCES `회원` (`ID`);

ALTER TABLE `공연` ADD CONSTRAINT `회원_공연_수정관리자` FOREIGN KEY (`수정관리자_ID`) REFERENCES `회원` (`ID`);

ALTER TABLE `공연` ADD CONSTRAINT `공연장_공연` FOREIGN KEY (`공연장_ID`) REFERENCES `공연장` (`공연장_ID`);

ALTER TABLE `공연회차` ADD CONSTRAINT `공연_공연회차` FOREIGN KEY (`공연_ID`) REFERENCES `공연` (`공연_ID`);

ALTER TABLE `좌석등급` ADD CONSTRAINT `공연_좌석등급` FOREIGN KEY (`공연_ID`) REFERENCES `공연` (`공연_ID`);

ALTER TABLE `예매` ADD CONSTRAINT `회원_예매` FOREIGN KEY (`회원_ID`) REFERENCES `회원` (`ID`);

ALTER TABLE `예매` ADD CONSTRAINT `공연회차_예매` FOREIGN KEY (`공연회차_ID`) REFERENCES `공연회차` (`공연회차_ID`);

ALTER TABLE `예매좌석` ADD CONSTRAINT `예매_예매좌석` FOREIGN KEY (`예매_ID`) REFERENCES `예매` (`예매_ID`);

ALTER TABLE `취소` ADD CONSTRAINT `예매_취소` FOREIGN KEY (`예매_ID`) REFERENCES `예매` (`예매_ID`);

ALTER TABLE `좌석` ADD FOREIGN KEY (`공연회차_ID`) REFERENCES `공연회차` (`공연회차_ID`);

ALTER TABLE `좌석` ADD FOREIGN KEY (`좌석등급_ID`) REFERENCES `좌석등급` (`좌석등급_ID`);



