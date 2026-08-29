package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.model.Category;
import com.shop.model.Product;
import com.shop.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private StorageService storageService;

    @GetMapping("/products")
    public ResponseEntity<?> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) Boolean featured) {

        List<Product> products;

        if (featured != null && featured) {
            products = storageService.getFeaturedProducts();
        } else {
            products = storageService.getAllProducts();
            if (category != null && !category.equalsIgnoreCase("all")) {
                products = products.stream()
                        .filter(p -> category.equalsIgnoreCase(p.getCategory()))
                        .collect(Collectors.toList());
            }
            if (search != null && !search.trim().isEmpty()) {
                String s = search.trim().toLowerCase();
                products = products.stream()
                        .filter(p -> p.getName().toLowerCase().contains(s))
                        .collect(Collectors.toList());
            }
        }

        // Apply filters
        products = products.stream().filter(p -> {
            if (minPrice != null && p.getPrice() < minPrice) return false;
            if (maxPrice != null && p.getPrice() > maxPrice) return false;
            if (size != null && !size.isEmpty() && p.getSizes() != null && !p.getSizes().contains(size)) return false;
            return true;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        return storageService.getProductById(id)
                .map(product -> ResponseEntity.ok(ApiResponse.ok(product)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        List<Category> categories = storageService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }
}
