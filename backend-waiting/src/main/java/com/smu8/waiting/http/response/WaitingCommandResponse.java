package com.smu8.waiting.http.response;

public record WaitingCommandResponse(
        boolean success
) {
    public static WaitingCommandResponse ok() {
        return new WaitingCommandResponse(true);
    }
}
