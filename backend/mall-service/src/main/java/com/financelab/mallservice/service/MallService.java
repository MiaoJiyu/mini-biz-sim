package com.financelab.mallservice.service;

import com.financelab.mallservice.dto.*;
import com.financelab.mallservice.entity.Product;
import com.financelab.mallservice.entity.Order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface MallService {
    
    // 商品管理
    ProductDTO getProduct(Long productId);
    ProductDTO getProductByCode(String productCode);
    Page<ProductDTO> getProducts(Pageable pageable);
    Page<ProductDTO> getProductsByCategory(Product.ProductCategory category, Pageable pageable);
    List<ProductDTO> getTopSellingProducts(int limit);
    List<ProductDTO> getTopRatedProducts(int limit);
    Page<ProductDTO> searchProducts(String keyword, Pageable pageable);
    Page<ProductDTO> filterProducts(Product.ProductCategory category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    // 购物车管理
    CartItemDTO addToCart(String userId, Long productId, Integer quantity);
    List<CartItemDTO> getCartItems(String userId);
    CartItemDTO updateCartItem(String userId, Long productId, Integer quantity);
    void removeCartItem(String userId, Long productId);
    void clearCart(String userId);
    BigDecimal getCartTotal(String userId);
    long getCartItemCount(String userId);
    
    // 订单管理
    OrderDTO createOrder(String userId, OrderDTO orderDTO);
    OrderDTO getOrder(Long orderId);
    OrderDTO getOrderByNumber(String orderNumber);
    List<OrderDTO> getUserOrders(String userId);
    Page<OrderDTO> getUserOrders(String userId, Pageable pageable);
    List<OrderDTO> getUserOrdersByStatus(String userId, Order.OrderStatus status);
    OrderDTO payOrder(String userId, Long orderId, Order.PaymentMethod paymentMethod);
    OrderDTO cancelOrder(String userId, Long orderId, String reason);
    
    // 数据统计
    BigDecimal getTotalSpent(String userId);
    long getOrderCount(String userId);
}
