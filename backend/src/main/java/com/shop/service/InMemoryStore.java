package com.shop.service;

import com.shop.model.*;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryStore {
    public final Map<String, User> users = new ConcurrentHashMap<>();
    public final Map<String, Product> products = new ConcurrentHashMap<>();
    public final Map<String, Category> categories = new ConcurrentHashMap<>();
    public final Map<String, Order> orders = new ConcurrentHashMap<>();
    public final Map<String, ChatMessage> chatMessages = new ConcurrentHashMap<>();
    public final Map<String, Review> reviews = new ConcurrentHashMap<>();
    public final Map<String, Voucher> vouchers = new ConcurrentHashMap<>();

    public InMemoryStore() {
        initDefaultData();
    }

    private void initDefaultData() {
        // Users
        User admin = new User("admin", "admin@shop.com", "admin123", "Quản Trị Viên Shop", "ROLE_ADMIN");
        admin.setId("u_admin");
        users.put(admin.getId(), admin);

        User customer = new User("customer", "user@shop.com", "user123", "Nguyễn Văn Hùng", "ROLE_USER");
        customer.setId("u_customer");
        users.put(customer.getId(), customer);

        // Categories
        Category c1 = new Category("Áo Khoác", "ao-khoac", "Áo khoác bomber, denim, blazer hiện đại", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500");
        c1.setId("cat_1"); categories.put(c1.getId(), c1);

        Category c2 = new Category("Áo Hoodie", "ao-hoodie", "Hoodie & Sweatshirt phong cách Streetwear", "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500");
        c2.setId("cat_2"); categories.put(c2.getId(), c2);

        Category c3 = new Category("Áo Thun", "ao-thun", "Áo thun cotton cao cấp thoáng mát", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500");
        c3.setId("cat_3"); categories.put(c3.getId(), c3);

        Category c4 = new Category("Quần Dài", "quan-dai", "Quần Jeans, Jogger & Trousers thời thượng", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500");
        c4.setId("cat_4"); categories.put(c4.getId(), c4);

        Category c5 = new Category("Phụ Kiện", "phu-kien", "Nón, balo, túi xách & giày sneaker", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500");
        c5.setId("cat_5"); categories.put(c5.getId(), c5);

        // Vouchers
        Voucher v1 = new Voucher("WELCOME10", 10.0, 100000.0, 200000.0); v1.setId("v1"); vouchers.put(v1.getCode(), v1);
        Voucher v2 = new Voucher("SUMMER20", 20.0, 250000.0, 500000.0); v2.setId("v2"); vouchers.put(v2.getCode(), v2);

        // Products
        List<String> sizes = Arrays.asList("S", "M", "L", "XL");

        Product p1 = new Product("Áo Khoác Leather Biker Premium", "Áo khoác da cao cấp nhập khẩu, lớp lót lụa mềm mại.", 1250000.0, 1600000.0, "ao-khoac", sizes, Arrays.asList("Đen", "Nâu"), Arrays.asList("https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"), 45, true);
        p1.setId("p1"); p1.setRating(4.9); p1.setReviewCount(18); products.put(p1.getId(), p1);

        Product p2 = new Product("Áo Hoodie Streetwear Oversized Black", "Chất liệu nỉ bông 350GSM dày dặn, phom rộng chuẩn Hàn Quốc.", 490000.0, 650000.0, "ao-hoodie", sizes, Arrays.asList("Đen"), Arrays.asList("https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800"), 80, true);
        p2.setId("p2"); p2.setRating(4.8); p2.setReviewCount(32); products.put(p2.getId(), p2);

        Product p3 = new Product("Áo Thun Basic Heavyweight Cotton 100%", "Vải Cotton 250GSM định hình chống dão, cổ bo dệt kim thoải mái.", 220000.0, 290000.0, "ao-thun", sizes, Arrays.asList("Trắng", "Đen"), Arrays.asList("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"), 120, true);
        p3.setId("p3"); p3.setRating(4.7); p3.setReviewCount(45); products.put(p3.getId(), p3);

        Product p4 = new Product("Quần Jeans Slimfit Vintage Washed", "Quần Jeans xanh denim wash nhẹ phong cách vintage.", 580000.0, 750000.0, "quan-dai", sizes, Arrays.asList("Xanh Wash"), Arrays.asList("https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800"), 60, true);
        p4.setId("p4"); p4.setRating(4.9); p4.setReviewCount(24); products.put(p4.getId(), p4);
    }
}
