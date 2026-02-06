package com.financelab.mallservice.controller;

import com.financelab.mallservice.dto.*;
import com.financelab.mallservice.entity.Product;
import com.financelab.mallservice.entity.Order;
import com.financelab.mallservice.service.MallService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/mall")
@RequiredArgsConstructor
@Slf4j
public class MallController {
    
    private final MallService mallService;
    
    // 商品API
    
    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long productId) {
        try {
            ProductDTO product = mallService.getProduct(productId);
            if (product != null) {
                return ResponseEntity.ok(product);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取商品信息失败: productId={}, error={}", productId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/products/code/{productCode}")
    public ResponseEntity<ProductDTO> getProductByCode(@PathVariable String productCode) {
        try {
            ProductDTO product = mallService.getProductByCode(productCode);
            if (product != null) {
                return ResponseEntity.ok(product);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取商品信息失败: productCode={}, error={}", productCode, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/products")
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductDTO> products = mallService.getProducts(pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("获取商品列表失败: error={}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/products/category/{category}")
    public ResponseEntity<Page<ProductDTO>> getProductsByCategory(
            @PathVariable Product.ProductCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductDTO> products = mallService.getProductsByCategory(category, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("获取分类商品失败: category={}, error={}", category, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/products/top-selling")
    public ResponseEntity<List<ProductDTO>> getTopSellingProducts(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<ProductDTO> products = mallService.getTopSellingProducts(limit);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("获取热销商品失败: error={}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/products/top-rated")
    public ResponseEntity<List<ProductDTO>> getTopRatedProducts(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<ProductDTO> products = mallService.getTopRatedProducts(limit);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("获取好评商品失败: error={}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/products/search")
    public ResponseEntity<Page<ProductDTO>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductDTO> products = mallService.searchProducts(keyword, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("搜索商品失败: keyword={}, error={}", keyword, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 购物车API
    
    @PostMapping("/cart")
    public ResponseEntity<CartItemDTO> addToCart(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        try {
            CartItemDTO item = mallService.addToCart(userId, productId, quantity);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            log.error("添加到购物车失败: userId={}, productId={}, error={}", userId, productId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/cart")
    public ResponseEntity<List<CartItemDTO>> getCartItems(@RequestHeader("X-User-Id") String userId) {
        try {
            List<CartItemDTO> items = mallService.getCartItems(userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            log.error("获取购物车失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/cart/{productId}")
    public ResponseEntity<CartItemDTO> updateCartItem(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        try {
            CartItemDTO item = mallService.updateCartItem(userId, productId, quantity);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            log.error("更新购物车失败: userId={}, productId={}, error={}", userId, productId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/cart/{productId}")
    public ResponseEntity<Void> removeCartItem(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Long productId) {
        try {
            mallService.removeCartItem(userId, productId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("移除购物车商品失败: userId={}, productId={}, error={}", userId, productId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/cart")
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-Id") String userId) {
        try {
            mallService.clearCart(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("清空购物车失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/cart/total")
    public ResponseEntity<BigDecimal> getCartTotal(@RequestHeader("X-User-Id") String userId) {
        try {
            BigDecimal total = mallService.getCartTotal(userId);
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            log.error("获取购物车总额失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/cart/count")
    public ResponseEntity<Long> getCartItemCount(@RequestHeader("X-User-Id") String userId) {
        try {
            long count = mallService.getCartItemCount(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("获取购物车数量失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 订单API
    
    @PostMapping("/orders")
    public ResponseEntity<OrderDTO> createOrder(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO order = mallService.createOrder(userId, orderDTO);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("创建订单失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long orderId) {
        try {
            OrderDTO order = mallService.getOrder(orderId);
            if (order != null) {
                return ResponseEntity.ok(order);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取订单信息失败: orderId={}, error={}", orderId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/orders/number/{orderNumber}")
    public ResponseEntity<OrderDTO> getOrderByNumber(@PathVariable String orderNumber) {
        try {
            OrderDTO order = mallService.getOrderByNumber(orderNumber);
            if (order != null) {
                return ResponseEntity.ok(order);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("获取订单信息失败: orderNumber={}, error={}", orderNumber, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@RequestHeader("X-User-Id") String userId) {
        try {
            List<OrderDTO> orders = mallService.getUserOrders(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("获取用户订单失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/orders/page")
    public ResponseEntity<Page<OrderDTO>> getUserOrdersPage(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<OrderDTO> orders = mallService.getUserOrders(userId, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("获取用户订单失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/orders/status/{status}")
    public ResponseEntity<List<OrderDTO>> getUserOrdersByStatus(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Order.OrderStatus status) {
        try {
            List<OrderDTO> orders = mallService.getUserOrdersByStatus(userId, status);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("获取订单失败: userId={}, status={}, error={}", userId, status, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/orders/{orderId}/pay")
    public ResponseEntity<OrderDTO> payOrder(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Long orderId,
            @RequestParam Order.PaymentMethod paymentMethod) {
        try {
            OrderDTO order = mallService.payOrder(userId, orderId, paymentMethod);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("订单支付失败: userId={}, orderId={}, error={}", userId, orderId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/orders/{orderId}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Long orderId,
            @RequestParam(required = false) String reason) {
        try {
            OrderDTO order = mallService.cancelOrder(userId, orderId, reason);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("取消订单失败: userId={}, orderId={}, error={}", userId, orderId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 统计API
    
    @GetMapping("/stats/total-spent")
    public ResponseEntity<BigDecimal> getTotalSpent(@RequestHeader("X-User-Id") String userId) {
        try {
            BigDecimal total = mallService.getTotalSpent(userId);
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            log.error("获取总消费失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/stats/order-count")
    public ResponseEntity<Long> getOrderCount(@RequestHeader("X-User-Id") String userId) {
        try {
            long count = mallService.getOrderCount(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("获取订单数量失败: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
