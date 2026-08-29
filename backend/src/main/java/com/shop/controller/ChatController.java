package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.model.ChatMessage;
import com.shop.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @GetMapping("/messages/{sessionId}")
    public ResponseEntity<?> getChatHistory(@PathVariable String sessionId) {
        List<ChatMessage> messages = chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ChatMessage message) {
        if (message.getSessionId() == null || message.getSessionId().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("SessionId is required"));
        }

        message.setTimestamp(new Date());
        ChatMessage saved = chatMessageRepository.save(message);

        // Auto Bot response if not sent by admin
        if (!message.isFromAdmin()) {
            generateAutoResponse(message.getSessionId(), message.getMessage());
        }

        return ResponseEntity.ok(ApiResponse.ok(saved));
    }

    private void generateAutoResponse(String sessionId, String userMessage) {
        String botReply;
        String lowerMsg = userMessage.toLowerCase();

        if (lowerMsg.contains("chào") || lowerMsg.contains("hi") || lowerMsg.contains("hello")) {
            botReply = "Xin chào! Shop Trends sẵn sàng hỗ trợ bạn. Bạn đang cần tư vấn mẫu áo quần hay size nào ạ?";
        } else if (lowerMsg.contains("size") || lowerMsg.contains("kích thước") || lowerMsg.contains("đo")) {
            botReply = "Bảng size chuẩn của Shop:\n- Size S: 45-55kg (cao 1m55-1m65)\n- Size M: 55-65kg (cao 1m65-1m72)\n- Size L: 65-75kg (cao 1m70-1m78)\n- Size XL: 75-85kg (cao 1m75-1m85)";
        } else if (lowerMsg.contains("ship") || lowerMsg.contains("giao hàng") || lowerMsg.contains("phí")) {
            botReply = "Shop hỗ trợ Freeship cho đơn hàng từ 500.000đ. Thời gian giao hàng hỏa tốc 1-3 ngày toàn quốc!";
        } else if (lowerMsg.contains("mã") || lowerMsg.contains("voucher") || lowerMsg.contains("khuyến mãi")) {
            botReply = "Bạn có thể dùng mã WELCOME10 (giảm 10%) hoặc SUMMER20 (giảm 20% cho đơn từ 500k) khi thanh toán nhé!";
        } else if (lowerMsg.contains("đổi trả") || lowerMsg.contains("hoàn tiền")) {
            botReply = "Shop hỗ trợ đổi trả miễn phí trong 7 ngày đối với sản phẩm còn nguyên tem mác!";
        } else {
            botReply = "Cảm ơn bạn đã nhắn tin! Nhân viên CSKH sẽ phản hồi bạn trong chốc lát. Bạn có thể để lại SĐT hoặc mã đơn hàng nếu cần hỗ trợ nhanh hơn.";
        }

        ChatMessage autoBotMsg = new ChatMessage(sessionId, "BOT", "Shop Assistant", botReply, true);
        autoBotMsg.setTimestamp(new Date(System.currentTimeMillis() + 500));
        chatMessageRepository.save(autoBotMsg);
    }
}
