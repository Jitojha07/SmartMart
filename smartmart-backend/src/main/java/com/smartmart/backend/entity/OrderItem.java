package com.smartmart.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // ORDER RELATIONSHIP
    // =========================================================

    @JsonIgnore
    @ManyToOne
    @JoinColumn(
        name = "order_id",
        nullable = false
    )
    private Order order;


    // =========================================================
    // PRODUCT INFORMATION
    // =========================================================

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private Long sellerId;

    @Column(nullable = false)
    private String productName;

    private String productImage;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double subtotal;


    // =========================================================
    // ORDER ID
    // =========================================================

    @JsonProperty("orderId")
    public Long getOrderId() {

        return order != null
                ? order.getId()
                : null;
    }


    // =========================================================
    // ORDER STATUS
    // =========================================================

    @JsonProperty("orderStatus")
    public String getOrderStatus() {

        return order != null
                ? order.getStatus()
                : null;
    }


    // =========================================================
    // ORDER DATE
    // =========================================================

    @JsonProperty("orderDate")
    public String getOrderDate() {

        if (order == null || order.getCreatedAt() == null) {
            return null;
        }

        return order.getCreatedAt().toString();
    }


    // =========================================================
    // CUSTOMER NAME
    // =========================================================

    @JsonProperty("orderName")
    public String getOrderName() {

        if (order == null) {
            return null;
        }

        String first =
                order.getFirstName() == null
                        ? ""
                        : order.getFirstName();

        String last =
                order.getLastName() == null
                        ? ""
                        : order.getLastName();

        return (first + " " + last).trim();
    }


    // =========================================================
    // CUSTOMER EMAIL
    // =========================================================

    @JsonProperty("orderEmail")
    public String getOrderEmail() {

        return order != null
                ? order.getEmail()
                : null;
    }
}