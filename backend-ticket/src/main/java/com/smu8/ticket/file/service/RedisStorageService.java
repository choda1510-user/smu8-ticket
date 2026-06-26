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
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
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
    public void store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new StorageException("저장할 파일이 비어 있습니다.");
        }

        String filename = cleanFilename(file.getOriginalFilename());

        try {
            byte[] fileBytes = file.getBytes();

            redisFileTemplate.opsForValue().set(fileKey(filename), fileBytes);
            redisFileTemplate.opsForSet().add(FILE_INDEX_KEY, filename.getBytes());

        } catch (IOException e) {
            throw new IllegalStateException("파일 저장 중 오류가 발생했습니다: " + filename, e);
        }
    }

    @Override
    public Stream<Path> loadAll() {
        Set<byte[]> filenames = redisFileTemplate.opsForSet().members(FILE_INDEX_KEY);

        if (filenames == null || filenames.isEmpty()) {
            return Stream.empty();
        }

        return filenames.stream()
                .map(String::new)
                .map(Paths::get);
    }

    @Override
    public Path load(String filename) {
        String cleanFilename = cleanFilename(filename);

        Boolean exists = redisFileTemplate.hasKey(fileKey(cleanFilename));

        if (!Boolean.TRUE.equals(exists)) {
            throw new StorageFileNotFoundException("파일을 찾을 수 없습니다: " + cleanFilename);
        }

        return Paths.get(cleanFilename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        String cleanFilename = cleanFilename(filename);

        byte[] fileBytes = redisFileTemplate.opsForValue().get(fileKey(cleanFilename));

        if (fileBytes == null) {
            throw new StorageFileNotFoundException("파일을 찾을 수 없습니다: " + cleanFilename);
        }

        return new ByteArrayResource(fileBytes) {
            @Override
            public String getFilename() {
                return cleanFilename;
            }
        };
    }

    @Override
    public String getUrl(String filename) {
        return BASE_URL + "/" + filename;
    }

    @Override
    public void delete(String filename) {
        if (!redisFileTemplate.delete(fileKey(filename))) {
            throw new StorageException("파일 삭제 실패");
        };
    }

    @Override
    public void deleteAll() {
        Set<byte[]> filenames = redisFileTemplate.opsForSet().members(FILE_INDEX_KEY);

        if (filenames != null && !filenames.isEmpty()) {
            for (byte[] filenameBytes : filenames) {
                String filename = new String(filenameBytes);
                redisFileTemplate.delete(fileKey(filename));
            }
        }

        redisFileTemplate.delete(FILE_INDEX_KEY);
    }

    private String fileKey(String filename) {
        return FILE_KEY_PREFIX + filename;
    }

    private String cleanFilename(String filename) {
        String cleanFilename = StringUtils.cleanPath(filename == null ? "" : filename);

        if (!StringUtils.hasText(cleanFilename)) {
            throw new IllegalArgumentException("파일명이 비어 있습니다.");
        }

        if (cleanFilename.contains("..")) {
            throw new IllegalArgumentException("상위 디렉토리 접근이 포함된 파일명은 사용할 수 없습니다: " + cleanFilename);
        }

        return cleanFilename;
    }
}