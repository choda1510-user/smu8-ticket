# k6 load test

## 같은 좌석 동시 선점 테스트

백엔드와 Redis/MySQL 컨테이너를 먼저 실행한 뒤, 실제로 존재하는 공연/회차/좌석 ID를 넣어서 실행합니다.
기본 계정은 DB에 미리 들어간 `smu8_user_0001` ~ `smu8_user_0500`, 비밀번호 `password1234`를 사용합니다.

```powershell
& 'C:\Program Files\k6\k6.exe' run `
  -e BASE_URL=http://127.0.0.1:8080 `
  -e VUS=100 `
  -e CONCERT_ID=1 `
  -e SCHEDULE_ID=1 `
  -e SEAT_ID=1 `
  .\k6\preempt-same-seat.js
```

100, 200, 300, 400, 500명을 순서대로 테스트하려면 각 실행 전에 같은 좌석 선점 Redis key를 지우고 실행합니다.

```powershell
foreach ($vus in 100,200,300,400,500) {
  docker exec redis-ticket redis-cli DEL reservation:preempt:seat:1
  & 'C:\Program Files\k6\k6.exe' run `
    -e BASE_URL=http://127.0.0.1:8080 `
    -e VUS=$vus `
    -e CONCERT_ID=1 `
    -e SCHEDULE_ID=1 `
    -e SEAT_ID=1 `
    .\k6\preempt-same-seat.js
}
```
# 한번에 100,200,300,400,500 의 동시접속 테스트 PowerShall명령어입니다.
foreach ($vus in 100,200,300,400,500) {
& 'C:\Program Files\k6\k6.exe' run `
    -e BASE_URL=http://127.0.0.1:8080 `
-e VUS=$vus `
    -e CONCERT_ID=1 `
-e SCHEDULE_ID=1 `
    -e SEAT_ID=1 `
--summary-export ".\k6\result-vus-$vus.json" `
.\k6\preempt-same-seat.js
}



Windows에서 `redis-cli`나 Docker 컨테이너 접근이 안 되면 아래처럼 Redis에 직접 `DEL` 명령을 보낼 수 있습니다.

```powershell
$key = 'reservation:preempt:seat:1'
$client = [Net.Sockets.TcpClient]::new('192.168.0.6', 6379)
$stream = $client.GetStream()
$cmd = "*2`r`n" + '$3' + "`r`nDEL`r`n" + '$' + $key.Length + "`r`n" + $key + "`r`n"
$bytes = [Text.Encoding]::ASCII.GetBytes($cmd)
$stream.Write($bytes, 0, $bytes.Length)
$client.Close()
```

정상 기준은 `preempt_success`가 1이고, `preempt_rejected`가 `VUS - 1`인 상태입니다.
