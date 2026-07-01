package com.smu8.waiting.repository;

import java.util.List;
import java.util.Optional;

public interface ConcertWaitingQueueRepository {
    boolean enqueue(String concertId, String accountId, double score);

    Optional<Long> findRank(String concertId, String accountId);

    boolean contains(String concertId, String accountId);

    List<String> findWaitingAccounts(String concertId, long start, long end);

    List<String> popWaitingAccounts(String concertId, long count);

    void remove(String concertId, String accountId);

    long count(String concertId);

    void deleteByConcertId(String concertId);
}
