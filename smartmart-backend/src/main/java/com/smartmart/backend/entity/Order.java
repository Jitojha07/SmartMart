package com.smartmart.backend.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // USER ID
    // =========================================================

    @Column(nullable = true)
    private Long userId;

    // =========================================================
    // CUSTOMER-WISE ORDER NUMBER
    //
    // Example:
    // User 5  -> 1, 2, 3
    // User 10 -> 1, 2
    // User 15 -> 1
    // =========================================================

    @Column(nullable = true)
    private Integer customerOrderNumber;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    @Column(length = 500)
    private String address;

    private String city;

    private String state;

    private String pincode;

    private String paymentMethod;

    private Double totalAmount;

    private String status;

    private LocalDateTime createdAt;

    @OneToMany(
        mappedBy = "order",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<OrderItem> orderItems = new ArrayList<>();


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public Order() {
    }


    // =========================================================
    // SET CREATED DATE AUTOMATICALLY
    // =========================================================

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }


    // =========================================================
    // ID
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // =========================================================
    // USER ID
    // =========================================================

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    // =========================================================
    // CUSTOMER ORDER NUMBER
    // =========================================================

    public Integer getCustomerOrderNumber() {
        return customerOrderNumber;
    }

    public void setCustomerOrderNumber(Integer customerOrderNumber) {
        this.customerOrderNumber = customerOrderNumber;
    }


    // =========================================================
    // FIRST NAME
    // =========================================================

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }


    // =========================================================
    // LAST NAME
    // =========================================================

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }


    // =========================================================
    // EMAIL
    // =========================================================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    // =========================================================
    // PHONE
    // =========================================================

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    // =========================================================
    // ADDRESS
    // =========================================================

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    // =========================================================
    // CITY
    // =========================================================

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }


    // =========================================================
    // STATE
    // =========================================================

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }


    // =========================================================
    // PINCODE
    // =========================================================

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }


    // =========================================================
    // PAYMENT METHOD
    // =========================================================

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }


    // =========================================================
    // TOTAL AMOUNT
    // =========================================================

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }


    // =========================================================
    // STATUS
    // =========================================================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    // =========================================================
    // CREATED AT
    // =========================================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    // =========================================================
    // ORDER ITEMS
    // =========================================================

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}