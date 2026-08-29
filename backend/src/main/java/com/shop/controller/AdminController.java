package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.model.Order;
import com.shop.model.Product;
import com.shop.model.Voucher;
import com.shop.repository.OrderRepository;
import com.shop.repository.ProductRepository;
import com.shop.repository.UserRepository;
import com.shop.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        List<Order> orders = orderRepository.findAll();
        double totalRevenue = orders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        long productCount = productRepository.count();
        long userCount = userRepository.count();
        long pendingOrders = orders.stream().filter(o -> "PENDING".equalsIgnoreCase(o.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalOrders", orders.size());
        stats.put("pendingOrders", pendingOrders);
        stats.put("totalProducts", productCount);
        stats.put("totalUsers", userCount);

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(ApiResponse.ok("Tạo sản phẩm thành công!", saved));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product product) {
        if (!productRepository.existsById(id)) return ResponseEntity.notFound().build();
        product.setId(id);
        Product updated = productRepository.save(product);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật sản phẩm thành công!", updated));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        if (!productRepository.existsById(id)) return ResponseEntity.notFound().build();
        productRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa sản phẩm thành công!"));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestParam String status) {
        var orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        order.setStatus(status.toUpperCase());
        orderRepository.save(order);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái đơn hàng thành công!", order));
    }

    @PostMapping("/vouchers")
    public ResponseEntity<?> createVoucher(@RequestBody Voucher voucher) {
        if (voucher.getCode() != null) {
            voucher.setCode(voucher.getCode().toUpperCase().trim());
        }
        Voucher saved = voucherRepository.save(voucher);
        return ResponseEntity.ok(ApiResponse.ok("Tạo mã giảm giá thành công!", saved));
    }
}
