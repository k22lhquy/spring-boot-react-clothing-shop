package com.shop.controller;

import com.shop.dto.ApiResponse;
import com.shop.model.ChatMessage;
import com.shop.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private StorageService storageService;

    @GetMapping("/messages/{sessionId}")
    public ResponseEntity<?> getChatHistory(@PathVariable String sessionId) {
        List<ChatMessage> messages = storageService.getChatHistory(sessionId);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ChatMessage message) {
        if (message.getSessionId() == null || message.getSessionId().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("SessionId is required"));
        }

        if (message.getTimestamp() == null) {
            message.setTimestamp(new Date());
        }
        
        ChatMessage saved = storageService.saveChatMessage(message);

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
            botReply = "Bảng size chuẩn của Shop Trends:\n- Size S: 45-55kg (1m55-1m65)\n- Size M: 55-65kg (1m65-1m72)\n- Size L: 65-75kg (1m70-1m78)\n- Size XL: 75-85kg (1m75-1m85)";
        } else if (lowerMsg.contains("ship") || lowerMsg.contains("giao hàng") || lowerMsg.contains("phí")) {
            botReply = "Shop miễn phí vận chuyển (Freeship) toàn quốc cho đơn hàng từ 500.000đ. Thời gian giao hỏa tốc 1-3 ngày!";
        } else if (lowerMsg.contains("mã") || lowerMsg.contains("voucher") || lowerMsg.contains("khuyến mãi")) {
            botReply = "Mã quà tặng của bạn:\n🎟️ WELCOME10 (Giảm 10% đơn từ 200k)\n🎟️ SUMMER20 (Giảm 20% đơn từ 500k)\nNhập mã này tại bước thanh toán nhé!";
        } else if (lowerMsg.contains("đổi trả") || lowerMsg.contains("hoàn tiền")) {
            botReply = "Shop hỗ trợ đổi size/mẫu miễn phí tận nhà trong vòng 7 ngày nếu còn nguyên tem mác!";
        } else {
            botReply = "Cảm ơn bạn đã nhắn tin cho Trends! Nhân viên tư vấn sẽ liên hệ phản hồi bạn sớm nhất. Bạn có thể để lại SĐT hoặc mã đơn hàng nếu cần hỗ trợ gấp nhé.";
        }

        ChatMessage autoBotMsg = new ChatMessage(sessionId, "BOT", "Trợ Lý Trends", botReply, true);
        autoBotMsg.setTimestamp(new Date(System.currentTimeMillis() + 100));
        storageService.saveChatMessage(autoBotMsg);
    }
}
