package com.smartmart.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.smartmart.backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // =========================================================
    // GET USER ORDERS
    // =========================================================

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);


    // =========================================================
    // GET HIGHEST CUSTOMER ORDER NUMBER
    // =========================================================
    //
    // Example:
    //
    // User 5:
    // Order 1
    // Order 2
    // Order 3
    //
    // Returns 3.
    //
    // New order becomes 4.
    //
    // For a new user, returns null.
    // Therefore the first order becomes 1.
    // =========================================================

    @Query("""
        SELECT MAX(o.customerOrderNumber)
        FROM Order o
        WHERE o.userId = :userId
    """)
    Long findMaxCustomerOrderNumber(
            @Param("userId") Long userId
    );
}
