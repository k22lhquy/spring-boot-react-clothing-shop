package com.shop.seeder;

import com.shop.model.*;
import com.shop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired(required = false)
    private UserRepository userRepository;

    @Autowired(required = false)
    private ProductRepository productRepository;

    @Autowired(required = false)
    private CategoryRepository categoryRepository;

    @Autowired(required = false)
    private VoucherRepository voucherRepository;

    @Autowired(required = false)
    private ReviewRepository reviewRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            if (userRepository != null && userRepository.count() == 0) {
                User admin = new User("admin", "admin@shop.com", passwordEncoder.encode("admin123"), "Quản Trị Viên Shop", "ROLE_ADMIN");
                userRepository.save(admin);
            }
        } catch (Exception e) {
            System.out.println(">>> DataSeeder: MongoDB not connected, using InMemoryStore fallback.");
        }
    }
}
