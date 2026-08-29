package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.dto.OrderRequest;
import com.shop.model.Order;
import com.shop.model.OrderItem;
import com.shop.model.Voucher;
import com.shop.repository.OrderRepository;
import com.shop.repository.ProductRepository;
import com.shop.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, @RequestParam(required = false) String userId) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Giỏ hàng của bạn đang trống!"));
        }

        double subtotal = 0.0;
        for (OrderItem item : request.getItems()) {
            subtotal += item.getUnitPrice() * item.getQuantity();
        }

        double discountAmount = 0.0;
        if (request.getVoucherCode() != null && !request.getVoucherCode().trim().isEmpty()) {
            var voucherOpt = voucherRepository.findByCodeAndActiveTrue(request.getVoucherCode().trim().toUpperCase());
            if (voucherOpt.isPresent()) {
                Voucher v = voucherOpt.get();
                if (subtotal >= v.getMinOrderAmount()) {
                    discountAmount = (subtotal * v.getDiscountPercent()) / 100.0;
                    if (v.getMaxDiscount() > 0 && discountAmount > v.getMaxDiscount()) {
                        discountAmount = v.getMaxDiscount();
                    }
                }
            }
        }

        double totalAmount = Math.max(0, subtotal - discountAmount);

        Order order = new Order();
        order.setUserId(userId != null ? userId : "GUEST");
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setItems(request.getItems());
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount);
        order.setVoucherCode(request.getVoucherCode());
        order.setStatus("PENDING");
        order.setCreatedAt(new Date());

        Order savedOrder = orderRepository.save(order);

        // Update product stock
        for (OrderItem item : request.getItems()) {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                int newStock = Math.max(0, product.getStockQuantity() - item.getQuantity());
                product.setStockQuantity(newStock);
                productRepository.save(product);
            });
        }

        return ResponseEntity.ok(ApiResponse.ok("Đặt hàng thành công!", savedOrder));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable String userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable String id) {
        return orderRepository.findById(id)
                .map(order -> ResponseEntity.ok(ApiResponse.ok(order)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String id) {
        var orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        if ("DELIVERED".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể hủy đơn hàng đã giao thành công"));
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
        return ResponseEntity.ok(ApiResponse.ok("Đã hủy đơn hàng thành công", order));
    }
}
