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
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OrderController(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }


    // =========================================================
    // CREATE ORDER
    // =========================================================

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody Order order
    ) {

        // Default order status
        if (order.getStatus() == null ||
                order.getStatus().isEmpty()) {

            order.setStatus("PLACED");
        }


        // Connect every item with this order
        if (order.getOrderItems() != null) {

            for (OrderItem item : order.getOrderItems()) {

                item.setOrder(order);


                // Calculate subtotal
                if (item.getPrice() != null &&
                        item.getQuantity() != null) {

                    item.setSubtotal(
                            item.getPrice()
                                    * item.getQuantity()
                    );
                }
            }
        }


        // Save order
        Order savedOrder =
                orderRepository.save(order);

        return ResponseEntity.ok(savedOrder);
    }


    // =========================================================
    // GET ALL ORDERS
    // =========================================================

    @GetMapping
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }


    // =========================================================
    // GET ORDER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long id
    ) {

        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // =========================================================
    // GET ORDERS FOR A PARTICULAR SELLER
    // =========================================================

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<OrderItem>> getSellerOrders(
            @PathVariable Long sellerId
    ) {

        List<OrderItem> sellerOrders =
                orderItemRepository.findBySellerId(sellerId);

        return ResponseEntity.ok(sellerOrders);
    }


    // =========================================================
    // UPDATE ORDER STATUS
    // =========================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {

        return orderRepository.findById(id)
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
            @PathVariable Long id
    ) {

        if (!orderRepository.existsById(id)) {

            return ResponseEntity.notFound().build();
        }

        orderRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}