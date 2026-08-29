package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.model.Review;
import com.shop.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private StorageService storageService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductReviews(@PathVariable String productId) {
        List<Review> reviews = storageService.getProductReviews(productId);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        if (review.getProductId() == null || review.getRating() < 1 || review.getRating() > 5) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng đánh giá từ 1 đến 5 sao"));
        }

        review.setCreatedAt(new Date());
        Review saved = storageService.saveReview(review);

        // Update product rating
        storageService.getProductById(review.getProductId()).ifPresent(product -> {
            List<Review> allReviews = storageService.getProductReviews(review.getProductId());
            double avgRating = allReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
            product.setRating(Math.round(avgRating * 10.0) / 10.0);
            product.setReviewCount(allReviews.size());
            storageService.saveProduct(product);
        });

        return ResponseEntity.ok(ApiResponse.ok("Cảm ơn bạn đã gửi đánh giá!", saved));
    }
}
