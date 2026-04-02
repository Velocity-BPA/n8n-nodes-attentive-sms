# n8n-nodes-attentive-sms

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Attentive SMS, enabling automated text messaging workflows for 6 core resources. Connect your n8n automations to Attentive's powerful SMS marketing platform for subscriber management, campaign automation, event tracking, and webhook handling.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![SMS Marketing](https://img.shields.io/badge/SMS-Marketing-green)
![Attentive](https://img.shields.io/badge/Attentive-SMS-orange)
![Automation](https://img.shields.io/badge/Marketing-Automation-purple)

## Features

- **Subscriber Management** - Create, update, retrieve, and manage SMS subscriber lists and profiles
- **Event Tracking** - Send custom events and track subscriber behavior across your marketing funnels
- **Message Operations** - Send personalized SMS messages and retrieve message delivery status
- **Campaign Control** - Create, manage, and monitor SMS marketing campaigns programmatically
- **Segment Targeting** - Build and manage subscriber segments for precise audience targeting
- **Webhook Integration** - Configure real-time webhook endpoints for instant event notifications
- **Bulk Operations** - Process large subscriber lists and batch operations efficiently
- **Error Handling** - Comprehensive error handling with detailed response codes and retry logic

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-attentive-sms`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-attentive-sms
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-attentive-sms.git
cd n8n-nodes-attentive-sms
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-attentive-sms
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Attentive SMS API key from account settings | Yes |
| Environment | Production or Sandbox environment | Yes |
| Base URL | Attentive API base URL (auto-configured by environment) | No |

## Resources & Operations

### 1. Subscriber

| Operation | Description |
|-----------|-------------|
| Create | Add new subscriber to SMS list with phone number and attributes |
| Get | Retrieve subscriber details by phone number or subscriber ID |
| Update | Modify subscriber attributes, preferences, and subscription status |
| Delete | Remove subscriber from SMS list and all segments |
| List | Get paginated list of subscribers with filtering options |
| Subscribe | Opt-in subscriber to specific SMS programs or campaigns |
| Unsubscribe | Opt-out subscriber from SMS communications |

### 2. Event

| Operation | Description |
|-----------|-------------|
| Send | Track custom events for subscribers (purchases, page views, etc.) |
| Get | Retrieve event history for specific subscriber |
| List | Get all events with filtering by date range and event type |
| Delete | Remove specific event from subscriber timeline |
| Batch Send | Send multiple events in single API call for efficiency |

### 3. Message

| Operation | Description |
|-----------|-------------|
| Send | Send individual SMS message to subscriber with personalization |
| Get | Retrieve message details and delivery status by message ID |
| List | Get message history with filtering and pagination |
| Get Status | Check delivery status and engagement metrics for sent message |
| Schedule | Schedule SMS message for future delivery |
| Cancel | Cancel scheduled message before delivery |

### 4. Campaign

| Operation | Description |
|-----------|-------------|
| Create | Create new SMS marketing campaign with targeting rules |
| Get | Retrieve campaign details, statistics, and performance metrics |
| Update | Modify campaign settings, content, and targeting parameters |
| Delete | Remove campaign and stop all scheduled messages |
| List | Get all campaigns with filtering and sorting options |
| Start | Launch campaign and begin message delivery |
| Stop | Pause active campaign and halt message sending |
| Clone | Duplicate existing campaign with same settings |

### 5. Segment

| Operation | Description |
|-----------|-------------|
| Create | Build new subscriber segment with filtering criteria |
| Get | Retrieve segment details and current subscriber count |
| Update | Modify segment rules and inclusion criteria |
| Delete | Remove segment (subscribers remain, targeting removed) |
| List | Get all segments with metadata and subscriber counts |
| Get Subscribers | Retrieve paginated list of subscribers in segment |
| Add Subscribers | Manually add specific subscribers to segment |
| Remove Subscribers | Remove specific subscribers from segment |

### 6. Webhook

| Operation | Description |
|-----------|-------------|
| Create | Configure webhook endpoint for real-time event notifications |
| Get | Retrieve webhook configuration and delivery statistics |
| Update | Modify webhook URL, events, and authentication settings |
| Delete | Remove webhook and stop event notifications |
| List | Get all configured webhooks with status information |
| Test | Send test payload to webhook endpoint for validation |
| Get Logs | Retrieve webhook delivery logs and error details |

## Usage Examples

```javascript
// Create new subscriber with custom attributes
{
  "phoneNumber": "+1234567890",
  "email": "customer@example.com",
  "attributes": {
    "firstName": "John",
    "lastName": "Doe",
    "birthday": "1990-05-15",
    "preferredStore": "NYC Store"
  },
  "subscribeToPrograms": ["welcome-series", "promotions"]
}
```

```javascript
// Send purchase event for subscriber
{
  "phoneNumber": "+1234567890",
  "eventType": "purchase",
  "properties": {
    "orderId": "ORD-12345",
    "totalAmount": 89.99,
    "currency": "USD",
    "items": [
      {
        "productId": "PROD-001",
        "name": "Premium T-Shirt",
        "price": 29.99,
        "quantity": 2
      }
    ]
  }
}
```

```javascript
// Create targeted campaign for high-value customers
{
  "name": "VIP Customer Exclusive",
  "message": "Hi {{firstName}}! Exclusive 30% off just for you: {{couponCode}}",
  "segmentId": "seg_high_value_customers",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "personalization": {
    "couponCode": "VIP30OFF"
  }
}
```

```javascript
// Configure webhook for real-time subscriber events
{
  "url": "https://your-app.com/webhooks/attentive",
  "events": ["subscriber.created", "subscriber.updated", "message.delivered"],
  "headers": {
    "Authorization": "Bearer your-webhook-secret"
  },
  "retryPolicy": {
    "maxRetries": 3,
    "retryDelay": 5000
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or missing API key | Verify API key in credentials configuration |
| 400 Bad Request | Invalid phone number format or missing required fields | Ensure phone numbers include country code (+1) and all required fields are provided |
| 429 Rate Limited | Too many API requests in short time period | Implement delays between requests or reduce concurrent operations |
| 404 Not Found | Subscriber, campaign, or resource doesn't exist | Verify resource IDs and check if subscriber is in your account |
| 422 Unprocessable Entity | Invalid subscriber data or duplicate phone number | Check data format and handle duplicate subscribers appropriately |
| 500 Internal Server Error | Attentive service temporarily unavailable | Retry request after delay or check Attentive status page |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-attentive-sms/issues)
- **Attentive API Documentation**: [Attentive Developer Docs](https://docs.attentive.com/openapi/reference/)
- **SMS Marketing Best Practices**: [Attentive Help Center](https://help.attentive.com/)