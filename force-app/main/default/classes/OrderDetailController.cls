public with sharing class OrderDetailController {
 
  @AuraEnabled(cacheable=true)
    public static OrderWrapper getOrderDetails() {
        // Hardcoded Owner Id (replace '005XXXXXXXXXXXX' with the actual Owner Id)
        Id hardcodedOwnerId = '005GC00000lBgEIYA0';
 
        // Query Order details based on hardcoded Owner Id
        Product_Order__c orderRecord = [
            SELECT Id, Name, Expected_Delivery_Date__c, Total__c, Billing_Address__c, Shipping_Address__c, 
                    (SELECT Product__r.Name, Quantity__c, 	Unit_Price__c, Total__c FROM Order_Line_Items__r)
            FROM Product_Order__c
            WHERE CreatedById = :hardcodedOwnerId
            LIMIT 1
        ];
 
        // Create wrapper class to pass data to LWC
        OrderWrapper orderWrapper = new OrderWrapper();
         orderWrapper.Id = orderRecord.Id;
        orderWrapper.orderNo = orderRecord.Order_Number__c;
        orderWrapper.estimatedDeliveryDate = orderRecord.Expected_Delivery_Date__c;
        orderWrapper.totalAmount = orderRecord.Total__c;
        orderWrapper.billingAddress = orderRecord.Billing_Address__c;
        orderWrapper.shippingAddress = orderRecord.Shipping_Address__c;
 
        // Add Order Items to wrapper
        for (Order_Line_Item__c item : orderRecord.Order_Line_Items__r) {
            OrderItemWrapper itemWrapper = new OrderItemWrapper();
            itemWrapper.productName = item.Product__r.Name;
            itemWrapper.quantity = item.Quantity__c;
            itemWrapper.unitPrice = item.Unit_Price__c;
            itemWrapper.totalPrice = item.Total__c;
            orderWrapper.orderItems.add(itemWrapper);
        }
 
        return orderWrapper;
    }
 
    @AuraEnabled
    public static void cancelOrder(Id orderId) {
         system.debug(orderId);
        // Fetch order and check if it can be canceled
        Product_Order__c order = [SELECT Id, Status__c FROM Product_Order__c WHERE Id = :orderId LIMIT 1];
        if (order.Status__c == 'In Process' || order.Status__c == 'Open') {
            // Set status to 'Cancelled'
            order.Status__c = 'Cancelled';
            update order;
        } else {
            // Throw an error if the order cannot be canceled
            throw new AuraHandledException('The order cannot be canceled. Please contact E-Zone.');
        }
    }
 
    @AuraEnabled
   public static void reorder(Id orderId) {
        // Logic to handle re-ordering, create new order record with the same items
        Product_Order__c existingOrder = [SELECT Order_Number__c, AccountName__c, (SELECT Product__c, Quantity__c FROM Order_Line_Items__r) 
                                          FROM Product_Order__c WHERE Id = :orderId LIMIT 1];
        Product_Order__c newOrder = new Product_Order__c();
        newOrder.AccountName__c = existingOrder.AccountName__c;
        newOrder.Status__c = 'New'; // New status for the re-order
        insert newOrder;
 
        // Copy order line items to the new order
                List<Order_Line_Item__c> newOrderItems = new List<Order_Line_Item__c>();
        for (Order_Line_Item__c oldItem : existingOrder.Order_Line_Items__r) {
            Order_Line_Item__c newItem = new Order_Line_Item__c();
            newItem.Product_Order__c = newOrder.Id;
            newItem.Product__c = oldItem.Product__c;
            newItem.Quantity__c = oldItem.Quantity__c;
            newItem.List_Price__c = oldItem.List_Price__c; // Adjust to your API
            newOrderItems.add(newItem);
        }
        insert newOrderItems;
    }
 
    // Wrapper classes to hold data for the UI
    public class OrderWrapper {
        @AuraEnabled public String orderNo;
        @AuraEnabled public String Id;
        @AuraEnabled public Date estimatedDeliveryDate;
        @AuraEnabled public Decimal totalAmount;
        @AuraEnabled public String billingAddress;
        @AuraEnabled public String shippingAddress;
        @AuraEnabled public List<OrderItemWrapper> orderItems = new List<OrderItemWrapper>();
    }
 
    public class OrderItemWrapper {
        @AuraEnabled public String productName;
        @AuraEnabled public Decimal quantity;
        @AuraEnabled public Decimal unitPrice;
        @AuraEnabled public Decimal totalPrice;
    }
}