package com.shop.model;

public class OrderItem {
    private String productId;
    private String productName;
    private String productImage;
    private String size;
    private String color;
    private int quantity;
    private double unitPrice;

    public OrderItem() {}

    public OrderItem(String productId, String productName, String productImage, String size, String color, int quantity, double unitPrice) {
        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.size = size;
        this.color = color;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
}
