public with sharing class NewOrderController{
    @AuraEnabled
    public static Id placeOrder(String shippingAddress, String billingAddress) {
        try {
            Contact userContact = [SELECT Id, Name FROM Contact WHERE Email = :UserInfo.getUserEmail() LIMIT 1];
            Cart__c userCart = [SELECT Id, Status__c, Amount__c, Total_Quantity__c
                                FROM Cart__c 
                                WHERE Customer__c = :userContact.Id 
                                AND Status__c = 'Open' ];

            List<Cart_Item__c> cartItems = [SELECT Id, Product__c,Quantity__c, List_Price__c 
                                             FROM Cart_Item__c 
                                             WHERE Cart__c = :userCart.Id];
            if (cartItems.isEmpty()) {
                throw new AuraHandledException('No items found in the cart to place the order.');
            }

           	Product_Order__c newOrder = new Product_Order__c();
            newOrder.OwnerId = UserInfo.getUserId(); 
            newOrder.Shipping_Address__c = shippingAddress; 
            newOrder.Billing_Address__c = billingAddress; 
            newOrder.Status__c = 'In Process'; 
            newOrder.Order_Date__c = System.now(); 
            newOrder.Customer__c = userContact.Id; 
            insert newOrder;
            List<Order_Line_Item__c> orderLineItems = new List<Order_Line_Item__c>();
            for (Cart_Item__c cartItem : cartItems) {
                Order_Line_Item__c orderLineItem = new Order_Line_Item__c();
                orderLineItem.Product_Order__c  = newOrder.Id; 
                orderLineItem.Product__c = cartItem.Product__c; 
                orderLineItem.Quantity__c = cartItem.Quantity__c; 
                orderLineItem.List_Price__c = cartItem.List_Price__c; 
                orderLineItem.Unit_Price__c = cartItem.List_Price__c;
                orderLineItems.add(orderLineItem);
            }

            if (!orderLineItems.isEmpty()) {
                insert orderLineItems;
            }
            userCart.Status__c = 'Ordered';
            update userCart;
            return newOrder.Id;
        } catch (Exception e) {
            System.debug('Error placing order: ' + e.getMessage());
            throw new AuraHandledException('Error placing order: ' + e.getMessage());
        }
    }
    // @AuraEnabled(cacheable=true)
    // public static Orders__c getOrderDetails(Id orderId) {
    //     try {
    //         return [SELECT Id, Name, Total__c, Status__c
    //                 FROM Orders__c 
    //                 WHERE Id = :orderId
    //                 LIMIT 1];
    //     } catch (Exception e) {
    //         throw new AuraHandledException('Error fetching order details: ' + e.getMessage());
    //     }
    // }
    @AuraEnabled
    public static List<Product_Order__c> getOrders() {
        return [SELECT Id, CreatedDate, Name FROM Product_Order__c ORDER BY CreatedDate DESC];
    }
    @AuraEnabled
    public static void reOrder(Id orderId) {
        try {
            Contact userContact = [SELECT Id FROM Contact WHERE Email = :UserInfo.getUserEmail() LIMIT 1];

            List<Cart__c> userCartList = [SELECT Id FROM Cart__c 
                                          WHERE Customer__c = :userContact.Id 
                                          AND Status__c = 'Open' 
                                          LIMIT 1];
            Cart__c userCart;
            if (userCartList.isEmpty()) {
                userCart = new Cart__c(Customer__c = userContact.Id, Status__c = 'Open');
                insert userCart;
            } else {
                userCart = userCartList[0];
            }

            List<Order_Line_Item__c> orderLineItems = [SELECT Product__c, Quantity__c, List_Price__c 
                                                       FROM Order_Line_Item__c 
                                                       WHERE Product_Order__c = :orderId];

            List<Cart_Item__c> cartItems = new List<Cart_Item__c>();
            for (Order_Line_Item__c orderLineItem : orderLineItems) {
                Cart_Item__c cartItem = new Cart_Item__c();
                cartItem.Product__c = orderLineItem.Product__c;
                cartItem.Quantity__c = orderLineItem.Quantity__c;
                cartItem.List_Price__c = orderLineItem.List_Price__c;
                cartItem.Amount__c = orderLineItem.Quantity__c * orderLineItem.List_Price__c;
                cartItem.Cart__c = userCart.Id;
                cartItems.add(cartItem);
            }
            if (!cartItems.isEmpty()) {
                insert cartItems;
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error re-ordering: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
public static OrdersWrapper getOrderDetails(Id orderId) {
    try {
       Product_Order__c order = [SELECT Id, Name, Total__c, Status__c, 
                                  (SELECT Id, Product__r.Name, Quantity__c, Unit_Price__c 
                                   FROM Order_Line_Items__r)
                           FROM Product_Order__c
                           WHERE Id = :orderId
                           LIMIT 1];
 
        OrdersWrapper wrapper = new OrdersWrapper();
        wrapper.order = order;
        wrapper.orderLineItems = order.Order_Line_Items__r;
        return wrapper;
    } catch (Exception e) {
        throw new AuraHandledException('Error fetching order details: ' + e.getMessage());
    }
}

public class OrdersWrapper {
    @AuraEnabled public Product_Order__c order;
    @AuraEnabled public List<Order_Line_Item__c> orderLineItems;
}
@AuraEnabled
public static void cancelOrder(Id orderId) {
    try {
       Product_Order__c orderToCancel = [SELECT Id, Status__c 
                                   FROM Product_Order__c
                                   WHERE Id = :orderId 
                                   LIMIT 1];

        if (orderToCancel.Status__c == 'In Process') {
            orderToCancel.Status__c = 'Cancelled';
            update orderToCancel;
        } else {
            throw new AuraHandledException('Order cannot be cancelled at this stage.');
        }
    } catch (Exception e) {
        throw new AuraHandledException('Error cancelling order: ' + e.getMessage());
    }
}
}