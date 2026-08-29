package com.shop.repository;

import com.shop.model.Voucher;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface VoucherRepository extends MongoRepository<Voucher, String> {
    Optional<Voucher> findByCodeAndActiveTrue(String code);
}
