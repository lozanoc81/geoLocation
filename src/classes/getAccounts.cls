public with sharing class getAccounts { 
    @AuraEnabled
    public static List < account > fetchAccount(String searchKeyWord) {
        String searchKey = searchKeyWord + '%';
        List < Account > returnList = new List < Account > ();
        List < Account > lstOfAccount = [select id, Name, Type, Industry, Phone, Fax, BillingLatitude, BillingLongitude  from account
                                         where Name LIKE: searchKey LIMIT 500];
        
        for (Account acc: lstOfAccount) {
            returnList.add(acc);
        }
        return returnList;
    }
    
    @AuraEnabled
    public static Account getAccount(String searchId, Decimal Latitude, Decimal Longitude) {
        Account indexOfAccount = [select id, Name, Type, Industry, Phone, Fax, BillingLatitude, BillingLongitude  from account
                                         where Id =: searchId LIMIT 1];
        
        indexOfAccount.Custom_Geolocation__Latitude__s = Latitude;
        indexOfAccount.Custom_Geolocation__Longitude__s = Longitude;
        
        update indexOfAccount;
        
        Account updateAccount = [select id, Name, Type, Industry, Phone, Fax, BillingLatitude, BillingLongitude, Custom_Geolocation__Latitude__s,Custom_Geolocation__Longitude__s, Distance__c from account
                                         where Id =: searchId LIMIT 1];
        
        return updateAccount;
    }
}