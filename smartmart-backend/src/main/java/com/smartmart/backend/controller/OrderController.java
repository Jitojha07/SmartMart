package com.smartmart.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartmart.backend.entity.Order;
import com.smartmart.backend.entity.OrderItem;
import com.smartmart.backend.repository.OrderItemRepository;
import com.smartmart.backend.repository.OrderRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://smartmart-three.vercel.app",
        "https://smartmart-git-main-jit-ojhas-projects.vercel.app"
})
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OrderController(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }


    // =========================================================
    // CREATE ORDER
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody Order order) {

        try {

            // -------------------------------------------------
            // CHECK USER ID
            // -------------------------------------------------

            if (order.getUserId() == null) {

                return ResponseEntity.badRequest().body(
                        "User ID is required to create an order."
                );
            }


            // -------------------------------------------------
            // GENERATE CUSTOMER ORDER NUMBER
            // -------------------------------------------------
            //
            // Each customer has their own order numbering.
            //
            // User 1:
            // Order 1
            // Order 2
            //
            // User 2:
            // Order 1
            // Order 2
            //
            // -------------------------------------------------

            Long maxOrderNumber =
                    orderRepository.findMaxCustomerOrderNumber(
                            order.getUserId()
                    );

            Long nextOrderNumber;

            if (maxOrderNumber == null) {
                nextOrderNumber = 1L;
            } else {
                nextOrderNumber = maxOrderNumber + 1L;
            }

            order.setCustomerOrderNumber(
                    nextOrderNumber
            );


            // -------------------------------------------------
            // DEFAULT STATUS
            // -------------------------------------------------

            if (order.getStatus() == null ||
                    order.getStatus().isBlank()) {

                order.setStatus("PLACED");
            }


            // -------------------------------------------------
            // CONNECT ORDER ITEMS
            // -------------------------------------------------

            if (order.getOrderItems() != null) {

                for (OrderItem item : order.getOrderItems()) {

                    item.setOrder(order);

                    // Calculate subtotal on backend

                    if (item.getPrice() != null &&
                            item.getQuantity() != null) {

                        item.setSubtotal(
                                item.getPrice()
                                        * item.getQuantity()
                        );
                    }
                }
            }


            // -------------------------------------------------
            // SAVE ORDER
            // -------------------------------------------------

            Order savedOrder =
                    orderRepository.save(order);


            // -------------------------------------------------
            // DEBUG
            // -------------------------------------------------

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "Order created successfully"
            );

            System.out.println(
                    "Database Order ID: "
                            + savedOrder.getId()
            );

            System.out.println(
                    "User ID: "
                            + savedOrder.getUserId()
            );

            System.out.println(
                    "Customer Order Number: "
                            + savedOrder.getCustomerOrderNumber()
            );

            System.out.println(
                    "======================================"
            );


            return ResponseEntity.ok(savedOrder);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to create order: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================================
    // GET ALL ORDERS
    //
    // ADMIN USE
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {

        return ResponseEntity.ok(
                orderRepository.findAll()
        );
    }


    // =========================================================
    // GET ORDERS FOR CUSTOMER
    // =========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(
            @PathVariable Long userId) {

        System.out.println(
                "Fetching orders for User ID: "
                        + userId
        );

        List<Order> orders =
                orderRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                userId
                        );

        System.out.println(
                "Orders found for User ID "
                        + userId
                        + ": "
                        + orders.size()
        );

        return ResponseEntity.ok(orders);
    }


    // =========================================================
    // GET SINGLE ORDER
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long id) {

        return orderRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // =========================================================
    // GET ORDERS FOR SELLER
    // =========================================================

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<OrderItem>> getSellerOrders(
            @PathVariable Long sellerId) {

        List<OrderItem> sellerOrders =
                orderItemRepository.findBySellerId(
                        sellerId
                );

        return ResponseEntity.ok(sellerOrders);
    }


    // =========================================================
    // UPDATE ORDER STATUS
    // =========================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return orderRepository
                .findById(id)
                .map(order -> {

                    order.setStatus(status);

                    return ResponseEntity.ok(
                            orderRepository.save(order)
                    );
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // =========================================================
    // DELETE ORDER
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(
            @PathVariable Long id) {

        if (!orderRepository.existsById(id)) {

            return ResponseEntity.notFound().build();
        }

        orderRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}

