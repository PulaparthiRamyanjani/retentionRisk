public class InsertCustomerRecord {
    public string FirstName {get;set;}
    public string LastName {get;set;}
    public string Phone {get;set;}
    public string EmailId {get;set;}
    public PageReference insertCustomer() {
        Contact customer = new Contact();
        customer.FirstName = FirstName;
        customer.LastName = LastName;
        customer.Phone = Phone;
        customer.Email = EmailId;
        insert customer;
        PageReference pageref = new PageReference('/apex/thankspage');
        return pageref;
    }
}