package com.smu8.waiting.http.response;

import lombok.Builder;

@Builder
public record WaitingResponse(
        // 앞에서 대기하는 사람 수
        Integer waitingPeopleCount,
        // 예상 대기 시간(초)
        Integer expectedWaitingTime,
        // 대기 종료 여부
        Boolean isEndedWaiting
) {
}
