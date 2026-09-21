public with sharing class RetentionRiskController {

    // =========================================================
    // GET LATEST RETENTION RISK FOR ACCOUNT
    // =========================================================

    @AuraEnabled(cacheable=false)
    public static Retention_Risk__c getRetentionRisk(Id accountId) {

        if (accountId == null) {
            return null;
        }

        List<Retention_Risk__c> retentionRisks = [
            SELECT
                Id,
                Name,
                Account__c,
                Contact__c,

                Advisor_Engaging__c,
                Cease_Participation__c,
                Change_In_Total__c,
                Declining_GDC__c,
                Declining_Total_Open_Accounts__c,

                Final_Attriation_Risk_Summary__c,

                Forgivable_Loans__c,
                Imminent_Departure__c,
                Major__c,
                Non_Responsive__c,

                Primary_At_Risk_Reason__c,
                Risk_Reason_Comment__c,

                RVP_Q__c,

                Secondary_At_Risk__c,

                Succession_Plan_In__c,

                Tertiary_At_Risk_Reason__c,

                TNPS__c,

                CreatedDate,
                LastModifiedDate

            FROM Retention_Risk__c

            WHERE Account__c = :accountId

            ORDER BY LastModifiedDate DESC

            LIMIT 1
        ];

        if (retentionRisks.isEmpty()) {
            return null;
        }

        return retentionRisks[0];
    }


    // =========================================================
    // SAVE / UPDATE RETENTION RISK
    // =========================================================

    @AuraEnabled
    public static Retention_Risk__c saveRetentionRisk(
        Id accountId,
        String retentionRiskJson
    ) {

        // -----------------------------------------------------
        // Validate Account
        // -----------------------------------------------------

        if (accountId == null) {

            throw new AuraHandledException(
                'Account is required.'
            );
        }

        if (String.isBlank(retentionRiskJson)) {

            throw new AuraHandledException(
                'Retention Risk information is required.'
            );
        }


        // -----------------------------------------------------
        // Validate Account Record Type
        // -----------------------------------------------------

        Account account;

        try {

            account = [
                SELECT
                    Id,
                    RecordTypeId,
                    RecordType.DeveloperName
                FROM Account
                WHERE Id = :accountId
                LIMIT 1
            ];

        } catch (Exception e) {

            throw new AuraHandledException(
                'Unable to find the Account.'
            );
        }


        if (
            account.RecordType == null ||
            account.RecordType.DeveloperName != 'Core_Recruiting'
        ) {

            throw new AuraHandledException(
                'Retention Risk can only be associated with an Account whose Record Type is Core Recruiting.'
            );
        }


        // -----------------------------------------------------
        // Deserialize JSON
        // -----------------------------------------------------

        Retention_Risk__c incomingRecord;

        try {

            incomingRecord =
                (Retention_Risk__c) JSON.deserialize(
                    retentionRiskJson,
                    Retention_Risk__c.class
                );

        } catch (Exception e) {

            throw new AuraHandledException(
                'Unable to process Retention Risk information.'
            );
        }


        // -----------------------------------------------------
        // Always associate with current Account
        // -----------------------------------------------------

        incomingRecord.Account__c = accountId;


        // -----------------------------------------------------
        // Find LATEST existing Retention Risk
        //
        // This is important because the Account tab should
        // always work with the latest Retention Risk.
        // -----------------------------------------------------

        if (incomingRecord.Id == null) {

            List<Retention_Risk__c> existingRecords = [

                SELECT
                    Id

                FROM Retention_Risk__c

                WHERE Account__c = :accountId

                ORDER BY LastModifiedDate DESC

                LIMIT 1
            ];


            if (!existingRecords.isEmpty()) {

                incomingRecord.Id =
                    existingRecords[0].Id;
            }
        }


        // -----------------------------------------------------
        // GREEN LOGIC
        //
        // If Green:
        // Primary disabled
        // Secondary disabled
        // Tertiary disabled
        // Comment hidden / cleared
        // -----------------------------------------------------

        if (
            incomingRecord.Final_Attriation_Risk_Summary__c
            == 'Green'
        ) {

            incomingRecord.Primary_At_Risk_Reason__c = null;

            incomingRecord.Secondary_At_Risk__c = null;

            incomingRecord.Tertiary_At_Risk_Reason__c = null;

            incomingRecord.Risk_Reason_Comment__c = null;
        }


        // -----------------------------------------------------
        // NON-GREEN LOGIC
        //
        // Comment is mandatory for any non-Green value.
        //
        // Primary / Secondary / Tertiary are NOT mandatory.
        // -----------------------------------------------------

        if (
            !String.isBlank(
                incomingRecord.Final_Attriation_Risk_Summary__c
            )
            &&
            incomingRecord.Final_Attriation_Risk_Summary__c
                != 'Green'
        ) {

            if (
                String.isBlank(
                    incomingRecord.Risk_Reason_Comment__c
                )
            ) {

                throw new AuraHandledException(
                    'Risk Reason Comment is required when Final Attriation Risk Summary is not Green.'
                );
            }
        }


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        try {

            upsert incomingRecord;

        } catch (DmlException e) {

            throw new AuraHandledException(
                e.getDmlMessage(0)
            );
        }


        // -----------------------------------------------------
        // Return actual saved record
        // -----------------------------------------------------

        return [
            SELECT
                Id,
                Name,
                Account__c,
                Contact__c,

                Advisor_Engaging__c,
                Cease_Participation__c,
                Change_In_Total__c,
                Declining_GDC__c,
                Declining_Total_Open_Accounts__c,

                Final_Attriation_Risk_Summary__c,

                Forgivable_Loans__c,
                Imminent_Departure__c,
                Major__c,
                Non_Responsive__c,

                Primary_At_Risk_Reason__c,
                Risk_Reason_Comment__c,

                RVP_Q__c,

                Secondary_At_Risk__c,

                Succession_Plan_In__c,

                Tertiary_At_Risk_Reason__c,

                TNPS__c,

                CreatedDate,
                LastModifiedDate

            FROM Retention_Risk__c

            WHERE Id = :incomingRecord.Id

            LIMIT 1
        ];
    }


    // =========================================================
    // GET PICKLIST VALUES
    // =========================================================

    @AuraEnabled(cacheable=true)
    public static Map<String, List<String>> getPicklistValues() {

        Map<String, List<String>> result =
            new Map<String, List<String>>();


        Map<String, Schema.SObjectField> fields =
            Schema.SObjectType.Retention_Risk__c.fields.getMap();


        List<String> fieldNames = new List<String>{

            'Advisor_Engaging__c',

            'Cease_Participation__c',

            'Change_In_Total__c',

            'Declining_GDC__c',

            'Declining_Total_Open_Accounts__c',

            // IMPORTANT:
            // Exact API name
            'Final_Attriation_Risk_Summary__c',

            'Forgivable_Loans__c',

            'Imminent_Departure__c',

            'Major__c',

            'Non_Responsive__c',

            'Primary_At_Risk_Reason__c',

            'RVP_Q__c',

            'Secondary_At_Risk__c',

            'Succession_Plan_In__c',

            'Tertiary_At_Risk_Reason__c',

            'TNPS__c'
        };


        for (String fieldName : fieldNames) {

            List<String> values =
                new List<String>();


            if (!fields.containsKey(fieldName)) {
                continue;
            }


            Schema.DescribeFieldResult fieldDescribe =
                fields.get(fieldName).getDescribe();


            for (
                Schema.PicklistEntry entry :
                fieldDescribe.getPicklistValues()
            ) {

                if (entry.isActive()) {

                    values.add(
                        entry.getValue()
                    );
                }
            }


            result.put(
                fieldName,
                values
            );
        }


        return result;
    }
}