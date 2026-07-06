import fs from "node:fs";

function generateAccounts(amount) {
    const arr =[];
    for (let i = 0; i < amount; i++) {
        arr.push({
            "username": `user${i+1}`,
            "password": "password",
            "nickname": `user${i+1}`,
        });
    }
    return arr;
}
function generateVenue() {
    return {
        "name": "venue1",
        "description": "test venue",
        "capacity": 10000,
        "zoneNo": "10001",
        "roadAddress": "서울시 테스트로 1길 01",
        "jibunAddress": "서울시 테스트동 1번지",
        "detailAddress": "2층",
        "buildingName": "아트홀 빌딩 001"
    };
}
function generateConcert(amount, venueName) {
    const rowMax = Math.ceil(Math.sqrt(amount));
    const colMax = rowMax;
    const seats = [];
    for (let i = 0; i < amount; i++) {
        seats.push({
            "seatGradeName": "S",
            "row": Math.floor(i / rowMax) + 1,
            "col": (i % colMax) + 1,
        });
    }
    
    return {
        "title": "test concert",
        "description": "test concert description",
        "runningTime": "120",
        "notice": "test concert notice",
        "venueName": venueName,
        "seatGrades": [
            { "gradeName": "VIP", "price": 150000, "color": "#8f52ff" }, { "gradeName": "R", "price": 110000, "color": "#db5fa8" }, { "gradeName": "S", "price": 80000, "color": "#2f80ed" }
        ],
        "rowMax": rowMax,
        "colMax": colMax,
        "seats": seats
    }
}
function generate(amount) {
    const accounts = generateAccounts(amount);
    const venue = generateVenue();
    const concert = generateConcert(amount, "서울 아트홀 001");

    accountsToJson(accounts);
    venueToJson(venue);
    concertToJson(concert);
}

function accountsToJson(accounts) {
    fs.writeFile('./testdata/output/smu8-ticket-accounts.json', JSON.stringify({
        "meta": {
        "name": "SMU8 Ticket 부하테스트 회원 데이터",
        "createdAt": "2026-07-01",
        "counts": {
            "accounts": accounts.length
        },
        "note": "k6 부하테스트용 회원 데이터입니다."
        },
        accounts: accounts,
    }), 'utf-8', (err) => {
        if (err) {
            console.error('파일 저장 실패', err);
            return;
        }
        console.log('파일 저장');
    });
}
function venueToJson(venue) {
    fs.writeFile('./testdata/output/smu8-ticket-venue.json', JSON.stringify({
        "meta": {
            "name": "SMU8 Ticket 테스트 공연장 데이터",
            "createdAt": "2026-07-02",
            "counts": {
            "venues": 1
            },
            "note": "소규모 기능테스트용 공연장 데이터입니다."
        },
        "venues": [
            venue
        ]
    }), 'utf-8', (err) => {
        if (err) {
            console.error('파일 저장 실패', err);
            return;
        }
        console.log('파일 저장');
    });
}
function concertToJson(concert) {
    fs.writeFile('./testdata/output/smu8-ticket-concert.json', JSON.stringify(concert), 'utf-8', (err) => {
        if (err) {
            console.error('파일 저장 실패', err);
            return;
        }
        console.log('파일 저장');
    });
}
const args = process.argv.slice(2);
generate(Number(args[0]));