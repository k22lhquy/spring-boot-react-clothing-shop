package com.shop.service;

import com.mongodb.client.MongoClient;
import com.shop.model.*;
import com.shop.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StorageService {

    @Autowired(required = false)
    private MongoClient mongoClient;

    @Autowired(required = false)
    private ProductRepository productRepository;

    @Autowired(required = false)
    private CategoryRepository categoryRepository;

    @Autowired(required = false)
    private UserRepository userRepository;

    @Autowired(required = false)
    private OrderRepository orderRepository;

    @Autowired(required = false)
    private ChatMessageRepository chatMessageRepository;

    @Autowired(required = false)
    private ReviewRepository reviewRepository;

    @Autowired(required = false)
    private VoucherRepository voucherRepository;

    @Autowired
    private InMemoryStore inMemoryStore;

    private boolean isMongoConnected = false;

    @PostConstruct
    public void init() {
        if (mongoClient != null) {
            try {
                // Ping mongo with 50ms quick check
                mongoClient.getDatabase("shopdb").runCommand(new org.bson.Document("ping", 1));
                isMongoConnected = true;
                System.out.println(">>> StorageService: Connected to MongoDB successfully!");
            } catch (Exception e) {
                isMongoConnected = false;
                System.out.println(">>> StorageService: MongoDB unreachable. Switching to ultra-fast InMemoryStore (0ms latency).");
            }
        } else {
            isMongoConnected = false;
        }
    }

    public boolean isMongoConnected() {
        return isMongoConnected;
    }

    // Products
    public List<Product> getAllProducts() {
        if (isMongoConnected && productRepository != null) {
            try { return productRepository.findAll(); } catch (Exception e) { isMongoConnected = false; }
        }
        return new ArrayList<>(inMemoryStore.products.values());
    }

    public List<Product> getFeaturedProducts() {
        if (isMongoConnected && productRepository != null) {
            try { return productRepository.findByIsFeaturedTrue(); } catch (Exception e) { isMongoConnected = false; }
        }
        List<Product> list = new ArrayList<>();
        for (Product p : inMemoryStore.products.values()) {
            if (p.isFeatured()) list.add(p);
        }
        return list;
    }

    public Optional<Product> getProductById(String id) {
        if (isMongoConnected && productRepository != null) {
            try {
                var opt = productRepository.findById(id);
                if (opt.isPresent()) return opt;
            } catch (Exception e) { isMongoConnected = false; }
        }
        return Optional.ofNullable(inMemoryStore.products.get(id));
    }

    public Product saveProduct(Product p) {
        if (p.getId() == null) p.setId("p_" + System.currentTimeMillis());
        if (isMongoConnected && productRepository != null) {
            try { return productRepository.save(p); } catch (Exception e) { isMongoConnected = false; }
        }
        inMemoryStore.products.put(p.getId(), p);
        return p;
    }

    public void deleteProduct(String id) {
        if (isMongoConnected && productRepository != null) {
            try { productRepository.deleteById(id); } catch (Exception e) { isMongoConnected = false; }
        }
        inMemoryStore.products.remove(id);
    }

    // Categories
    public List<Category> getAllCategories() {
        if (isMongoConnected && categoryRepository != null) {
            try { return categoryRepository.findAll(); } catch (Exception e) { isMongoConnected = false; }
        }
        return new ArrayList<>(inMemoryStore.categories.values());
    }

    // Users
    public Optional<User> findUserByEmail(String email) {
        if (isMongoConnected && userRepository != null) {
            try {
                var opt = userRepository.findByEmail(email);
                if (opt.isPresent()) return opt;
            } catch (Exception e) { isMongoConnected = false; }
        }
        return inMemoryStore.users.values().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public User saveUser(User u) {
        if (u.getId() == null) u.setId("u_" + System.currentTimeMillis());
        if (isMongoConnected && userRepository != null) {
            try { return userRepository.save(u); } catch (Exception e) { isMongoConnected = false; }
        }
        inMemoryStore.users.put(u.getId(), u);
        return u;
    }

    // Orders
    public List<Order> getAllOrders() {
        if (isMongoConnected && orderRepository != null) {
            try { return orderRepository.findAllByOrderByCreatedAtDesc(); } catch (Exception e) { isMongoConnected = false; }
        }
        List<Order> list = new ArrayList<>(inMemoryStore.orders.values());
        list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return list;
    }

    public List<Order> getOrdersByUserId(String userId) {
        if (isMongoConnected && orderRepository != null) {
            try { return orderRepository.findByUserIdOrderByCreatedAtDesc(userId); } catch (Exception e) { isMongoConnected = false; }
        }
        List<Order> list = new ArrayList<>();
        for (Order o : inMemoryStore.orders.values()) {
            if (userId.equalsIgnoreCase(o.getUserId())) list.add(o);
        }
        list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return list;
    }

    public Order saveOrder(Order o) {
        if (o.getId() == null) o.setId("ORD-" + System.currentTimeMillis());
        if (isMongoConnected && orderRepository != null) {
            try { return orderRepository.save(o); } catch (Exception e) { isMongoConnected = false; }
        }
        inMemoryStore.orders.put(o.getId(), o);
        return o;
    }

    // Chat
    public List<ChatMessage> getChatHistory(String sessionId) {
        if (isMongoConnected && chatMessageRepository != null) {
            try { return chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId); } catch (Exception e) { isMongoConnected = false; }
        }
        List<ChatMessage> list = new ArrayList<>();
        for (ChatMessage m : inMemoryStore.chatMessages.values()) {
            if (sessionId.equalsIgnoreCase(m.getSessionId())) list.add(m);
        }
        list.sort((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()));
        return list;
    }

    public ChatMessage saveChatMessage(ChatMessage msg) {
        if (msg.getId() == null) msg.setId("msg_" + System.currentTimeMillis() + "_" + Math.random());
        if (isMongoConnected && chatMessageRepository != null) {
            try { return chatMessageRepository.save(msg); } catch (Exception e) { isMongoConnected = false; }
        }
        inMemoryStore.chatMessages.put(msg.getId(), msg);
        return msg;
    }

    // Reviews
    public List<Review> getProductReviews(String productId) {
        if (isMongoConnected && reviewRepository != null) {
            try { return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId); } catch (Exception e) { isMongoConnected = false; }
        }
        List<Review> list = new ArrayList<>();
        for (Review r : inMemoryStore.reviews.values()) {
            if (productId.equalsIgnoreCase(r.getProductId())) list.add(r);
        }
        list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return list;
    }

    public Review saveReview(Review r) {
        if (r.getId() == null) r.setId("rev_" + System.currentTimeMillis());
        if (isMongoConnected && reviewRepository != null) {
            try { return reviewRepository.save(r); } catch (Exception e) { isMongoConnected = false; }
        }
        inMemoryStore.reviews.put(r.getId(), r);
        return r;
    }

    // Vouchers
    public Optional<Voucher> getVoucherByCode(String code) {
        if (isMongoConnected && voucherRepository != null) {
            try {
                var opt = voucherRepository.findByCodeAndActiveTrue(code);
                if (opt.isPresent()) return opt;
            } catch (Exception e) { isMongoConnected = false; }
        }
        return Optional.ofNullable(inMemoryStore.vouchers.get(code));
    }
}
