package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.model.Category;
import com.shop.model.Product;
import com.shop.repository.CategoryRepository;
import com.shop.repository.ProductRepository;
import com.shop.service.InMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired(required = false)
    private ProductRepository productRepository;

    @Autowired(required = false)
    private CategoryRepository categoryRepository;

    @Autowired
    private InMemoryStore inMemoryStore;

    @GetMapping("/products")
    public ResponseEntity<?> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) Boolean featured) {

        List<Product> products;
        try {
            if (featured != null && featured) {
                products = productRepository.findByIsFeaturedTrue();
            } else if (category != null && !category.equalsIgnoreCase("all")) {
                products = productRepository.findByCategory(category);
            } else if (search != null && !search.trim().isEmpty()) {
                products = productRepository.findByNameContainingIgnoreCase(search.trim());
            } else {
                products = productRepository.findAll();
            }
        } catch (Exception e) {
            products = new ArrayList<>(inMemoryStore.products.values());
            if (featured != null && featured) {
                products = products.stream().filter(Product::isFeatured).collect(Collectors.toList());
            } else if (category != null && !category.equalsIgnoreCase("all")) {
                products = products.stream().filter(p -> category.equalsIgnoreCase(p.getCategory())).collect(Collectors.toList());
            } else if (search != null && !search.trim().isEmpty()) {
                String s = search.toLowerCase();
                products = products.stream().filter(p -> p.getName().toLowerCase().contains(s)).collect(Collectors.toList());
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
        try {
            var opt = productRepository.findById(id);
            if (opt.isPresent()) return ResponseEntity.ok(ApiResponse.ok(opt.get()));
        } catch (Exception e) {}

        Product p = inMemoryStore.products.get(id);
        if (p != null) return ResponseEntity.ok(ApiResponse.ok(p));
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        try {
            List<Category> categories = categoryRepository.findAll();
            if (!categories.isEmpty()) return ResponseEntity.ok(ApiResponse.ok(categories));
        } catch (Exception e) {}

        return ResponseEntity.ok(ApiResponse.ok(new ArrayList<>(inMemoryStore.categories.values())));
    }
}
