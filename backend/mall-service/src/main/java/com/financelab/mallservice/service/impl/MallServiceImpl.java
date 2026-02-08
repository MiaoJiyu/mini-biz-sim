package com.financelab.mallservice.service.impl;

import com.financelab.mallservice.dto.*;
import com.financelab.mallservice.entity.*;
import com.financelab.mallservice.repository.*;
import com.financelab.mallservice.service.MallService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MallServiceImpl implements MallService {
    
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    
    // 商品管理方法
    
    @Override
    public ProductDTO getProduct(Long productId) {
        Optional<Product> product = productRepository.findById(productId);
        return product.map(ProductDTO::new).orElse(null);
    }
    
    @Override
    public ProductDTO getProductByCode(String productCode) {
        Optional<Product> product = productRepository.findByProductCode(productCode);
        return product.map(ProductDTO::new).orElse(null);
    }
    
    @Override
    public Page<ProductDTO> getProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(ProductDTO::new);
    }
    
    @Override
    public Page<ProductDTO> getProductsByCategory(Product.ProductCategory category, Pageable pageable) {
        Page<Product> products = productRepository.findByCategory(category, pageable);
        return products.map(ProductDTO::new);
    }
    
    @Override
    public List<ProductDTO> getTopSellingProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findTopSellingProducts(pageable);
        return products.stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductDTO> getTopRatedProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findTopRatedProducts(pageable);
        return products.stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public Page<ProductDTO> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.searchByKeyword(keyword, pageable);
        return products.map(ProductDTO::new);
    }
    
    @Override
    public Page<ProductDTO> filterProducts(Product.ProductCategory category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        if (category == null) {
            Page<Product> products = productRepository.findByPriceRange(minPrice, maxPrice, pageable);
            return products.map(ProductDTO::new);
        } else {
            // 组合查询：类别 + 价格范围
            List<Product> products = productRepository.findByCategory(category, pageable).getContent().stream()
                .filter(p -> p.getPrice().compareTo(minPrice) >= 0 && p.getPrice().compareTo(maxPrice) <= 0)
                .toList();
            // 转换为 Page 对象
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), products.size());
            List<Product> pageContent = products.subList(start, end);
            return new org.springframework.data.domain.PageImpl<>(
                pageContent,
                pageable,
                products.size()
            ).map(ProductDTO::new);
        }
    }
    
    // 购物车管理方法
    
    @Override
    @Transactional
    public CartItemDTO addToCart(String userId, Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new RuntimeException("数量必须大于零");
        }
        
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("商品不存在");
        }
        
        Product product = productOpt.get();
        if (product.getStatus() != Product.ProductStatus.AVAILABLE) {
            throw new RuntimeException("商品不可购买");
        }
        
        if (product.getStock() < quantity) {
            throw new RuntimeException("库存不足");
        }
        
        // 检查购物车是否已有该商品
        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(userId, productId);
        
        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + quantity;
            if (newQuantity > product.getStock()) {
                throw new RuntimeException("库存不足");
            }
            cartItem.setQuantity(newQuantity);
            cartItem.setTotalPrice(cartItem.getUnitPrice().multiply(new BigDecimal(newQuantity)));
            cartItem.setUpdatedAt(LocalDateTime.now());
        } else {
            cartItem = new CartItem();
            cartItem.setUserId(userId);
            cartItem.setProductId(productId);
            cartItem.setProductName(product.getProductName());
            cartItem.setUnitPrice(product.getPrice());
            cartItem.setQuantity(quantity);
            cartItem.setTotalPrice(product.getPrice().multiply(new BigDecimal(quantity)));
            cartItem.setCreatedAt(LocalDateTime.now());
        }
        
        CartItem savedItem = cartItemRepository.save(cartItem);
        log.info("添加到购物车: userId={}, productId={}, quantity={}", userId, productId, quantity);
        
        return new CartItemDTO(savedItem);
    }
    
    @Override
    public List<CartItemDTO> getCartItems(String userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        return items.stream()
                .map(CartItemDTO::new)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public CartItemDTO updateCartItem(String userId, Long productId, Integer quantity) {
        if (quantity < 0) {
            throw new RuntimeException("数量不能为负数");
        }
        
        if (quantity == 0) {
            removeCartItem(userId, productId);
            return null;
        }
        
        Optional<CartItem> itemOpt = cartItemRepository.findByUserIdAndProductId(userId, productId);
        if (itemOpt.isEmpty()) {
            throw new RuntimeException("购物车中没有该商品");
        }
        
        CartItem item = itemOpt.get();
        
        // 检查库存
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            if (quantity > product.getStock()) {
                throw new RuntimeException("库存不足");
            }
        }
        
        item.setQuantity(quantity);
        item.setTotalPrice(item.getUnitPrice().multiply(new BigDecimal(quantity)));
        item.setUpdatedAt(LocalDateTime.now());
        
        CartItem savedItem = cartItemRepository.save(item);
        log.info("更新购物车: userId={}, productId={}, quantity={}", userId, productId, quantity);
        
        return new CartItemDTO(savedItem);
    }
    
    @Override
    @Transactional
    public void removeCartItem(String userId, Long productId) {
        cartItemRepository.deleteByUserIdAndProductId(userId, productId);
        log.info("移除购物车商品: userId={}, productId={}", userId, productId);
    }
    
    @Override
    @Transactional
    public void clearCart(String userId) {
        cartItemRepository.deleteByUserId(userId);
        log.info("清空购物车: userId={}", userId);
    }
    
    @Override
    public BigDecimal getCartTotal(String userId) {
        Optional<BigDecimal> total = cartItemRepository.getTotalAmountByUserId(userId);
        return total.orElse(BigDecimal.ZERO);
    }
    
    @Override
    public long getCartItemCount(String userId) {
        return cartItemRepository.countByUserId(userId);
    }
    
    // 订单管理方法
    
    @Override
    @Transactional
    public OrderDTO createOrder(String userId, OrderDTO orderDTO) {
        // 获取购物车商品
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("购物车为空");
        }
        
        // 检查库存
        for (CartItem item : cartItems) {
            Optional<Product> productOpt = productRepository.findById(item.getProductId());
            if (productOpt.isEmpty()) {
                throw new RuntimeException("商品不存在: " + item.getProductName());
            }
            Product product = productOpt.get();
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("商品库存不足: " + item.getProductName());
            }
        }
        
        // 生成订单号
        String orderNumber = generateOrderNumber();
        
        // 计算订单金额
        BigDecimal totalAmount = getCartTotal(userId);
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal taxAmount = totalAmount.multiply(new BigDecimal("0.08")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal shippingAmount = totalAmount.compareTo(new BigDecimal("100")) >= 0 ? BigDecimal.ZERO : new BigDecimal("10.00");
        BigDecimal finalAmount = totalAmount.add(taxAmount).add(shippingAmount).subtract(discountAmount);
        
        // 创建订单
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderNumber(orderNumber);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(discountAmount);
        order.setTaxAmount(taxAmount);
        order.setShippingAmount(shippingAmount);
        order.setFinalAmount(finalAmount);
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setContactPhone(orderDTO.getContactPhone());
        order.setContactName(orderDTO.getContactName());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setPaymentStatus(Order.PaymentStatus.UNPAID);
        order.setCreatedAt(LocalDateTime.now());
        order.setRemark(orderDTO.getRemark());
        
        Order savedOrder = orderRepository.save(order);
        
        // 创建订单详情
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cartItems) {
            Optional<Product> productOpt = productRepository.findById(item.getProductId());
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                
                OrderItem orderItem = new OrderItem();
                orderItem.setOrderId(savedOrder.getId());
                orderItem.setProductId(product.getId());
                orderItem.setProductName(product.getProductName());
                orderItem.setProductCode(product.getProductCode());
                orderItem.setImageUrl(product.getImageUrl());
                orderItem.setUnitPrice(item.getUnitPrice());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setTotalPrice(item.getTotalPrice());
                orderItem.setSpecifications(product.getSpecifications());
                orderItem.setCategory(product.getCategory());
                
                orderItems.add(orderItem);
                
                // 更新库存
                product.setStock(product.getStock() - item.getQuantity());
                product.setSalesCount(product.getSalesCount() + item.getQuantity());
                productRepository.save(product);
            }
        }
        
        orderItemRepository.saveAll(orderItems);
        
        // 清空购物车
        cartItemRepository.deleteByUserId(userId);
        
        log.info("创建订单: userId={}, orderNumber={}, amount={}", userId, orderNumber, finalAmount);
        
        OrderDTO result = new OrderDTO(savedOrder);
        result.setItems(orderItems.stream()
            .map(OrderItemDTO::new)
            .collect(Collectors.toList()));
        
        return result;
    }
    
    @Override
    public OrderDTO getOrder(Long orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            return null;
        }
        
        OrderDTO orderDTO = new OrderDTO(order.get());
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        orderDTO.setItems(items.stream()
            .map(OrderItemDTO::new)
            .collect(Collectors.toList()));
        
        return orderDTO;
    }
    
    @Override
    public OrderDTO getOrderByNumber(String orderNumber) {
        Optional<Order> order = orderRepository.findByOrderNumber(orderNumber);
        if (order.isEmpty()) {
            return null;
        }
        
        OrderDTO orderDTO = new OrderDTO(order.get());
        List<OrderItem> items = orderItemRepository.findByOrderId(order.get().getId());
        orderDTO.setItems(items.stream()
            .map(OrderItemDTO::new)
            .collect(Collectors.toList()));
        
        return orderDTO;
    }
    
    @Override
    public List<OrderDTO> getUserOrders(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
            .map(order -> {
                OrderDTO orderDTO = new OrderDTO(order);
                List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                orderDTO.setItems(items.stream()
                    .map(OrderItemDTO::new)
                    .collect(Collectors.toList()));
                return orderDTO;
            })
            .collect(Collectors.toList());
    }
    
    @Override
    public Page<OrderDTO> getUserOrders(String userId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUserId(userId, pageable);
        return orders.map(order -> {
            OrderDTO orderDTO = new OrderDTO(order);
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            orderDTO.setItems(items.stream()
                .map(OrderItemDTO::new)
                .collect(Collectors.toList()));
            return orderDTO;
        });
    }
    
    @Override
    public List<OrderDTO> getUserOrdersByStatus(String userId, Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByUserIdAndStatus(userId, status, Pageable.unpaged()).getContent();
        return orders.stream()
            .map(order -> {
                OrderDTO orderDTO = new OrderDTO(order);
                List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                orderDTO.setItems(items.stream()
                    .map(OrderItemDTO::new)
                    .collect(Collectors.toList()));
                return orderDTO;
            })
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public OrderDTO payOrder(String userId, Long orderId, Order.PaymentMethod paymentMethod) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("订单不存在");
        }
        
        Order order = orderOpt.get();
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作该订单");
        }
        
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("订单状态不正确");
        }
        
        // TODO: 调用银行服务进行实际支付
        // 这里简化处理，假设支付成功
        
        order.setStatus(Order.OrderStatus.PAID);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(Order.PaymentStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        
        Order savedOrder = orderRepository.save(order);
        log.info("订单支付成功: orderId={}, orderNumber={}, amount={}", orderId, order.getOrderNumber(), order.getFinalAmount());
        
        OrderDTO orderDTO = new OrderDTO(savedOrder);
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        orderDTO.setItems(items.stream()
            .map(OrderItemDTO::new)
            .collect(Collectors.toList()));
        
        return orderDTO;
    }
    
    @Override
    @Transactional
    public OrderDTO cancelOrder(String userId, Long orderId, String reason) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("订单不存在");
        }
        
        Order order = orderOpt.get();
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作该订单");
        }
        
        if (order.getStatus() != Order.OrderStatus.PENDING && order.getStatus() != Order.OrderStatus.PAID) {
            throw new RuntimeException("订单状态不允许取消");
        }
        
        // 如果已支付，需要退款
        if (order.getStatus() == Order.OrderStatus.PAID) {
            // TODO: 调用银行服务进行退款
            // 这里简化处理
        }
        
        // 恢复库存
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        for (OrderItem item : items) {
            Optional<Product> productOpt = productRepository.findById(item.getProductId());
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                product.setStock(product.getStock() + item.getQuantity());
                product.setSalesCount(Math.max(0, product.getSalesCount() - item.getQuantity()));
                productRepository.save(product);
            }
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        order.setCancelReason(reason);
        
        Order savedOrder = orderRepository.save(order);
        log.info("订单取消成功: orderId={}, orderNumber={}, reason={}", orderId, order.getOrderNumber(), reason);
        
        OrderDTO orderDTO = new OrderDTO(savedOrder);
        orderDTO.setItems(items.stream()
            .map(OrderItemDTO::new)
            .collect(Collectors.toList()));
        
        return orderDTO;
    }
    
    // 数据统计方法
    
    @Override
    public BigDecimal getTotalSpent(String userId) {
        Optional<BigDecimal> total = orderRepository.getTotalSpentByUserId(userId);
        return total.orElse(BigDecimal.ZERO);
    }
    
    @Override
    public long getOrderCount(String userId) {
        return orderRepository.countByUserId(userId);
    }
    
    // 辅助方法
    
    private String generateOrderNumber() {
        return "ORD" + System.currentTimeMillis() + String.format("%04d", (int)(Math.random() * 10000));
    }
}
