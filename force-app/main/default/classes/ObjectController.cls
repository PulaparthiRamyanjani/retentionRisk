public with sharing class ObjectController {
    @AuraEnabled(cacheable=true)
    public static List<String> getAllObjectNames() {
        List<String> objectNames = new List<String>();
        // Get all sObject types
        Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
        // Iterate over the global describe and add object names to the list
        for (String objName : globalDescribe.keySet()) {
            objectNames.add(objName);
        }
        return objectNames;
    }
}