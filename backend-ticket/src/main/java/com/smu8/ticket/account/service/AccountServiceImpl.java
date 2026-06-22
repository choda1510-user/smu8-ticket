package com.smu8.ticket.account.service;

import com.smu8.ticket.account.dto.command.AdminAccountCommand;
import com.smu8.ticket.account.dto.result.AccountDetailResult;
import com.smu8.ticket.account.dto.command.CreateAccountCommand;
import com.smu8.ticket.account.entity.Account;
import com.smu8.ticket.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService, AccountAuthenticationService, UserDetailsService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public AccountDetailResult createAccount(CreateAccountCommand request){
        return AccountDetailResult
                .from(accountRepository
                        .save(request
                                .byId(UUID.randomUUID().toString(), passwordEncoder)));
    }
    @Override
    @Transactional
    public AccountDetailResult updateAdmin(AdminAccountCommand command) {
        Account account = accountRepository.findByUsername(command.username()).orElseThrow();
        account.setAdmin(true);
        return AccountDetailResult.from(account);
    }
    @Override
    public AccountDetailResult getByUsername(String username){
        Account account = accountRepository.findByUsername(username).orElseThrow();
        return AccountDetailResult.from(account);
    }
    @Override
    public AccountDetailResult getById(String id) {
        Account account = accountRepository.findById(id).orElseThrow();
        return AccountDetailResult.from(account);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByUsername(username).orElseThrow();
        return User.builder()
                .username(account.getUsername())
                .password(account.getPassword())
                .build();
    }
}
