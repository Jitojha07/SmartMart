package com.smartmart.backend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartmart.backend.entity.Wishlist;
import com.smartmart.backend.model.Product;
import com.smartmart.backend.repository.ProductRepository;
import com.smartmart.backend.repository.WishlistRepository;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://smartmart-three.vercel.app"
})
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    public WishlistController(
            WishlistRepository wishlistRepository,
            ProductRepository productRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }

    // ==========================================
    // GET USER WISHLIST
    // ==========================================

    @GetMapping("/{userId}")
    public ResponseEntity<List<Product>> getWishlist(
            @PathVariable Long userId
    ) {

        List<Wishlist> wishlistItems =
                wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<Product> products = new ArrayList<>();

        for (Wishlist item : wishlistItems) {

            productRepository.findById(item.getProductId())
                    .ifPresent(products::add);
        }

        return ResponseEntity.ok(products);
    }

    // ==========================================
    // ADD PRODUCT TO WISHLIST
    // ==========================================

    @PostMapping("/{userId}/{productId}")
    public ResponseEntity<?> addToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId
    ) {

        // Check product exists
        if (!productRepository.existsById(productId)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Product not found");
        }

        // Prevent duplicate wishlist entries
        if (wishlistRepository.existsByUserIdAndProductId(
                userId,
                productId
        )) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Product is already in wishlist");
        }

        Wishlist wishlist = Wishlist.builder()
                .userId(userId)
                .productId(productId)
                .build();

        Wishlist savedWishlist =
                wishlistRepository.save(wishlist);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedWishlist);
    }

    // ==========================================
    // REMOVE PRODUCT FROM WISHLIST
    // ==========================================

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId
    ) {

        if (!wishlistRepository.existsByUserIdAndProductId(
                userId,
                productId
        )) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Product is not in wishlist");
        }

        wishlistRepository.deleteByUserIdAndProductId(
                userId,
                productId
        );

        return ResponseEntity.ok(
                "Product removed from wishlist"
        );
    }

    // ==========================================
    // CHECK WISHLIST STATUS
    // ==========================================

    @GetMapping("/{userId}/check/{productId}")
    public ResponseEntity<Boolean> checkWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId
    ) {

        boolean exists =
                wishlistRepository.existsByUserIdAndProductId(
                        userId,
                        productId
                );

        return ResponseEntity.ok(exists);
    }
}