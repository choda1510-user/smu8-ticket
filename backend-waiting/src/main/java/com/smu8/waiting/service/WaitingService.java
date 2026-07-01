package com.smu8.waiting.service;

import com.smu8.waiting.dto.command.AdmitWaitingAccountsCommand;
import com.smu8.waiting.dto.command.DeleteConcertReservationTimeCommand;
import com.smu8.waiting.dto.command.EnterWaitingQueueCommand;
import com.smu8.waiting.dto.command.LeaveWaitingQueueCommand;
import com.smu8.waiting.dto.command.RemoveActiveAccountCommand;
import com.smu8.waiting.dto.command.SaveConcertReservationTimeCommand;
import com.smu8.waiting.dto.query.ActiveAccountQuery;
import com.smu8.waiting.dto.query.ConcertReservationTimeQuery;
import com.smu8.waiting.dto.query.WaitingQueueStatusQuery;
import com.smu8.waiting.dto.result.ActiveAccountResult;
import com.smu8.waiting.dto.result.AdmitWaitingAccountsResult;
import com.smu8.waiting.dto.result.ConcertReservationTimeResult;
import com.smu8.waiting.dto.result.WaitingQueueEntryResult;
import com.smu8.waiting.dto.result.WaitingQueueStatusResult;

public interface WaitingService {
    ConcertReservationTimeResult saveConcertReservationTime(SaveConcertReservationTimeCommand command);

    ConcertReservationTimeResult getConcertReservationTime(ConcertReservationTimeQuery query);

    void deleteConcertReservationTime(DeleteConcertReservationTimeCommand command);

    WaitingQueueEntryResult enterWaitingQueue(EnterWaitingQueueCommand command);

    WaitingQueueStatusResult getWaitingQueueStatus(WaitingQueueStatusQuery query);

    AdmitWaitingAccountsResult admitWaitingAccounts(AdmitWaitingAccountsCommand command);

    ActiveAccountResult getActiveAccount(ActiveAccountQuery query);

    void leaveWaitingQueue(LeaveWaitingQueueCommand command);

    void removeActiveAccount(RemoveActiveAccountCommand command);
}
