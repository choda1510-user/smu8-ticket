package com.smu8.ticket.file.service;

import com.smu8.ticket.file.config.StorageProperties;
import com.smu8.ticket.file.exception.StorageException;
import com.smu8.ticket.file.exception.StorageFileNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.stream.Stream;

@Profile("!dev")
@Service
public class FileSystemStorageService implements StorageService {
    private final Path rootLocation;
    private final String BASE_URL;
    @Autowired
    public FileSystemStorageService(StorageProperties properties, @Value("${spring.storage.url}") String BASE_URL) {
        if (properties.getLocation().trim().isEmpty()) {
            throw new StorageException("File upload location cannot be empty");
        }
        this.rootLocation = Paths.get(properties.getLocation());
        this.BASE_URL = BASE_URL;
    }

    @Override
    public String store(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new StorageException("Failed to store empty file.");
            }
            String key = UUID.randomUUID().toString();
            Path destinationFile = this.rootLocation.resolve(
                            Paths.get(key))
                    .normalize().toAbsolutePath();
            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                // This is a security check
                throw new StorageException(
                        "Cannot store file outside current directory.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                        StandardCopyOption.REPLACE_EXISTING);
            }
            return key;
        }
        catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        }
        catch (IOException e) {
            throw new StorageException("Failed to read stored files", e);
        }

    }

    @Override
    public Path load(String key) {
        return rootLocation.resolve(key);
    }

    @Override
    public Resource loadAsResource(String key) {
        try {
            Path file = load(key);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
            else {
                throw new StorageFileNotFoundException(
                        "Could not read file: " + key);

            }
        }
        catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Could not read file: " + key, e);
        }
    }
    @Override
    public String getUrl(String key) {
        return BASE_URL + "/" + key;
    }

    @Override
    public void delete(String key) {
        try {
            Path file = load(key);
            if (!file.toFile().delete()) {
                throw new StorageFileNotFoundException("Could not read file: " + key);
            }
        }
        catch (UnsupportedOperationException e) {
            throw new StorageException("Could not execute operation: " + key, e);
        }
    }
    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        }
        catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }
}
