package com.smu8.ticket.auth.dto.result;

import lombok.Builder;

@Builder
public record BlacklistTokenResult(
        String accessTokenId,
        String refreshTokenId
) {
}
