package com.shop.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "chat_messages")
public class ChatMessage {
    @Id
    private String id;
    private String sessionId; // Guest or User session ID
    private String senderId;
    private String senderName;
    private String message;
    private boolean isFromAdmin;
    private Date timestamp = new Date();

    public ChatMessage() {}

    public ChatMessage(String sessionId, String senderId, String senderName, String message, boolean isFromAdmin) {
        this.sessionId = sessionId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.message = message;
        this.isFromAdmin = isFromAdmin;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isFromAdmin() { return isFromAdmin; }
    public void setFromAdmin(boolean fromAdmin) { isFromAdmin = fromAdmin; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
