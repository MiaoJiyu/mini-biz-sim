package com.financelab.mallservice.config;

import com.financelab.mallservice.entity.Product;
import com.financelab.mallservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final ProductRepository productRepository;
    
    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            initializeProducts();
        }
    }
    
    private void initializeProducts() {
        log.info("开始初始化商品数据...");
        
        // 电子产品
        createProduct("ELEC001", "智能手机Pro", Product.ProductCategory.ELECTRONICS,
            new BigDecimal("3999"), 100, "https://example.com/phone.jpg", 
            "5.5英寸高清屏幕，8GB内存，256GB存储", "科技品牌", "黑色", 4.8);
        
        createProduct("ELEC002", "笔记本电脑Air", Product.ProductCategory.ELECTRONICS,
            new BigDecimal("5999"), 80, "https://example.com/laptop.jpg",
            "13.3英寸轻薄本，16GB内存，512GB存储", "科技品牌", "银色", 4.7);
        
        createProduct("ELEC003", "无线耳机", Product.ProductCategory.ELECTRONICS,
            new BigDecimal("599"), 200, "https://example.com/earphone.jpg",
            "主动降噪，30小时续航", "音频品牌", "白色", 4.6);
        
        // 服装
        createProduct("CLOTH001", "商务西装", Product.ProductCategory.CLOTHING,
            new BigDecimal("899"), 50, "https://example.com/suit.jpg",
            "优质面料，修身剪裁", "时尚品牌", "L码，深蓝色", 4.5);
        
        createProduct("CLOTH002", "休闲T恤", Product.ProductCategory.CLOTHING,
            new BigDecimal("199"), 150, "https://example.com/tshirt.jpg",
            "纯棉材质，舒适透气", "时尚品牌", "M码，白色", 4.4);
        
        createProduct("CLOTH003", "运动鞋", Product.ProductCategory.CLOTHING,
            new BigDecimal("459"), 120, "https://example.com/shoes.jpg",
            "缓震科技，轻盈透气", "运动品牌", "42码，黑色", 4.7);
        
        // 食品
        createProduct("FOOD001", "有机大米", Product.ProductCategory.FOOD,
            new BigDecimal("59"), 300, "https://example.com/rice.jpg",
            "5公斤装，生态种植", "农产品品牌", "5kg", 4.8);
        
        createProduct("FOOD002", "进口红酒", Product.ProductCategory.FOOD,
            new BigDecimal("299"), 80, "https://example.com/wine.jpg",
            "法国原装进口，750ml", "酒类品牌", "750ml", 4.5);
        
        createProduct("FOOD003", "坚果礼盒", Product.ProductCategory.FOOD,
            new BigDecimal("168"), 100, "https://example.com/nuts.jpg",
            "混合坚果，健康零食", "食品品牌", "1kg", 4.6);
        
        // 家居
        createProduct("HOME001", "智能台灯", Product.ProductCategory.HOME,
            new BigDecimal("199"), 150, "https://example.com/lamp.jpg",
            "无极调光，USB充电", "家居品牌", "白色", 4.5);
        
        createProduct("HOME002", "空气净化器", Product.ProductCategory.HOME,
            new BigDecimal("899"), 60, "https://example.com/purifier.jpg",
            "高效过滤，静音运行", "家居品牌", "白色", 4.7);
        
        createProduct("HOME003", "床上用品四件套", Product.ProductCategory.HOME,
            new BigDecimal("299"), 100, "https://example.com/bedding.jpg",
            "纯棉材质，亲肤舒适", "家居品牌", "1.8m床，浅蓝色", 4.6);
        
        // 书籍
        createProduct("BOOK001", "理财入门", Product.ProductCategory.BOOKS,
            new BigDecimal("59"), 200, "https://example.com/book1.jpg",
            "系统学习理财知识", "出版社", "平装", 4.7);
        
        createProduct("BOOK002", "投资之道", Product.ProductCategory.BOOKS,
            new BigDecimal("79"), 150, "https://example.com/book2.jpg",
            "资深投资者心得分享", "出版社", "精装", 4.8);
        
        createProduct("BOOK003", "经济学原理", Product.ProductCategory.BOOKS,
            new BigDecimal("89"), 120, "https://example.com/book3.jpg",
            "经济学基础知识", "出版社", "平装", 4.6);
        
        // 玩具
        createProduct("TOY001", "乐高积木", Product.ProductCategory.TOYS,
            new BigDecimal("399"), 80, "https://example.com/lego.jpg",
            "1000片装，创意无限", "玩具品牌", "城堡主题", 4.8);
        
        createProduct("TOY002", "遥控汽车", Product.ProductCategory.TOYS,
            new BigDecimal("199"), 100, "https://example.com/rccar.jpg",
            "高速四驱，耐摔设计", "玩具品牌", "红色", 4.5);
        
        createProduct("TOY003", "拼图", Product.ProductCategory.TOYS,
            new BigDecimal("89"), 150, "https://example.com/puzzle.jpg",
            "1000片，风景图案", "玩具品牌", "山水画", 4.6);
        
        // 运动
        createProduct("SPORT001", "瑜伽垫", Product.ProductCategory.SPORTS,
            new BigDecimal("99"), 200, "https://example.com/yogamat.jpg",
            "防滑材质，加厚设计", "运动品牌", "183cm x 61cm", 4.7);
        
        createProduct("SPORT002", "哑铃套装", Product.ProductCategory.SPORTS,
            new BigDecimal("299"), 100, "https://example.com/dumbbell.jpg",
            "可调节重量，居家健身", "运动品牌", "2-10kg", 4.6);
        
        createProduct("SPORT003", "羽毛球拍", Product.ProductCategory.SPORTS,
            new BigDecimal("199"), 120, "https://example.com/badminton.jpg",
            "碳纤维材质，轻便耐用", "运动品牌", "2支装", 4.5);
        
        // 美妆
        createProduct("BEAUTY001", "护肤套装", Product.ProductCategory.BEAUTY,
            new BigDecimal("399"), 100, "https://example.com/skincare.jpg",
            "洁面+爽肤水+乳液", "美妆品牌", "套装", 4.6);
        
        createProduct("BEAUTY002", "口红礼盒", Product.ProductCategory.BEAUTY,
            new BigDecimal("299"), 80, "https://example.com/lipstick.jpg",
            "3支装，多种色号", "美妆品牌", "3支", 4.7);
        
        createProduct("BEAUTY003", "防晒霜", Product.ProductCategory.BEAUTY,
            new BigDecimal("159"), 150, "https://example.com/sunscreen.jpg",
            "SPF50，清爽不油腻", "美妆品牌", "50ml", 4.5);
        
        // 奢侈品
        createProduct("LUXURY001", "品牌手表", Product.ProductCategory.LUXURY,
            new BigDecimal("2999"), 30, "https://example.com/watch.jpg",
            "瑞士机械机芯，真皮表带", "奢侈品牌", "银色", 4.9);
        
        createProduct("LUXURY002", "真丝围巾", Product.ProductCategory.LUXURY,
            new BigDecimal("999"), 50, "https://example.com/scarf.jpg",
            "100%桑蚕丝，手工刺绣", "奢侈品牌", "180cm x 90cm", 4.8);
        
        createProduct("LUXURY003", "皮具钱包", Product.ProductCategory.LUXURY,
            new BigDecimal("599"), 40, "https://example.com/wallet.jpg",
            "意大利真皮，手工缝制", "奢侈品牌", "深棕色", 4.7);
        
        // 数码
        createProduct("DIGI001", "相机镜头", Product.ProductCategory.DIGITAL,
            new BigDecimal("1999"), 40, "https://example.com/lens.jpg",
            "50mm f/1.8，人像神器", "摄影品牌", "50mm", 4.8);
        
        createProduct("DIGI002", "移动硬盘", Product.ProductCategory.DIGITAL,
            new BigDecimal("399"), 200, "https://example.com/hdd.jpg",
            "2TB，USB 3.0高速传输", "数码品牌", "2TB", 4.6);
        
        createProduct("DIGI003", "数码相框", Product.ProductCategory.DIGITAL,
            new BigDecimal("599"), 80, "https://example.com/digitalframe.jpg",
            "10英寸高清屏，WiFi连接", "数码品牌", "10英寸", 4.5);
        
        // 带折扣的商品
        Product discountedProduct = new Product();
        discountedProduct.setProductCode("ELEC004");
        discountedProduct.setProductName("智能手环");
        discountedProduct.setCategory(Product.ProductCategory.ELECTRONICS);
        discountedProduct.setDescription("健康监测，运动追踪，防水设计");
        discountedProduct.setPrice(new BigDecimal("299"));
        discountedProduct.setStock(150);
        discountedProduct.setImageUrl("https://example.com/band.jpg");
        discountedProduct.setStatus(Product.ProductStatus.AVAILABLE);
        discountedProduct.setDiscount(new BigDecimal("10")); // 10% discount
        discountedProduct.setTaxRate(new BigDecimal("0.13"));
        discountedProduct.setBrand("科技品牌");
        discountedProduct.setSpecifications("黑色");
        discountedProduct.setSalesCount(500);
        discountedProduct.setRating(47); // 4.7/5 * 10
        discountedProduct.setReviewCount(200);
        discountedProduct.setCreatedAt(LocalDateTime.now());
        productRepository.save(discountedProduct);
        
        log.info("商品数据初始化完成，共创建 {} 个商品", productRepository.count());
    }
    
    private void createProduct(String code, String name, Product.ProductCategory category,
                              BigDecimal price, int stock, String imageUrl,
                              String description, String brand, String specs, double rating) {
        Product product = new Product();
        product.setProductCode(code);
        product.setProductName(name);
        product.setCategory(category);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setImageUrl(imageUrl);
        product.setStatus(Product.ProductStatus.AVAILABLE);
        product.setDiscount(BigDecimal.ZERO);
        product.setTaxRate(new BigDecimal("0.13"));
        product.setBrand(brand);
        product.setSpecifications(specs);
        product.setSalesCount(100 + (int)(Math.random() * 500));
        product.setRating((int)(rating * 10));
        product.setReviewCount(50 + (int)(Math.random() * 200));
        product.setCreatedAt(LocalDateTime.now());
        
        productRepository.save(product);
        log.info("创建商品: {} - {}", code, name);
    }
}
