package com.smartmart.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartmart.backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}