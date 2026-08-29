package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.dto.JwtResponse;
import com.shop.dto.LoginRequest;
import com.shop.dto.RegisterRequest;
import com.shop.model.User;
import com.shop.repository.UserRepository;
import com.shop.security.JwtUtils;
import com.shop.service.InMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired(required = false)
    private UserRepository userRepository;

    @Autowired
    private InMemoryStore inMemoryStore;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng nhập đầy đủ email và mật khẩu"));
        }

        String targetEmail = loginRequest.getEmail().trim().toLowerCase();
        User user = null;

        try {
            Optional<User> userOpt = userRepository.findByEmail(targetEmail);
            if (userOpt.isPresent()) user = userOpt.get();
        } catch (Exception e) {}

        if (user == null) {
            user = inMemoryStore.users.values().stream()
                    .filter(u -> u.getEmail().trim().equalsIgnoreCase(targetEmail))
                    .findFirst().orElse(null);
        }

        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email hoặc mật khẩu không chính xác"));
        }

        boolean matches = false;
        if (user.getPassword() != null) {
            if (user.getPassword().equalsIgnoreCase(loginRequest.getPassword().trim())) {
                matches = true;
            } else {
                try {
                    matches = passwordEncoder.matches(loginRequest.getPassword().trim(), user.getPassword());
                } catch (Exception e) {}
            }
        }

        if (!matches) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email hoặc mật khẩu không chính xác"));
        }

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole(), user.getId());
        JwtResponse jwtResponse = new JwtResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getFullName(), user.getRole());

        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", jwtResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        User user = new User();
        user.setId("u_" + System.currentTimeMillis());
        user.setUsername(registerRequest.getUsername() != null ? registerRequest.getUsername() : registerRequest.getEmail());
        user.setEmail(registerRequest.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());
        user.setRole("ROLE_USER");

        try {
            userRepository.save(user);
        } catch (Exception e) {
            inMemoryStore.users.put(user.getId(), user);
        }

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole(), user.getId());
        JwtResponse jwtResponse = new JwtResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getFullName(), user.getRole());

        return ResponseEntity.ok(ApiResponse.ok("Đăng ký tài khoản thành công", jwtResponse));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable String userId) {
        try {
            var opt = userRepository.findById(userId);
            if (opt.isPresent()) return ResponseEntity.ok(ApiResponse.ok(opt.get()));
        } catch (Exception e) {}

        User u = inMemoryStore.users.get(userId);
        if (u != null) return ResponseEntity.ok(ApiResponse.ok(u));
        return ResponseEntity.notFound().build();
    }
}
