package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.model.Order;
import com.shop.model.Product;
import com.shop.model.Voucher;
import com.shop.service.StorageService;
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
    private StorageService storageService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        List<Order> orders = storageService.getAllOrders();
        double totalRevenue = orders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        long productCount = storageService.getAllProducts().size();
        long pendingOrders = orders.stream().filter(o -> "PENDING".equalsIgnoreCase(o.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalOrders", orders.size());
        stats.put("pendingOrders", pendingOrders);
        stats.put("totalProducts", productCount);

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        Product saved = storageService.saveProduct(product);
        return ResponseEntity.ok(ApiResponse.ok("Tạo sản phẩm thành công!", saved));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product product) {
        product.setId(id);
        Product updated = storageService.saveProduct(product);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật sản phẩm thành công!", updated));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        storageService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa sản phẩm thành công!"));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = storageService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestParam String status) {
        var orderOpt = storageService.getAllOrders().stream().filter(o -> o.getId().equals(id)).findFirst();
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        order.setStatus(status.toUpperCase());
        storageService.saveOrder(order);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái đơn hàng thành công!", order));
    }
}
