package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.model.Voucher;
import com.shop.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {

    @Autowired
    private StorageService storageService;

    @GetMapping("/validate")
    public ResponseEntity<?> validateVoucher(@RequestParam String code, @RequestParam double orderAmount) {
        Optional<Voucher> voucherOpt = storageService.getVoucherByCode(code.toUpperCase().trim());
        if (voucherOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mã giảm giá không tồn tại hoặc đã hết hạn!"));
        }

        Voucher voucher = voucherOpt.get();
        if (orderAmount < voucher.getMinOrderAmount()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    String.format("Đơn hàng tối thiểu để dùng mã này là %,.0f VNĐ", voucher.getMinOrderAmount())));
        }

        double discount = (orderAmount * voucher.getDiscountPercent()) / 100.0;
        if (voucher.getMaxDiscount() > 0 && discount > voucher.getMaxDiscount()) {
            discount = voucher.getMaxDiscount();
        }

        return ResponseEntity.ok(ApiResponse.ok("Áp dụng mã giảm giá thành công!", voucher));
    }
}
