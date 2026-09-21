public class ContactAndLeadSearch {
    public static list<list<sObject>> searchContactsAndleads(String lastName){
        list<list< sObject >> ContactLeadList = [ Find : lastName IN ALL FIELDS
                                                 RETURNING contact(name),
                                                 lead (Name) ];
        return ContactLeadList;
    }

}