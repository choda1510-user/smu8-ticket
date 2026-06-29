package com.smu8.ticket.file.service;

import com.smu8.ticket.file.exception.StorageException;
import com.smu8.ticket.file.exception.StorageFileNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

@Profile("dev")
@Service
public class RedisStorageService implements StorageService {

    private static final String FILE_KEY_PREFIX = "storage:image:";
    private static final String FILE_INDEX_KEY = "storage:image:index";
    private final String BASE_URL;

    private final RedisTemplate<String, byte[]> redisFileTemplate;
    @Autowired
    public RedisStorageService(
            @Qualifier("redisFileTemplate") RedisTemplate<String, byte[]> redisFileTemplate,
            @Value("${spring.storage.url}") String BASE_URL
    ) {
        this.redisFileTemplate = redisFileTemplate;
        this.BASE_URL = BASE_URL;
    }

    @Override
    public void init() {

    }

    @Override
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new StorageException("저장할 파일이 비어 있습니다.");
        }

        String key = UUID.randomUUID().toString();

        try {
            byte[] fileBytes = file.getBytes();

            redisFileTemplate.opsForValue().set(fileKey(key), fileBytes);
            redisFileTemplate.opsForSet().add(FILE_INDEX_KEY, key.getBytes(StandardCharsets.UTF_8));
            return key;

        } catch (IOException e) {
            throw new IllegalStateException("파일 저장 중 오류가 발생했습니다: " + key, e);
        }
    }

    @Override
    public Stream<Path> loadAll() {
        Set<byte[]> keys = redisFileTemplate.opsForSet().members(FILE_INDEX_KEY);

        if (keys == null || keys.isEmpty()) {
            return Stream.empty();
        }

        return keys.stream()
                .map((key) -> new String(key, StandardCharsets.UTF_8))
                .map(Paths::get);
    }

    @Override
    public Path load(String key) {
        String cleanKey = cleanKey(key);

        Boolean exists = redisFileTemplate.hasKey(fileKey(cleanKey));

        if (!Boolean.TRUE.equals(exists)) {
            throw new StorageFileNotFoundException("파일을 찾을 수 없습니다: " + cleanKey);
        }

        return Paths.get(cleanKey);
    }

    @Override
    public Resource loadAsResource(String key) {
        String cleanKey = cleanKey(key);

        byte[] fileBytes = redisFileTemplate.opsForValue().get(fileKey(cleanKey));

        if (fileBytes == null) {
            throw new StorageFileNotFoundException("파일을 찾을 수 없습니다: " + cleanKey);
        }

        return new ByteArrayResource(fileBytes) {
            @Override
            public String getFilename() {
                return cleanKey;
            }
        };
    }

    @Override
    public String getUrl(String key) {
        return BASE_URL + "/" + key;
    }

    @Override
    public void delete(String key) {
        String cleanKey = cleanKey(key);

        if (!redisFileTemplate.delete(fileKey(cleanKey))) {
            throw new StorageException("파일 삭제 실패");
        };
        redisFileTemplate.opsForSet().remove(FILE_INDEX_KEY, cleanKey.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public void deleteAll() {
        Set<byte[]> keys = redisFileTemplate.opsForSet().members(FILE_INDEX_KEY);

        if (keys != null && !keys.isEmpty()) {
            for (byte[] keyBytes : keys) {
                String key = new String(keyBytes, StandardCharsets.UTF_8);
                redisFileTemplate.delete(fileKey(key));
            }
        }

        redisFileTemplate.delete(FILE_INDEX_KEY);
    }

    private String fileKey(String key) {
        return FILE_KEY_PREFIX + key;
    }

    private String cleanKey(String key) {
        String cleanKey = StringUtils.cleanPath(key == null ? "" : key);

        if (!StringUtils.hasText(cleanKey)) {
            throw new IllegalArgumentException("파일 key가 비어 있습니다.");
        }

        if (cleanKey.contains("..")) {
            throw new IllegalArgumentException("상위 디렉토리 접근이 포함된 파일 key는 사용할 수 없습니다: " + cleanKey);
        }

        return cleanKey;
    }
}
