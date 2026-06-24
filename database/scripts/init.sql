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
    `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 공연장_ID / 공연장 식별자',
    `name` varchar(255) COMMENT '한글명: 공연장명 / 공연장 이름',
    `capacity` int COMMENT '한글명: 수용인원',
    `description` varchar(255) COMMENT '한글명: 공연장 설명',
    `zone_no` varchar(20) COMMENT '한글명: 우편번호',
    `road_address` varchar(500) COMMENT '한글명: 도로명주소',
    `jibun_address` varchar(500) COMMENT '한글명: 지번주소',
    `detail_address` varchar(500) COMMENT '한글명: 상세주소',
    `building_name` varchar(200) COMMENT '한글명: 건물명',
    `created_at` datetime(6) COMMENT '한글명: 생성 날짜',
    `updated_at` datetime(6) COMMENT '한글명: 마지막 수정 날짜'
);

CREATE TABLE `concert` (
    `performance_id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 공연_ID / 공연 식별자',
    `performance_code` varchar(30) UNIQUE NOT NULL COMMENT '한글명: 공연코드 / 관리자 공연 상세의 공연 코드',
    `venue_id` bigint NOT NULL COMMENT '한글명: 공연장_ID / 공연이 열리는 공연장',
    `title` varchar(200) NOT NULL COMMENT '한글명: 공연명 / 공연명 또는 아티스트명이 포함된 공연 제목',
    `performance_status` varchar(30) NOT NULL COMMENT '한글명: 공연상태 / 예매임박, 예매중, 판매종료 등',
    `running_time` varchar(50) COMMENT '한글명: 관람회차_관람시간 / 공연 상세의 관람시간',
    `description` text COMMENT '한글명: 작품설명 / 공연 상세 설명',
    `card_poster_url` varchar(256) COMMENT '한글명: 공연포스터_카드형',
    `screen_poster_url` varchar(256) COMMENT '한글명: 공연포스터_스크린형',
    `description_poster_url` varchar(256) COMMENT '한글명: 공연포스터_작품설명하단',
    `created_at` datetime(6) COMMENT '한글명: 생성 날짜',
    `updated_at` datetime(6) COMMENT '한글명: 마지막 수정 날짜'
);

CREATE TABLE `performance_schedule` (
    `round_id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 공연회차_ID / 공연회차 식별자',
    `performance_id` bigint NOT NULL COMMENT '한글명: 공연_ID / 연결 공연',
    `show_start_at` datetime NOT NULL COMMENT '한글명: 공연날짜 / 공연 날짜와 시간',
    `reservation_start_at` datetime NOT NULL COMMENT '한글명: 예매시작일시',
    `reservation_end_at` datetime not null  COMMENT  '한글명 :예매종료일시',
    `seat_column_count` integer NOT NULL COMMENT '한글명: 열크기_좌석번호',
    `seat_row_count` integer NOT NULL COMMENT '한글명: 행크기_열번호'
);

CREATE TABLE `seat_grade` (
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
    `row_index` int NOT NULL COMMENT '한글명: 행_위치 / 좌석 행',
    `column_index` int NOT NULL COMMENT '한글명: 열_위치 / 좌석 번호'
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

CREATE TABLE `reservation_seat` (
    `reservation_seat_id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '한글명: 예매좌석_ID / 예매좌석 식별자',
    `reservation_id` bigint NOT NULL COMMENT '한글명: 예매_ID / 연결 예매',
    `round_seat_id` bigint UNIQUE NOT NULL COMMENT '한글명: 회차별좌석_ID / 예매된 실제 좌석'
);

CREATE TABLE `cancel_reservation` (
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

ALTER TABLE `performance_schedule` COMMENT = '영문 테이블명: performance_rounds / 공연의 실제 날짜와 시간.';

ALTER TABLE `seat_grade` COMMENT = '영문 테이블명: seat_grades / 공연별 좌석 등급과 가격.';

ALTER TABLE `seat` COMMENT = '영문 테이블명: seat_templates / 공연 기준 좌석 배치 원본.';

ALTER TABLE `reservation` COMMENT = '영문 테이블명: reservations / 예매 주문의 기본 정보.';

ALTER TABLE `reservation_seat` COMMENT = '영문 테이블명: reservation_seats / 예매와 회차별좌석의 N:N 성격을 해소.';

ALTER TABLE `cancel_reservation` COMMENT = '영문 테이블명: cancellations / 예매 취소 정보.';
-- 공연장_공연 --
ALTER TABLE `concert` ADD CONSTRAINT `fk_concert_venue` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`id`);

-- 공연_공연회차 --
ALTER TABLE `performance_schedule` ADD CONSTRAINT `fk_performance_schedule_concert` FOREIGN KEY (`performance_id`) REFERENCES `concert` (`performance_id`);

-- 공연_좌석등급 --
ALTER TABLE `seat_grade` ADD CONSTRAINT `fk_seat_grade_concert` FOREIGN KEY (`performance_id`) REFERENCES `concert` (`performance_id`);

-- 회원_예매 --
ALTER TABLE `reservation` ADD CONSTRAINT `fk_reservation_account` FOREIGN KEY (`member_id`) REFERENCES `account` (`user_id`);

-- 공연회차_예매 --
ALTER TABLE `reservation` ADD CONSTRAINT `fk_reservation_performance_schedule` FOREIGN KEY (`round_id`) REFERENCES `performance_schedule` (`round_id`);

-- 예매_예매좌석 --
ALTER TABLE `reservation_seat` ADD CONSTRAINT `fk_reservation_seat_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`);

-- 좌석_예매좌석 --
ALTER TABLE `reservation_seat` ADD CONSTRAINT `fk_reservation_seat_seat` FOREIGN KEY (`round_seat_id`) REFERENCES `seat` (`seat_id`);

-- 예매_취소 --
ALTER TABLE `cancel_reservation` ADD CONSTRAINT `fk_cancel_reservation_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`);

-- 공연회차_좌석 --
ALTER TABLE `seat` ADD CONSTRAINT `fk_seat_performance_schedule` FOREIGN KEY (`round_id`) REFERENCES `performance_schedule` (`round_id`);

-- 좌석등급_좌석 --
ALTER TABLE `seat` ADD CONSTRAINT `fk_seat_seat_grade` FOREIGN KEY (`seat_grade_id`) REFERENCES `seat_grade` (`seat_grade_id`);

