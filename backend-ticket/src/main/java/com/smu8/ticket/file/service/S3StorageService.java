package com.smu8.ticket.file.service;

import com.smu8.ticket.file.config.S3StorageProperties;
import com.smu8.ticket.file.exception.StorageException;
import com.smu8.ticket.file.exception.StorageFileNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.S3Object;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

// IAM Role(인스턴스 프로필)로 인증하므로 별도 access key/secret은 설정하지 않는다.
// getUrl()은 CDN 도메인을 반환하고, loadAsResource()는 CDN을 거치지 않는 경로를 위한 폴백이다.
@Profile("prod")
@Service
public class S3StorageService implements StorageService {

    private final S3Client s3Client;
    private final String bucket;
    private final String cdnUrl;

    @Autowired
    public S3StorageService(S3StorageProperties properties, @Value("${spring.storage.url}") String cdnUrl) {
        if (properties.getBucket() == null || properties.getBucket().trim().isEmpty()) {
            throw new StorageException("S3 bucket name cannot be empty");
        }
        this.bucket = properties.getBucket();
        this.cdnUrl = cdnUrl;
        this.s3Client = S3Client.builder()
                .region(Region.of(properties.getRegion()))
                .build();
    }

    @Override
    public void init() {
        try {
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
        } catch (S3Exception e) {
            throw new StorageException("Could not access S3 bucket: " + bucket, e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new StorageException("Failed to store empty file.");
        }

        String key = UUID.randomUUID().toString();

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return key;
        } catch (IOException | S3Exception e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return s3Client.listObjectsV2Paginator(builder -> builder.bucket(bucket))
                    .contents()
                    .stream()
                    .map(S3Object::key)
                    .map(Paths::get);
        } catch (S3Exception e) {
            throw new StorageException("Failed to read stored files", e);
        }
    }

    @Override
    public Path load(String key) {
        try {
            s3Client.headObject(HeadObjectRequest.builder().bucket(bucket).key(key).build());
            return Paths.get(key);
        } catch (NoSuchKeyException e) {
            throw new StorageFileNotFoundException("Could not read file: " + key, e);
        }
    }

    @Override
    public Resource loadAsResource(String key) {
        try {
            ResponseInputStream<GetObjectResponse> object = s3Client.getObject(
                    GetObjectRequest.builder().bucket(bucket).key(key).build());
            byte[] bytes = object.readAllBytes();
            return new ByteArrayResource(bytes) {
                @Override
                public String getFilename() {
                    return key;
                }
            };
        } catch (NoSuchKeyException e) {
            throw new StorageFileNotFoundException("Could not read file: " + key, e);
        } catch (IOException e) {
            throw new StorageException("Failed to read file: " + key, e);
        }
    }

    @Override
    public String getUrl(String key) {
        return cdnUrl + "/" + key;
    }

    @Override
    public void delete(String key) {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        } catch (S3Exception e) {
            throw new StorageException("Could not delete file: " + key, e);
        }
    }

    @Override
    public void deleteAll() {
        List<ObjectIdentifier> keys = s3Client.listObjectsV2Paginator(builder -> builder.bucket(bucket))
                .contents()
                .stream()
                .map(object -> ObjectIdentifier.builder().key(object.key()).build())
                .toList();

        if (keys.isEmpty()) {
            return;
        }

        s3Client.deleteObjects(DeleteObjectsRequest.builder()
                .bucket(bucket)
                .delete(builder -> builder.objects(keys))
                .build());
    }
}
