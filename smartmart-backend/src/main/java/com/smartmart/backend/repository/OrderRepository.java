package com.smartmart.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartmart.backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get only orders belonging to a particular customer
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
