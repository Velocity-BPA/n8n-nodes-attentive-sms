/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-attentivesms/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AttentiveSMS implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Attentive SMS',
    name: 'attentivesms',
    icon: 'file:attentivesms.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Attentive SMS API',
    defaults: {
      name: 'Attentive SMS',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'attentivesmsApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Subscriber',
            value: 'subscriber',
          },
          {
            name: 'Event',
            value: 'event',
          },
          {
            name: 'Message',
            value: 'message',
          },
          {
            name: 'Campaign',
            value: 'campaign',
          },
          {
            name: 'Segment',
            value: 'segment',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          }
        ],
        default: 'subscriber',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['subscriber'],
    },
  },
  options: [
    {
      name: 'Create Subscriber',
      value: 'createSubscriber',
      description: 'Subscribe a new user to SMS marketing',
      action: 'Create subscriber',
    },
    {
      name: 'Get Subscriber',
      value: 'getSubscriber',
      description: 'Retrieve subscriber information by phone number',
      action: 'Get subscriber',
    },
    {
      name: 'List Subscribers',
      value: 'listSubscribers',
      description: 'Get list of subscribers with filtering options',
      action: 'List subscribers',
    },
    {
      name: 'Update Subscriber',
      value: 'updateSubscriber',
      description: 'Update subscriber profile and custom attributes',
      action: 'Update subscriber',
    },
    {
      name: 'Unsubscribe Subscriber',
      value: 'unsubscribeSubscriber',
      description: 'Unsubscribe user from SMS marketing',
      action: 'Unsubscribe subscriber',
    },
  ],
  default: 'createSubscriber',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['event'],
		},
	},
	options: [
		{
			name: 'Create Event',
			value: 'createEvent',
			description: 'Track a custom event for a subscriber',
			action: 'Create an event',
		},
		{
			name: 'Track Purchase',
			value: 'trackPurchase',
			description: 'Track purchase events with order details',
			action: 'Track a purchase',
		},
		{
			name: 'Track Cart Abandonment',
			value: 'trackCartAbandonment',
			description: 'Track cart abandonment events',
			action: 'Track cart abandonment',
		},
		{
			name: 'Track Product View',
			value: 'trackProductView',
			description: 'Track product view events',
			action: 'Track product view',
		},
	],
	default: 'createEvent',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['message'],
		},
	},
	options: [
		{
			name: 'Send Message',
			value: 'sendMessage',
			description: 'Send a one-time SMS message to a subscriber',
			action: 'Send message',
		},
		{
			name: 'Get Message',
			value: 'getMessage',
			description: 'Retrieve message details and delivery status',
			action: 'Get message',
		},
		{
			name: 'List Messages',
			value: 'listMessages',
			description: 'Get list of sent messages with filtering',
			action: 'List messages',
		},
	],
	default: 'sendMessage',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['campaign'] } },
	options: [
		{ name: 'Create Campaign', value: 'createCampaign', description: 'Create a new SMS campaign', action: 'Create a campaign' },
		{ name: 'Get Campaign', value: 'getCampaign', description: 'Retrieve campaign details and performance metrics', action: 'Get a campaign' },
		{ name: 'List Campaigns', value: 'listCampaigns', description: 'Get list of campaigns with filtering options', action: 'List campaigns' },
		{ name: 'Update Campaign', value: 'updateCampaign', description: 'Update campaign details before sending', action: 'Update a campaign' },
		{ name: 'Delete Campaign', value: 'deleteCampaign', description: 'Delete a draft campaign', action: 'Delete a campaign' },
	],
	default: 'createCampaign',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['segment'],
		},
	},
	options: [
		{
			name: 'Create Segment',
			value: 'createSegment',
			description: 'Create a new subscriber segment with filters',
			action: 'Create a segment',
		},
		{
			name: 'Get Segment',
			value: 'getSegment',
			description: 'Retrieve segment details and subscriber count',
			action: 'Get a segment',
		},
		{
			name: 'List Segments',
			value: 'listSegments',
			description: 'Get list of all segments',
			action: 'List segments',
		},
		{
			name: 'Update Segment',
			value: 'updateSegment',
			description: 'Update segment filters and properties',
			action: 'Update a segment',
		},
		{
			name: 'Delete Segment',
			value: 'deleteSegment',
			description: 'Delete a segment',
			action: 'Delete a segment',
		},
	],
	default: 'createSegment',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['webhook'] } },
  options: [
    { name: 'Create Webhook', value: 'createWebhook', description: 'Create a new webhook subscription', action: 'Create webhook' },
    { name: 'Get Webhook', value: 'getWebhook', description: 'Retrieve webhook configuration', action: 'Get webhook' },
    { name: 'List Webhooks', value: 'listWebhooks', description: 'Get list of configured webhooks', action: 'List webhooks' },
    { name: 'Update Webhook', value: 'updateWebhook', description: 'Update webhook configuration', action: 'Update webhook' },
    { name: 'Delete Webhook', value: 'deleteWebhook', description: 'Remove a webhook subscription', action: 'Delete webhook' },
  ],
  default: 'createWebhook',
},
{
  displayName: 'Phone Number',
  name: 'phone',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['subscriber'],
      operation: ['createSubscriber'],
    },
  },
  default: '',
  placeholder: '+1234567890',
  description: 'Phone number in E.164 format (e.g., +1234567890)',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['subscriber'],
      operation: ['createSubscriber'],
    },
  },
  default: '',
  placeholder: 'user@example.com',
  description: 'Email address of the subscriber',
},
{
  displayName: 'Custom Attributes',
  name: 'customAttributes',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['subscriber'],
      operation: ['createSubscriber'],
    },
  },
  default: {},
  placeholder: 'Add Custom Attribute',
  options: [
    {
      name: 'attributes',
      displayName: 'Attribute',
      values: [
        {
          displayName: 'Key',
          name: 'key',
          type: 'string',
          default: '',
          description: 'Attribute key (must be predefined in Attentive dashboard)',
        },
        {
          displayName: 'Value',
          name: 'value',
          type: 'string',
          default: '',
          description: 'Attribute value',
        },
      ],
    },
  ],
  description: 'Custom attributes for the subscriber (must be predefined in Attentive dashboard)',
},
{
  displayName: 'Phone Number',
  name: 'phone',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['subscriber'],
      operation: ['getSubscriber'],
    },
  },
  default: '',
  placeholder: '+1234567890',
  description: 'Phone number in E.164 format (e.g., +1234567890)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['subscriber'],
      operation: ['listSubscribers'],
    },
  },
  default: 100,
  description: 'Maximum number of subscribers to return',
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['subscriber'],
      operation: ['listSubscribers'],
    },
  },
  default: 0,
  description: 'Number of subscribers to skip',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Created After',
  name: 'createdAfter',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['subscriber'],
      operation: ['listSubscribers'],
    },
  },
  default: '',
  description: 'Filter subscribers created after this date',
},
{
  displayName: 'Phone Number',
  name: 'phone',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['subscriber'],
      operation: ['updateSubscriber'],
    },
  },
  default: '',
  placeholder: '+1234567890',
  description: 'Phone number in E.164 format (e.g., +1234567890)',
},
{
  displayName: 'Custom Attributes',
  name: 'customAttributes',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['subscriber'],
      operation: ['updateSubscriber'],
    },
  },
  default: {},
  placeholder: 'Add Custom Attribute',
  options: [
    {
      name: 'attributes',
      displayName: 'Attribute',
      values: [
        {
          displayName: 'Key',
          name: 'key',
          type: 'string',
          default: '',
          description: 'Attribute key (must be predefined in Attentive dashboard)',
        },
        {
          displayName: 'Value',
          name: 'value',
          type: 'string',
          default: '',
          description: 'Attribute value',
        },
      ],
    },
  ],
  description: 'Custom attributes to update for the subscriber',
},
{
  displayName: 'Phone Number',
  name: 'phone',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['subscriber'],
      operation: ['unsubscribeSubscriber'],
    },
  },
  default: '',
  placeholder: '+1234567890',
  description: 'Phone number in E.164 format (e.g., +1234567890)',
},
{
	displayName: 'Phone Number',
	name: 'phone',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['createEvent', 'trackPurchase', 'trackCartAbandonment', 'trackProductView'],
		},
	},
	default: '',
	description: 'Phone number in E.164 format (e.g., +1234567890)',
},
{
	displayName: 'Event Type',
	name: 'eventType',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['createEvent'],
		},
	},
	default: '',
	description: 'The type of custom event to track',
},
{
	displayName: 'Properties',
	name: 'properties',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['createEvent'],
		},
	},
	default: {},
	options: [
		{
			name: 'property',
			displayName: 'Property',
			values: [
				{
					displayName: 'Key',
					name: 'key',
					type: 'string',
					default: '',
					description: 'Property key',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					description: 'Property value',
				},
			],
		},
	],
	description: 'Custom properties for the event',
},
{
	displayName: 'Timestamp',
	name: 'timestamp',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['createEvent'],
		},
	},
	default: '',
	description: 'When the event occurred (ISO 8601 format)',
},
{
	displayName: 'Order ID',
	name: 'orderId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['trackPurchase'],
		},
	},
	default: '',
	description: 'Unique identifier for the order',
},
{
	displayName: 'Revenue',
	name: 'revenue',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['trackPurchase'],
		},
	},
	default: 0,
	description: 'Total revenue amount for the purchase',
},
{
	displayName: 'Items',
	name: 'items',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['trackPurchase', 'trackCartAbandonment'],
		},
	},
	default: {},
	options: [
		{
			name: 'item',
			displayName: 'Item',
			values: [
				{
					displayName: 'Product ID',
					name: 'productId',
					type: 'string',
					default: '',
					description: 'Unique identifier for the product',
				},
				{
					displayName: 'Product Name',
					name: 'productName',
					type: 'string',
					default: '',
					description: 'Name of the product',
				},
				{
					displayName: 'Price',
					name: 'price',
					type: 'number',
					default: 0,
					description: 'Price of the product',
				},
				{
					displayName: 'Quantity',
					name: 'quantity',
					type: 'number',
					default: 1,
					description: 'Quantity of the product',
				},
			],
		},
	],
	description: 'Items in the purchase or cart',
},
{
	displayName: 'Cart Token',
	name: 'cartToken',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['trackCartAbandonment'],
		},
	},
	default: '',
	description: 'Unique identifier for the abandoned cart',
},
{
	displayName: 'Cart URL',
	name: 'cartUrl',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['trackCartAbandonment'],
		},
	},
	default: '',
	description: 'URL to recover the abandoned cart',
},
{
	displayName: 'Product ID',
	name: 'productId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['trackProductView'],
		},
	},
	default: '',
	description: 'Unique identifier for the viewed product',
},
{
	displayName: 'Product URL',
	name: 'productUrl',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['trackProductView'],
		},
	},
	default: '',
	description: 'URL of the viewed product',
},
{
	displayName: 'Price',
	name: 'price',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['trackProductView'],
		},
	},
	default: 0,
	description: 'Price of the viewed product',
},
{
	displayName: 'Phone Number',
	name: 'phone',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendMessage'],
		},
	},
	default: '',
	placeholder: '+1234567890',
	description: 'Phone number in E.164 format (e.g., +1234567890)',
},
{
	displayName: 'Message Text',
	name: 'message',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendMessage'],
		},
	},
	default: '',
	description: 'The SMS message content to send',
},
{
	displayName: 'Media URL',
	name: 'media_url',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendMessage'],
		},
	},
	default: '',
	description: 'Optional URL for media attachment (MMS)',
},
{
	displayName: 'Message ID',
	name: 'message_id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['getMessage'],
		},
	},
	default: '',
	description: 'The unique identifier of the message to retrieve',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['listMessages'],
		},
	},
	default: 50,
	description: 'Maximum number of messages to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['listMessages'],
		},
	},
	default: 0,
	description: 'Number of messages to skip for pagination',
},
{
	displayName: 'Filter by Phone',
	name: 'phone',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['listMessages'],
		},
	},
	default: '',
	placeholder: '+1234567890',
	description: 'Filter messages by phone number in E.164 format',
},
{
	displayName: 'Filter by Status',
	name: 'status',
	type: 'options',
	required: false,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['listMessages'],
		},
	},
	options: [
		{
			name: 'All',
			value: '',
		},
		{
			name: 'Sent',
			value: 'sent',
		},
		{
			name: 'Delivered',
			value: 'delivered',
		},
		{
			name: 'Failed',
			value: 'failed',
		},
		{
			name: 'Pending',
			value: 'pending',
		},
	],
	default: '',
	description: 'Filter messages by delivery status',
},
{
	displayName: 'Campaign Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['campaign'], operation: ['createCampaign'] } },
	default: '',
	description: 'Name of the SMS campaign',
},
{
	displayName: 'Message',
	name: 'message',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['campaign'], operation: ['createCampaign'] } },
	default: '',
	description: 'SMS message content to send',
	typeOptions: {
		rows: 4,
	},
},
{
	displayName: 'Segment ID',
	name: 'segment_id',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['campaign'], operation: ['createCampaign'] } },
	default: '',
	description: 'Target audience segment identifier',
},
{
	displayName: 'Send At',
	name: 'send_at',
	type: 'dateTime',
	required: false,
	displayOptions: { show: { resource: ['campaign'], operation: ['createCampaign'] } },
	default: '',
	description: 'Scheduled time to send the campaign (leave empty for immediate send)',
},
{
	displayName: 'Campaign ID',
	name: 'campaign_id',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['campaign'], operation: ['getCampaign', 'updateCampaign', 'deleteCampaign'] } },
	default: '',
	description: 'Unique identifier of the campaign',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: { show: { resource: ['campaign'], operation: ['listCampaigns'] } },
	default: 50,
	description: 'Number of campaigns to retrieve (max 100)',
	typeOptions: {
		minValue: 1,
		maxValue: 100,
	},
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	required: false,
	displayOptions: { show: { resource: ['campaign'], operation: ['listCampaigns'] } },
	default: 0,
	description: 'Number of campaigns to skip for pagination',
	typeOptions: {
		minValue: 0,
	},
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	required: false,
	displayOptions: { show: { resource: ['campaign'], operation: ['listCampaigns'] } },
	options: [
		{ name: 'All', value: '' },
		{ name: 'Draft', value: 'draft' },
		{ name: 'Scheduled', value: 'scheduled' },
		{ name: 'Sent', value: 'sent' },
		{ name: 'Failed', value: 'failed' },
	],
	default: '',
	description: 'Filter campaigns by status',
},
{
	displayName: 'Campaign Name',
	name: 'name',
	type: 'string',
	required: false,
	displayOptions: { show: { resource: ['campaign'], operation: ['updateCampaign'] } },
	default: '',
	description: 'Updated name of the SMS campaign',
},
{
	displayName: 'Message',
	name: 'message',
	type: 'string',
	required: false,
	displayOptions: { show: { resource: ['campaign'], operation: ['updateCampaign'] } },
	default: '',
	description: 'Updated SMS message content',
	typeOptions: {
		rows: 4,
	},
},
{
	displayName: 'Send At',
	name: 'send_at',
	type: 'dateTime',
	required: false,
	displayOptions: { show: { resource: ['campaign'], operation: ['updateCampaign'] } },
	default: '',
	description: 'Updated scheduled time to send the campaign',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['createSegment'],
		},
	},
	default: '',
	description: 'Name of the segment',
},
{
	displayName: 'Filters',
	name: 'filters',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['createSegment'],
		},
	},
	default: '{}',
	description: 'Filters to define the segment criteria as JSON object',
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['createSegment'],
		},
	},
	default: '',
	description: 'Description of the segment',
},
{
	displayName: 'Segment ID',
	name: 'segmentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['getSegment'],
		},
	},
	default: '',
	description: 'ID of the segment to retrieve',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['listSegments'],
		},
	},
	default: 50,
	description: 'Maximum number of segments to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['listSegments'],
		},
	},
	default: 0,
	description: 'Number of segments to skip',
},
{
	displayName: 'Segment ID',
	name: 'segmentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['updateSegment'],
		},
	},
	default: '',
	description: 'ID of the segment to update',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['updateSegment'],
		},
	},
	default: '',
	description: 'Updated name of the segment',
},
{
	displayName: 'Filters',
	name: 'filters',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['updateSegment'],
		},
	},
	default: '{}',
	description: 'Updated filters to define the segment criteria as JSON object',
},
{
	displayName: 'Segment ID',
	name: 'segmentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['deleteSegment'],
		},
	},
	default: '',
	description: 'ID of the segment to delete',
},
{
  displayName: 'Webhook URL',
  name: 'url',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['webhook'], operation: ['createWebhook'] } },
  default: '',
  description: 'The HTTPS URL where webhook events will be sent',
},
{
  displayName: 'Events',
  name: 'events',
  type: 'multiOptions',
  required: true,
  displayOptions: { show: { resource: ['webhook'], operation: ['createWebhook'] } },
  options: [
    { name: 'SMS Sent', value: 'sms.sent' },
    { name: 'SMS Delivered', value: 'sms.delivered' },
    { name: 'SMS Failed', value: 'sms.failed' },
    { name: 'Subscriber Created', value: 'subscriber.created' },
    { name: 'Subscriber Updated', value: 'subscriber.updated' },
    { name: 'Subscriber Unsubscribed', value: 'subscriber.unsubscribed' },
  ],
  default: [],
  description: 'Types of events to receive webhook notifications for',
},
{
  displayName: 'Secret',
  name: 'secret',
  type: 'string',
  displayOptions: { show: { resource: ['webhook'], operation: ['createWebhook'] } },
  default: '',
  description: 'Optional secret for webhook signature verification',
},
{
  displayName: 'Webhook ID',
  name: 'webhookId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['webhook'], operation: ['getWebhook'] } },
  default: '',
  description: 'ID of the webhook to retrieve',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['webhook'], operation: ['listWebhooks'] } },
  default: 50,
  description: 'Maximum number of webhooks to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['webhook'], operation: ['listWebhooks'] } },
  default: 0,
  description: 'Number of webhooks to skip',
},
{
  displayName: 'Webhook ID',
  name: 'webhookId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['webhook'], operation: ['updateWebhook'] } },
  default: '',
  description: 'ID of the webhook to update',
},
{
  displayName: 'Webhook URL',
  name: 'url',
  type: 'string',
  displayOptions: { show: { resource: ['webhook'], operation: ['updateWebhook'] } },
  default: '',
  description: 'The HTTPS URL where webhook events will be sent',
},
{
  displayName: 'Events',
  name: 'events',
  type: 'multiOptions',
  displayOptions: { show: { resource: ['webhook'], operation: ['updateWebhook'] } },
  options: [
    { name: 'SMS Sent', value: 'sms.sent' },
    { name: 'SMS Delivered', value: 'sms.delivered' },
    { name: 'SMS Failed', value: 'sms.failed' },
    { name: 'Subscriber Created', value: 'subscriber.created' },
    { name: 'Subscriber Updated', value: 'subscriber.updated' },
    { name: 'Subscriber Unsubscribed', value: 'subscriber.unsubscribed' },
  ],
  default: [],
  description: 'Types of events to receive webhook notifications for',
},
{
  displayName: 'Secret',
  name: 'secret',
  type: 'string',
  displayOptions: { show: { resource: ['webhook'], operation: ['updateWebhook'] } },
  default: '',
  description: 'Optional secret for webhook signature verification',
},
{
  displayName: 'Webhook ID',
  name: 'webhookId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['webhook'], operation: ['deleteWebhook'] } },
  default: '',
  description: 'ID of the webhook to delete',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'subscriber':
        return [await executeSubscriberOperations.call(this, items)];
      case 'event':
        return [await executeEventOperations.call(this, items)];
      case 'message':
        return [await executeMessageOperations.call(this, items)];
      case 'campaign':
        return [await executeCampaignOperations.call(this, items)];
      case 'segment':
        return [await executeSegmentOperations.call(this, items)];
      case 'webhook':
        return [await executeWebhookOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeSubscriberOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('attentivesmsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createSubscriber': {
          const phone = this.getNodeParameter('phone', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const customAttributes = this.getNodeParameter('customAttributes', i) as any;

          const body: any = {
            phone,
          };

          if (email) {
            body.email = email;
          }

          if (customAttributes && customAttributes.attributes) {
            body.custom_attributes = {};
            for (const attr of customAttributes.attributes) {
              body.custom_attributes[attr.key] = attr.value;
            }
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/subscribers`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubscriber': {
          const phone = this.getNodeParameter('phone', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subscribers/${encodeURIComponent(phone)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listSubscribers': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const createdAfter = this.getNodeParameter('createdAfter', i) as string;

          const queryParams: any = {
            limit,
            offset,
          };

          if (createdAfter) {
            queryParams.created_after = createdAfter;
          }

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subscribers?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSubscriber': {
          const phone = this.getNodeParameter('phone', i) as string;
          const customAttributes = this.getNodeParameter('customAttributes', i) as any;

          const body: any = {};

          if (customAttributes && customAttributes.attributes) {
            body.custom_attributes = {};
            for (const attr of customAttributes.attributes) {
              body.custom_attributes[attr.key] = attr.value;
            }
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/subscribers/${encodeURIComponent(phone)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'unsubscribeSubscriber': {
          const phone = this.getNodeParameter('phone', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/subscribers/${encodeURIComponent(phone)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeEventOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('attentivesmsApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createEvent': {
					const phone = this.getNodeParameter('phone', i) as string;
					const eventType = this.getNodeParameter('eventType', i) as string;
					const propertiesParam = this.getNodeParameter('properties', i) as any;
					const timestamp = this.getNodeParameter('timestamp', i) as string;

					const properties: any = {};
					if (propertiesParam.property) {
						for (const prop of propertiesParam.property) {
							properties[prop.key] = prop.value;
						}
					}

					const body: any = {
						phone,
						event_type: eventType,
						properties,
					};

					if (timestamp) {
						body.timestamp = timestamp;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/events`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'trackPurchase': {
					const phone = this.getNodeParameter('phone', i) as string;
					const orderId = this.getNodeParameter('orderId', i) as string;
					const revenue = this.getNodeParameter('revenue', i) as number;
					const itemsParam = this.getNodeParameter('items', i) as any;

					const items: any[] = [];
					if (itemsParam.item) {
						for (const item of itemsParam.item) {
							items.push({
								product_id: item.productId,
								product_name: item.productName,
								price: item.price,
								quantity: item.quantity,
							});
						}
					}

					const body: any = {
						phone,
						order_id: orderId,
						revenue,
						items,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/events/purchases`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'trackCartAbandonment': {
					const phone = this.getNodeParameter('phone', i) as string;
					const cartToken = this.getNodeParameter('cartToken', i) as string;
					const cartUrl = this.getNodeParameter('cartUrl', i) as string;
					const itemsParam = this.getNodeParameter('items', i) as any;

					const items: any[] = [];
					if (itemsParam.item) {
						for (const item of itemsParam.item) {
							items.push({
								product_id: item.productId,
								product_name: item.productName,
								price: item.price,
								quantity: item.quantity,
							});
						}
					}

					const body: any = {
						phone,
						cart_token: cartToken,
						items,
					};

					if (cartUrl) {
						body.cart_url = cartUrl;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/events/cart-abandonment`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'trackProductView': {
					const phone = this.getNodeParameter('phone', i) as string;
					const productId = this.getNodeParameter('productId', i) as string;
					const productUrl = this.getNodeParameter('productUrl', i) as string;
					const price = this.getNodeParameter('price', i) as number;

					const body: any = {
						phone,
						product_id: productId,
					};

					if (productUrl) {
						body.product_url = productUrl;
					}

					if (price) {
						body.price = price;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/events/product-views`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeMessageOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('attentivesmsApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'sendMessage': {
					const phone = this.getNodeParameter('phone', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const media_url = this.getNodeParameter('media_url', i) as string;

					const body: any = {
						phone,
						message,
					};

					if (media_url) {
						body.media_url = media_url;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/messages`,
						headers: {
							'Authorization': `Bearer ${credentials.api_key}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getMessage': {
					const message_id = this.getNodeParameter('message_id', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/messages/${message_id}`,
						headers: {
							'Authorization': `Bearer ${credentials.api_key}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'listMessages': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const phone = this.getNodeParameter('phone', i) as string;
					const status = this.getNodeParameter('status', i) as string;

					const qs: any = {
						limit,
						offset,
					};

					if (phone) {
						qs.phone = phone;
					}

					if (status) {
						qs.status = status;
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/messages`,
						headers: {
							'Authorization': `Bearer ${credentials.api_key}`,
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeCampaignOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('attentivesmsApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createCampaign': {
					const name = this.getNodeParameter('name', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const segment_id = this.getNodeParameter('segment_id', i) as string;
					const send_at = this.getNodeParameter('send_at', i) as string;

					const body: any = {
						name,
						message,
						segment_id,
					};

					if (send_at) {
						body.send_at = send_at;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/campaigns`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCampaign': {
					const campaign_id = this.getNodeParameter('campaign_id', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/campaigns/${campaign_id}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'listCampaigns': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const status = this.getNodeParameter('status', i) as string;

					const qs: any = {
						limit,
						offset,
					};

					if (status) {
						qs.status = status;
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/campaigns`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateCampaign': {
					const campaign_id = this.getNodeParameter('campaign_id', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const send_at = this.getNodeParameter('send_at', i) as string;

					const body: any = {};

					if (name) {
						body.name = name;
					}
					if (message) {
						body.message = message;
					}
					if (send_at) {
						body.send_at = send_at;
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/campaigns/${campaign_id}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteCampaign': {
					const campaign_id = this.getNodeParameter('campaign_id', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/campaigns/${campaign_id}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeSegmentOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('attentivesmsApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createSegment': {
					const name = this.getNodeParameter('name', i) as string;
					const filters = this.getNodeParameter('filters', i) as string;
					const description = this.getNodeParameter('description', i) as string;

					const body: any = {
						name,
						filters: JSON.parse(filters),
					};

					if (description) {
						body.description = description;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/segments`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSegment': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/segments/${segmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'listSegments': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const qs: any = {};
					if (limit) qs.limit = limit;
					if (offset) qs.offset = offset;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/segments`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateSegment': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const filters = this.getNodeParameter('filters', i) as string;

					const body: any = {};
					if (name) body.name = name;
					if (filters) body.filters = JSON.parse(filters);

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/segments/${segmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteSegment': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/segments/${segmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeWebhookOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('attentivesmsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createWebhook': {
          const url = this.getNodeParameter('url', i) as string;
          const events = this.getNodeParameter('events', i) as string[];
          const secret = this.getNodeParameter('secret', i) as string;

          const body: any = {
            url,
            events,
          };

          if (secret) {
            body.secret = secret;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/webhooks`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getWebhook': {
          const webhookId = this.getNodeParameter('webhookId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/webhooks/${webhookId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listWebhooks': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const qs: any = {
            limit,
            offset,
          };

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/webhooks`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateWebhook': {
          const webhookId = this.getNodeParameter('webhookId', i) as string;
          const url = this.getNodeParameter('url', i) as string;
          const events = this.getNodeParameter('events', i) as string[];
          const secret = this.getNodeParameter('secret', i) as string;

          const body: any = {};

          if (url) body.url = url;
          if (events.length > 0) body.events = events;
          if (secret) body.secret = secret;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/webhooks/${webhookId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteWebhook': {
          const webhookId = this.getNodeParameter('webhookId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/webhooks/${webhookId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
