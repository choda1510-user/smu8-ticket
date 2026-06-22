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
    public boolean isUsernameAvailable(String username) {
        return !accountRepository.existsByUsername(username);
    }

    @Override
    public boolean isNicknameAvailable(String nickname) {
        return !accountRepository.existsByNickname(nickname);
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
    public AccountDetailResult updateAccount(String id, String nickname, String password) {
        Account account = accountRepository.findById(id).orElseThrow();
        String trimmedNickname = nickname == null ? "" : nickname.trim();
        String trimmedPassword = password == null ? "" : password.trim();

        if (!trimmedNickname.isEmpty() && !trimmedNickname.equals(account.getNickname())) {
            accountRepository.findByNickname(trimmedNickname)
                    .filter(foundAccount -> !foundAccount.getId().equals(account.getId()))
                    .ifPresent(foundAccount -> {
                        throw new IllegalArgumentException("Nickname already exists.");
                    });
            account.setNickname(trimmedNickname);
        }

        if (!trimmedPassword.isEmpty()) {
            account.setPassword(passwordEncoder.encode(trimmedPassword));
        }

        return AccountDetailResult.from(accountRepository.save(account));
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
