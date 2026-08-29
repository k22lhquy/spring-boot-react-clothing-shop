package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.model.Product;
import com.shop.model.Review;
import com.shop.repository.ProductRepository;
import com.shop.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductReviews(@PathVariable String productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        if (review.getProductId() == null || review.getRating() < 1 || review.getRating() > 5) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng đánh giá từ 1 đến 5 sao"));
        }

        review.setCreatedAt(new Date());
        Review saved = reviewRepository.save(review);

        // Update product average rating
        productRepository.findById(review.getProductId()).ifPresent(product -> {
            List<Review> allReviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(review.getProductId());
            double avgRating = allReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
            product.setRating(Math.round(avgRating * 10.0) / 10.0);
            product.setReviewCount(allReviews.size());
            productRepository.save(product);
        });

        return ResponseEntity.ok(ApiResponse.ok("Cảm ơn bạn đã gửi đánh giá!", saved));
    }
}
