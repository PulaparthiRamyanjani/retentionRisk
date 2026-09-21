public class ApplyCouponController {
    @AuraEnabled
    public static CartWrapper applyCoupon(String cartId, String couponName) {
         System.debug('Cart ID: ' + cartId);
         System.debug('Coupon Name: ' + couponName);
        // Validate cartId and couponName inputs
        if (String.isBlank(cartId) || String.isBlank(couponName)) {
            throw new AuraHandledException('Cart ID and Coupon Name are required');
        }
 
        // Query Coupon based on coupon name
        List<Coupon__c> coupons = [
            SELECT Id, Type__c, Discount__c, Expiry_Date__c, Remaining_Quantity__c 
            FROM Coupon__c 
            WHERE Name = :couponName 
            LIMIT 1
        ];
 
        // Check if the coupon exists
        if (coupons.isEmpty()) {
            throw new AuraHandledException('Invalid coupon code. No coupon found');
        }
 
        Coupon__c coupon = coupons[0];
 
        // Check if the coupon is expired or no longer available
        if (coupon.Expiry_Date__c < Date.today() || coupon.Remaining_Quantity__c <= 0) {
            throw new AuraHandledException('Coupon is expired or no longer available');
        }
 
        // Retrieve the cart with associated items and the Applied_Coupon__c field
        Cart__c cart = [
            SELECT Id, Applied_Coupon__c, 
                   (SELECT Id, Quantity__c, Total_Amount__c FROM Cart_Items__r) 
            FROM Cart__c 
            WHERE Id = :cartId 
            LIMIT 1
        ];
 
        // Check if the cart exists
        if (cart == null) {
            throw new AuraHandledException('Cart not found');
        }
 
        // Check if a coupon is already applied to the cart
        if (cart.Applied_Coupon__c != null) {
            throw new AuraHandledException('A coupon has already been applied to this cart');
        }
 
        // Calculate the total amount of all cart items
        Decimal totalCartAmount = 0;
        for (Cart_Item__c item : cart.Cart_Items__r) {
            totalCartAmount += item.Total_Amount__c;
        }
 
        // Calculate the discount based on the coupon type
        Decimal discountAmount = 0;
        if (coupon.Type__c == 'Flat') {
            // Apply flat discount
            discountAmount = coupon.Discount__c;
        } else if (coupon.Type__c == 'Percentage') {
            // Apply percentage discount to the total cart amount
            discountAmount = totalCartAmount * (coupon.Discount__c / 100);
        }
 
        // Ensure discount does not exceed the cart total
        if (discountAmount > totalCartAmount) {
            discountAmount = totalCartAmount; // Prevent negative total amounts
        }
 
        // Calculate the updated total cart amount after applying the discount
        Decimal updatedCartTotal = totalCartAmount - discountAmount;
 
        // Update the cart to mark the coupon as applied
        cart.Applied_Coupon__c = coupon.Id;  // Store the applied coupon ID
        update cart;
 
        // Decrease the remaining coupon quantity
        coupon.Remaining_Quantity__c -= 1;
        update coupon;
 
        // Create the wrapper to return the updated cart details
        CartWrapper wrapper = new CartWrapper();
        wrapper.cartId = cart.Id;
        wrapper.totalAmount = updatedCartTotal;
        // Include the cart items
        wrapper.cartItems = new List<CartItemWrapper>();
        for (Cart_Item__c item : cart.Cart_Items__r) {
            CartItemWrapper itemWrapper = new CartItemWrapper();
            itemWrapper.id = item.Id;
            itemWrapper.quantity = item.Quantity__c;
            itemWrapper.totalAmount = item.Total_Amount__c;
            wrapper.cartItems.add(itemWrapper);
        }
 
        return wrapper;
    }
 
    // Wrapper class for cart and item details
    public class CartWrapper {
        @AuraEnabled public String cartId;
        @AuraEnabled public Decimal totalAmount; // Updated total cart amount
        @AuraEnabled public List<CartItemWrapper> cartItems;
    }
 
    public class CartItemWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public Decimal quantity;
        @AuraEnabled public Decimal totalAmount;
    }
}