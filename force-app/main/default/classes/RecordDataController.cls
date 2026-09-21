public class RecordDataController {
     @AuraEnabled(cacheable=true)
    public static Map<String, List<SObject>> getRecentRecords() {
        Map<String, List<SObject>> result = new Map<String, List<SObject>>();
        List<Case> cases = [
            SELECT Id, CaseNumber, Subject, LastModifiedDate 
            FROM Case 
            ORDER BY LastModifiedDate DESC 
            LIMIT 3
        ];
        result.put('Cases', cases);
        List<Contact> contacts = [
            SELECT Id, Name, Email, LastModifiedDate 
            FROM Contact 
            ORDER BY LastModifiedDate DESC 
            LIMIT 3
        ];
        result.put('Contacts', contacts);
        List<Opportunity> opportunities = [
            SELECT Id, Name, StageName, LastModifiedDate 
            FROM Opportunity 
            ORDER BY LastModifiedDate DESC 
            LIMIT 3
        ];
        result.put('Opportunities', opportunities);
        return result;
    }
}