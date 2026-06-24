CREATE DATABASE smu8ticket;
CREATE USER admin IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON smu8ticket.* TO 'admin'@'%';

USE smu8ticket;

CREATE TABLE `account` (
    `user_id` varchar(36) PRIMARY KEY COMMENT '한글명: ID / 회원 식별자',
    `username` varchar(100) UNIQUE NOT NULL COMMENT '한글명: 로그인_ID / 로그인 화면에서 입력하는 아이디',
    `password` varchar(255) NOT NULL COMMENT '한글명: 비밀번호암호값 / 암호화된 비밀번호',
    `nickname` varchar(50) NOT NULL COMMENT '한글명: 닉네임 / 마이페이지 내정보에서 표시 및 수정',
    `admin` integer(1) NOT NULL COMMENT '한글명: 권한 / USER 또는 ADMIN',
    `member_status` varchar(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '한글명: 회원상태 / ACTIVE, WITHDRAWN 등',
    `created_at` datetime(6) NOT NULL,
    `updated_at` datetime(6) NOT NULL
);

CREATE TABLE `venue` (
    `venue_id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 공연장_ID / 공연장 식별자',
    `venue_code` varchar(30) UNIQUE NOT NULL COMMENT '한글명: 공연장코드 / 관리자 공연장 화면의 공연장 코드',
    `venue_name` varchar(100) NOT NULL COMMENT '한글명: 공연장명 / 공연장 이름',
    `address` varchar(255) NOT NULL COMMENT '한글명: 주소 / 공연장 주소',
    `operator` varchar(100) COMMENT '한글명: 운영자 / 관리자 공연장 목록의 운영자'
);

CREATE TABLE `concert` (
    `performance_id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 공연_ID / 공연 식별자',
    `performance_code` varchar(30) UNIQUE NOT NULL COMMENT '한글명: 공연코드 / 관리자 공연 상세의 공연 코드',
    `created_by_member_id` varchar(36) NOT NULL COMMENT '한글명: 등록관리자_ID / 공연을 등록한 관리자 회원',
    `updated_by_member_id` varchar(36) COMMENT '한글명: 수정관리자_ID / 공연을 마지막 수정한 관리자 회원',
    `venue_id` bigint NOT NULL COMMENT '한글명: 공연장_ID / 공연이 열리는 공연장',
    `title` varchar(200) NOT NULL COMMENT '한글명: 공연명 / 공연명 또는 아티스트명이 포함된 공연 제목',
    `performance_status` varchar(30) NOT NULL COMMENT '한글명: 공연상태 / 예매임박, 예매중, 판매종료 등',
    `running_time` varchar(50) COMMENT '한글명: 관람회차_관람시간 / 공연 상세의 관람시간',
    `age_rating` varchar(50) COMMENT '한글명: 관람등급 / 공연 상세의 관람등급',
    `description` text COMMENT '한글명: 작품설명 / 공연 상세 설명',
    `notice` text COMMENT '한글명: 공지사항 / 공연 상세 공지사항',
    `price_notice` text COMMENT '한글명: 가격정보 / 공연 상세 가격 정보',
    `card_poster_id` bigint COMMENT '한글명: 공연포스터_카드형',
    `screen_poster_id` bigint COMMENT '한글명: 공연포스터_스크린형'
);

CREATE TABLE `performanceschedule` (
    `round_id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 공연회차_ID / 공연회차 식별자',
    `performance_id` bigint UNIQUE NOT NULL COMMENT '한글명: 공연_ID / 연결 공연',
    `show_start_at` datetime NOT NULL COMMENT '한글명: 공연날짜 / 공연 날짜와 시간',
    `reservation_start_at` datetime NOT NULL COMMENT '한글명: 예매시작일시',
    `seat_column_count` integer NOT NULL COMMENT '한글명: 열크기_좌석번호',
    `seat_row_count` integer NOT NULL COMMENT '한글명: 행크기_열번호'
);

CREATE TABLE `seatgrade` (
    `seat_grade_id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 좌석등급_ID / 좌석등급 식별자',
    `performance_id` bigint NOT NULL COMMENT '한글명: 공연_ID / 연결 공연',
    `grade_name` varchar(50) NOT NULL COMMENT '한글명: 등급명 / 전석, R석, S석 등',
    `price` int NOT NULL COMMENT '한글명: 가격 / 좌석 가격',
    `color` varchar(20) COMMENT '한글명: 색상 / 좌석도 표시 색상'
);

CREATE TABLE `seat` (
    `seat_id` bigint PRIMARY KEY COMMENT '한글명: 좌석_ID',
    `round_id` bigint COMMENT '한글명: 공연회차_ID',
    `seat_grade_id` bigint NOT NULL COMMENT '한글명: 좌석등급_ID / 연결 좌석등급',
    `row_name` varchar(20) NOT NULL COMMENT '한글명: 행_위치 / 좌석 행',
    `seat_no` int NOT NULL COMMENT '한글명: 열_위치 / 좌석 번호'
);

CREATE TABLE `reservation` (
    `reservation_id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 예매_ID / 예매 식별자',
    `reservation_no` varchar(50) UNIQUE NOT NULL COMMENT '한글명: 예매번호 / 화면 표시 예매번호',
    `member_id` varchar(36) NOT NULL COMMENT '한글명: 회원_ID / 예매 회원',
    `round_id` bigint NOT NULL COMMENT '한글명: 공연회차_ID / 예매한 공연회차',
    `reservation_status` varchar(30) NOT NULL COMMENT '한글명: 예매상태 / 결제대기, 예매완료, 취소 등',
    `total_quantity` int NOT NULL COMMENT '한글명: 총수량 / 예매 좌석 수',
    `total_amount` int NOT NULL COMMENT '한글명: 총금액 / 총 결제 금액',
    `reserved_at` datetime NOT NULL COMMENT '한글명: 예매일시 / 예매 일시'
);

CREATE TABLE `reservationseat` (
    `reservation_seat_id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 예매좌석_ID / 예매좌석 식별자',
    `reservation_id` bigint NOT NULL COMMENT '한글명: 예매_ID / 연결 예매',
    `round_seat_id` bigint UNIQUE NOT NULL COMMENT '한글명: 회차별좌석_ID / 예매된 실제 좌석'
);

CREATE TABLE `cancelreservation` (
    `cancellation_id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 취소_ID / 취소 식별자',
    `reservation_id` bigint NOT NULL COMMENT '한글명: 예매_ID / 취소 대상 예매',
    `cancel_reason` text NOT NULL COMMENT '한글명: 취소사유 / 취소 사유',
    `cancel_amount` int NOT NULL COMMENT '한글명: 취소금액 / 취소 금액',
    `cancel_status` varchar(30) NOT NULL COMMENT '한글명: 취소상태 / 취소 상태',
    `canceled_at` datetime NOT NULL COMMENT '한글명: 취소일시 / 취소 일시'
);

ALTER TABLE `account` COMMENT = '영문 테이블명: user / 사용자와 관리자를 같은 테이블에서 관리.';

ALTER TABLE `venue` COMMENT = '영문 테이블명: venues / 공연 등록, 공연 상세, 관리자 공연장 관리에 사용. 공연장 검색 전용 데이터는 두지 않는다.';

ALTER TABLE `concert` COMMENT = '영문 테이블명: performances / 관리자가 직접 등록한 공연. 공연 날짜와 시간은 공연회차에서 관리.';

ALTER TABLE `performanceschedule` COMMENT = '영문 테이블명: performance_rounds / 공연의 실제 날짜와 시간.';

ALTER TABLE `seatgrade` COMMENT = '영문 테이블명: seat_grades / 공연별 좌석 등급과 가격.';

ALTER TABLE `seat` COMMENT = '영문 테이블명: seat_templates / 공연 기준 좌석 배치 원본.';

ALTER TABLE `reservation` COMMENT = '영문 테이블명: reservations / 예매 주문의 기본 정보.';

ALTER TABLE `reservationseat` COMMENT = '영문 테이블명: reservation_seats / 예매와 회차별좌석의 N:N 성격을 해소.';

ALTER TABLE `cancelreservation` COMMENT = '영문 테이블명: cancellations / 예매 취소 정보.';

-- 회원_공연_등록관리자 --
ALTER TABLE `concert` ADD CONSTRAINT `fk_concert_created_by_account` FOREIGN KEY (`created_by_member_id`) REFERENCES `account` (`user_id`);
-- 회원_공연_수정관리자 --
ALTER TABLE `concert` ADD CONSTRAINT `fk_concert_updated_by_account` FOREIGN KEY (`updated_by_member_id`) REFERENCES `account` (`user_id`);
-- 공연장_공연 --
ALTER TABLE `concert` ADD CONSTRAINT `fk_concert_venue` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`);

-- 공연_공연회차 --
ALTER TABLE `performanceschedule` ADD CONSTRAINT `fk_performance_schedule_concert` FOREIGN KEY (`performance_id`) REFERENCES `concert` (`performance_id`);

-- 공연_좌석등급 --
ALTER TABLE `seatgrade` ADD CONSTRAINT `fk_seat_grade_concert` FOREIGN KEY (`performance_id`) REFERENCES `concert` (`performance_id`);

-- 회원_예매 --
ALTER TABLE `reservation` ADD CONSTRAINT `fk_reservation_account` FOREIGN KEY (`member_id`) REFERENCES `account` (`user_id`);

-- 공연회차_예매 --
ALTER TABLE `reservation` ADD CONSTRAINT `fk_reservation_performance_schedule` FOREIGN KEY (`round_id`) REFERENCES `performanceschedule` (`round_id`);

-- 예매_예매좌석 --
ALTER TABLE `reservationseat` ADD CONSTRAINT `fk_reservation_seat_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`);

-- 예매_취소 --
ALTER TABLE `cancelreservation` ADD CONSTRAINT `fk_cancel_reservation_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`);

-- 공연회차_좌석 --
ALTER TABLE `seat` ADD CONSTRAINT `fk_seat_performance_schedule` FOREIGN KEY (`round_id`) REFERENCES `performanceschedule` (`round_id`);

-- 좌석등급_좌석 --
ALTER TABLE `seat` ADD CONSTRAINT `fk_seat_seat_grade` FOREIGN KEY (`seat_grade_id`) REFERENCES `seatgrade` (`seat_grade_id`);

