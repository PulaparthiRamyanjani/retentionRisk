public class PayPalAPI {
    private static final String CLIENT_ID = 'AXg5AxFt7f9zDAkxHplXFDDuAg8l1kM6hcpLytOz-8cNSSSI9Y-fauBDA2B53d-dgxA3N0f5Iq96B3gO';
    private static final String CLIENT_SECRET = 'ENiGzQTCnYC7-fkty8-Vm9CxF-jAqBZJk8NShAS-7G4cEyiR8wI1D6BzXflHRYbQcP69rWZcOx_4H0FX';
    private static final String TOKEN_ENDPOINT = 'https://api.sandbox.paypal.com/v1/oauth2/token';

    // Fetches access token from PayPal
    @AuraEnabled
    public static String getAccessToken() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(TOKEN_ENDPOINT);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setHeader('Authorization', 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(CLIENT_ID + ':' + CLIENT_SECRET)));
        req.setBody('grant_type=client_credentials&scope=openid profile email https://uri.paypal.com/services/payments/create https://uri.paypal.com/services/payments/payment/authcapture');

        Http http = new Http();
        HttpResponse res = http.send(req);

        System.debug('Access Token Response Status Code: ' + res.getStatusCode());
        System.debug('Access Token Response Body: ' + res.getBody());

        if (res.getStatusCode() == 200) {
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            return (String) responseMap.get('access_token');
        } else {
            System.debug('Error fetching access token: ' + res.getBody());
            throw new AuraHandledException('Error fetching access token: ' + res.getBody());
        }
    }

    // Creates a payment and returns approval URL for user redirection
    @AuraEnabled
    public static String createPayment(Decimal amount, String currencyCode) {
        String accessToken = getAccessToken();
        if (accessToken == null) {
            throw new AuraHandledException('Error: Unable to fetch access token');
        }

        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:PayPalAPI/v1/payments/payment');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Authorization', 'Bearer ' + accessToken);

        Map<String, Object> requestBody = new Map<String, Object>{
            'intent' => 'sale',
            'payer' => new Map<String, Object>{ 'payment_method' => 'paypal' },
            'transactions' => new List<Object>{
                new Map<String, Object>{
                    'amount' => new Map<String, Object>{
                        'total' => String.valueOf(amount),
                        'currency' => currencyCode
                    }
                }
            },
            'redirect_urls' => new Map<String, String>{
                'return_url' => 'https://your-org-domain.lightning.force.com/lightning/n/Order_Details', // Replace with actual return URL
                'cancel_url' => 'https://your-org-domain.lightning.force.com/lightning/n/Order_Details'  // Replace with actual cancel URL
            }
        };

        req.setBody(JSON.serialize(requestBody));
        Http http = new Http();
        HttpResponse res = http.send(req);

        System.debug('Create Payment Response Status Code: ' + res.getStatusCode());
        System.debug('Create Payment Response Body: ' + res.getBody());

        if (res.getStatusCode() == 201) {
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            List<Object> links = (List<Object>) responseMap.get('links');

            for (Object linkObj : links) {
                Map<String, Object> link = (Map<String, Object>) linkObj;
                if (link.get('rel') == 'approval_url') {
                    return (String) link.get('href'); // Return the approval URL for redirection
                }
            }
            throw new AuraHandledException('Error: Approval URL not found in response.');
        } else {
            System.debug('Error creating payment: ' + res.getBody());
            throw new AuraHandledException('Error creating payment: ' + res.getBody());
        }
    }
}