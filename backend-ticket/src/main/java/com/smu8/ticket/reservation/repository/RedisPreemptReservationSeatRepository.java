package com.smu8.ticket.reservation.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.List;

@Repository
public class RedisPreemptReservationSeatRepository implements PreemptReservationSeatRepository {
    private static final String PREEMPT_SEAT_KEY_PREFIX = "reservation:preempt:seat:";
    // 조회와 삭제를 Redis 안에서 한 번에 처리해 만료 직후 재선점된 좌석을 지우지 않도록 한다.
    private static final RedisScript<Long> REMOVE_OWN_PREEMPT_SCRIPT = RedisScript.of(
            "local accountId = redis.call('get', KEYS[1]) " +
                    "if not accountId then return 0 end " +
                    "if accountId == ARGV[1] then return redis.call('del', KEYS[1]) end " +
                    "return -1",
            Long.class
    );

    private final RedisTemplate<String, String> redisTicketTemplate;
    private final Duration ttl;

    public RedisPreemptReservationSeatRepository(
            @Qualifier("redisTicketTemplate")
            RedisTemplate<String, String> redisTicketTemplate,
            @Value("${reservation.preempt-seat.ttl-seconds:300}")
            long ttlSeconds
    ) {
        this.redisTicketTemplate = redisTicketTemplate;
        this.ttl = Duration.ofSeconds(ttlSeconds);
    }

    @Override
    public void createPreempt(String seatId, String accountId) throws IllegalStateException {
        Boolean created = redisTicketTemplate.opsForValue()
                .setIfAbsent(key(seatId), accountId, ttl);

        if (Boolean.TRUE.equals(created)) {
            return;
        }

        String preemptAccountId = findOwnPreemptAccountId(seatId);
        if (accountId.equals(preemptAccountId)) {
            redisTicketTemplate.expire(key(seatId), ttl);
            return;
        }

        throw new IllegalStateException("Seat is already preempted by another account.");
    }

    @Override
    public void removePreempt(String seatId) {
        redisTicketTemplate.delete(key(seatId));
        // removePreempt는 좌석만 보고 무조건 삭제하기 때문에 동시성 상황에서 남의 선점을 지울 수 있고,
        // removeOwnPreempt는 선점자까지 확인해서 자기 선점만 안전하게 해제하기위해 작성.
    }

    @Override
    // 없는 선점은 성공처럼 두고, 다른 사용자의 선점만 충돌로 판단한다.
    // removePreempt를 지우고 이것을 사용하려는 이유
    // 1. 자신의 선점만 지워야 하는 상황이라 사용하려합니다.
    // 2. 선점자를 명확히 확인해야 남의 선점을 지우지 않을 수 있어서 선점자를 확인하고 삭제가 필요하다 판단했습니다.
    // 3. 차후 프론트에서 어떤 동작으로 예매선점을 지울지가 나온다면 연결하기 쉽도록 백엔드에서 사용자의 선점만을 지워주는 api로 설계했어요
    public void removeOwnPreempt(String seatId, String accountId) {
        Long result = redisTicketTemplate.execute(
                REMOVE_OWN_PREEMPT_SCRIPT,
                List.of(key(seatId)),
                accountId
        );

        if (Long.valueOf(-1L).equals(result)) {
            throw new IllegalStateException("Seat is preempted by another account.");
        }
    }

    @Override
    public boolean existsPreempt(String seatId) {
        return Boolean.TRUE.equals(redisTicketTemplate.hasKey(key(seatId)));
    }

    @Override
    public String findOwnPreemptAccountId(String seatId) {
        return redisTicketTemplate.opsForValue().get(key(seatId));
    }

    private String key(String seatId) {
        return PREEMPT_SEAT_KEY_PREFIX + seatId;
    }
}
