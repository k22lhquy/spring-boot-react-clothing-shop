package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.dto.JwtResponse;
import com.shop.dto.LoginRequest;
import com.shop.dto.RegisterRequest;
import com.shop.model.User;
import com.shop.security.JwtUtils;
import com.shop.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StorageService storageService;

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
        Optional<User> userOpt = storageService.findUserByEmail(targetEmail);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email hoặc mật khẩu không chính xác"));
        }

        User user = userOpt.get();
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
        if (storageService.findUserByEmail(registerRequest.getEmail().trim()).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email này đã được sử dụng!"));
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername() != null ? registerRequest.getUsername() : registerRequest.getEmail());
        user.setEmail(registerRequest.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());
        user.setRole("ROLE_USER");

        User saved = storageService.saveUser(user);

        String token = jwtUtils.generateToken(saved.getUsername(), saved.getRole(), saved.getId());
        JwtResponse jwtResponse = new JwtResponse(token, saved.getId(), saved.getUsername(), saved.getEmail(), saved.getFullName(), saved.getRole());

        return ResponseEntity.ok(ApiResponse.ok("Đăng ký tài khoản thành công", jwtResponse));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable String userId) {
        return storageService.getAllProducts().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .map(user -> ResponseEntity.ok(ApiResponse.ok(user)))
                .orElse(ResponseEntity.notFound().build());
    }
}
