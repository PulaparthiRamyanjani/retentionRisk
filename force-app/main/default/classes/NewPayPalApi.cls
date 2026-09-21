public class NewPayPalApi {

    private static final String CLIENT_ID = 'AXg5AxFt7f9zDAkxHplXFDDuAg8l1kM6hcpLytOz-8cNSSSI9Y-fauBDA2B53d-dgxA3N0f5Iq96B3gO';
    private static final String CLIENT_SECRET = 'ENiGzQTCnYC7-fkty8-Vm9CxF-jAqBZJk8NShAS-7G4cEyiR8wI1D6BzXflHRYbQcP69rWZcOx_4H0FX';
    private static final String TOKEN_ENDPOINT = 'https://api.sandbox.paypal.com/v1/oauth2/token';
    private static final String PAYMENT_ENDPOINT = 'https://api.sandbox.paypal.com/v1/payments/payment';

    // 
    @AuraEnabled
    public static String getAccessToken() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(TOKEN_ENDPOINT);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setHeader('Authorization', 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(CLIENT_ID + ':' + CLIENT_SECRET)));
        req.setBody('grant_type=client_credentials');
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() == 200) {
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            return (String) responseMap.get('access_token');
        } else {
            System.debug('Error fetching access token: ' + res.getBody());
            return null;
        }
    }
    
   
    @AuraEnabled(cacheable=true)
    public static Map<String, String> createPayment(Decimal amount, String currencyCode) {
        String accessToken = getAccessToken();
        if (accessToken == null) {
            throw new AuraHandledException('Unable to retrieve PayPal access token');
        }

        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.sandbox.paypal.com/v1/payments/payment');
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
                    },
                    'description' => 'Payment for order'
                }
            },
            'redirect_urls' => new Map<String, Object>{
                'return_url' => 'https://playful-raccoon-2nllkc-dev-ed.trailblaze.my.site.com',
                'cancel_url' => 'https://playful-raccoon-2nllkc-dev-ed.trailblaze.my.site.com'
            }
        };
        req.setBody(JSON.serialize(requestBody));

        Http http = new Http();
        HttpResponse res = http.send(req);
        if (res.getStatusCode() == 201) {
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            List<Object> links = (List<Object>) responseMap.get('links');
            String approvalUrl;
            
            
            for (Object linkObj : links) {
                Map<String, Object> link = (Map<String, Object>) linkObj;
                if (link.get('rel') == 'approval_url') {
                    approvalUrl = (String) link.get('href');
                    break;
                }
            }

            Map<String, String> result = new Map<String, String>{
                'paymentId' => (String) responseMap.get('id'),
                'approvalUrl' => approvalUrl
            };
            return result;
        } else {
            throw new AuraHandledException('Error creating payment: ' + res.getBody());
        }
    }
@AuraEnabled
public static String capturePayment(String paymentId, String payerId) {
    String accessToken = getAccessToken(); 
    if (accessToken == null) {
        return 'Error: Unable to fetch access token';
    }

    HttpRequest req = new HttpRequest();
    req.setEndpoint('https://api.sandbox.paypal.com/v1/payments/payment/' + paymentId + '/execute');
    req.setMethod('POST');
    req.setHeader('Content-Type', 'application/json');
    req.setHeader('Authorization', 'Bearer ' + accessToken);


    req.setBody(JSON.serialize(new Map<String, String>{'payer_id' => payerId}));

    Http http = new Http();
    HttpResponse res = http.send(req);

    if (res.getStatusCode() == 200 || res.getStatusCode() == 201) {
      
        Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
        return 'Payment Captured Successfully with ID: ' + (String) responseMap.get('id');
    } else {
        return 'Error capturing payment: ' + res.getBody();
    }
}



}