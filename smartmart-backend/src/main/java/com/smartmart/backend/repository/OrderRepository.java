package com.smartmart.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.smartmart.backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // =========================================================
    // GET ORDERS FOR PARTICULAR CUSTOMER
    // =========================================================

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);


    // =========================================================
    // GET LAST CUSTOMER ORDER NUMBER
    //
    // If customer has:
    // 1, 2, 3
    //
    // returns 3
    //
    // If customer has no orders:
    // returns 0
    // =========================================================

    @Query("""
        SELECT COALESCE(MAX(o.customerOrderNumber), 0)
        FROM Order o
        WHERE o.userId = :userId
    """)
    Integer findLastCustomerOrderNumber(
            @Param("userId") Long userId
    );
}