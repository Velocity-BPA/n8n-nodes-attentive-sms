/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AttentiveSMS } from '../nodes/Attentive SMS/Attentive SMS.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AttentiveSMS Node', () => {
  let node: AttentiveSMS;

  beforeAll(() => {
    node = new AttentiveSMS();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Attentive SMS');
      expect(node.description.name).toBe('attentivesms');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Subscriber Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.attentivemobile.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createSubscriber', () => {
    it('should create a subscriber successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createSubscriber')
        .mockReturnValueOnce('+1234567890')
        .mockReturnValueOnce('test@example.com')
        .mockReturnValueOnce({ attributes: [{ key: 'firstName', value: 'John' }] });

      const mockResponse = { id: '123', phone: '+1234567890', email: 'test@example.com' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSubscriberOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.attentivemobile.com/v1/subscribers',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          phone: '+1234567890',
          email: 'test@example.com',
          custom_attributes: { firstName: 'John' },
        },
        json: true,
      });
    });

    it('should handle createSubscriber error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createSubscriber')
        .mockReturnValueOnce('+1234567890')
        .mockReturnValueOnce('test@example.com')
        .mockReturnValueOnce({});

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeSubscriberOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getSubscriber', () => {
    it('should get a subscriber successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSubscriber')
        .mockReturnValueOnce('+1234567890');

      const mockResponse = { id: '123', phone: '+1234567890', email: 'test@example.com' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSubscriberOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.attentivemobile.com/v1/subscribers/%2B1234567890',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('listSubscribers', () => {
    it('should list subscribers successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listSubscribers')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce('2023-01-01T00:00:00Z');

      const mockResponse = { subscribers: [{ id: '123', phone: '+1234567890' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSubscriberOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('updateSubscriber', () => {
    it('should update a subscriber successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateSubscriber')
        .mockReturnValueOnce('+1234567890')
        .mockReturnValueOnce({ attributes: [{ key: 'lastName', value: 'Doe' }] });

      const mockResponse = { id: '123', phone: '+1234567890', custom_attributes: { lastName: 'Doe' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSubscriberOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('unsubscribeSubscriber', () => {
    it('should unsubscribe a subscriber successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('unsubscribeSubscriber')
        .mockReturnValueOnce('+1234567890');

      const mockResponse = { success: true };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSubscriberOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.attentivemobile.com/v1/subscribers/%2B1234567890',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });
});

describe('Event Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.attentivemobile.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should create event successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createEvent')
			.mockReturnValueOnce('+1234567890')
			.mockReturnValueOnce('custom_event')
			.mockReturnValueOnce({ property: [{ key: 'test', value: 'value' }] })
			.mockReturnValueOnce('2023-01-01T00:00:00Z');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

		const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.attentivemobile.com/v1/events',
			headers: {
				'Authorization': 'Bearer test-api-key',
				'Content-Type': 'application/json',
			},
			body: {
				phone: '+1234567890',
				event_type: 'custom_event',
				properties: { test: 'value' },
				timestamp: '2023-01-01T00:00:00Z',
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { success: true },
			pairedItem: { item: 0 },
		}]);
	});

	it('should track purchase successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('trackPurchase')
			.mockReturnValueOnce('+1234567890')
			.mockReturnValueOnce('order123')
			.mockReturnValueOnce(99.99)
			.mockReturnValueOnce({ item: [{ productId: 'prod1', productName: 'Test Product', price: 99.99, quantity: 1 }] });

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

		const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.attentivemobile.com/v1/events/purchases',
			headers: {
				'Authorization': 'Bearer test-api-key',
				'Content-Type': 'application/json',
			},
			body: {
				phone: '+1234567890',
				order_id: 'order123',
				revenue: 99.99,
				items: [{ product_id: 'prod1', product_name: 'Test Product', price: 99.99, quantity: 1 }],
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { success: true },
			pairedItem: { item: 0 },
		}]);
	});

	it('should track cart abandonment successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('trackCartAbandonment')
			.mockReturnValueOnce('+1234567890')
			.mockReturnValueOnce('cart123')
			.mockReturnValueOnce('https://example.com/cart')
			.mockReturnValueOnce({ item: [{ productId: 'prod1', productName: 'Test Product', price: 99.99, quantity: 1 }] });

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

		const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.attentivemobile.com/v1/events/cart-abandonment',
			headers: {
				'Authorization': 'Bearer test-api-key',
				'Content-Type': 'application/json',
			},
			body: {
				phone: '+1234567890',
				cart_token: 'cart123',
				cart_url: 'https://example.com/cart',
				items: [{ product_id: 'prod1', product_name: 'Test Product', price: 99.99, quantity: 1 }],
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { success: true },
			pairedItem: { item: 0 },
		}]);
	});

	it('should track product view successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('trackProductView')
			.mockReturnValueOnce('+1234567890')
			.mockReturnValueOnce('prod1')
			.mockReturnValueOnce('https://example.com/product/1')
			.mockReturnValueOnce(99.99);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

		const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.attentivemobile.com/v1/events/product-views',
			headers: {
				'Authorization': 'Bearer test-api-key',
				'Content-Type': 'application/json',
			},
			body: {
				phone: '+1234567890',
				product_id: 'prod1',
				product_url: 'https://example.com/product/1',
				price: 99.99,
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { success: true },
			pairedItem: { item: 0 },
		}]);
	});

	it('should handle API errors', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createEvent')
			.mockReturnValueOnce('+1234567890')
			.mockReturnValueOnce('custom_event')
			.mockReturnValueOnce({})
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeEventOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});

	it('should continue on fail when configured', async () => {
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createEvent')
			.mockReturnValueOnce('+1234567890')
			.mockReturnValueOnce('custom_event')
			.mockReturnValueOnce({})
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 },
		}]);
	});
});

describe('Message Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				api_key: 'test-key',
				baseUrl: 'https://api.attentivemobile.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('sendMessage', () => {
		it('should send message successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendMessage')
				.mockReturnValueOnce('+1234567890')
				.mockReturnValueOnce('Test message')
				.mockReturnValueOnce('');

			const mockResponse = { id: 'msg_123', status: 'sent' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle send message error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendMessage')
				.mockReturnValueOnce('+1234567890')
				.mockReturnValueOnce('Test message')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'API Error' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getMessage', () => {
		it('should get message successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMessage')
				.mockReturnValueOnce('msg_123');

			const mockResponse = { id: 'msg_123', status: 'delivered' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle get message error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMessage')
				.mockReturnValueOnce('msg_123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Message not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Message not found' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('listMessages', () => {
		it('should list messages successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listMessages')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			const mockResponse = { messages: [], total: 0 };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle list messages error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listMessages')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Unauthorized'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Unauthorized' },
				pairedItem: { item: 0 },
			}]);
		});
	});
});

describe('Campaign Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://api.attentivemobile.com/v1' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn() 
			},
		};
	});

	it('should create a campaign successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createCampaign')
			.mockReturnValueOnce('Test Campaign')
			.mockReturnValueOnce('Hello World!')
			.mockReturnValueOnce('segment123')
			.mockReturnValueOnce('2024-01-01T12:00:00Z');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'campaign123',
			name: 'Test Campaign',
			status: 'draft'
		});

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.attentivemobile.com/v1/campaigns',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			body: {
				name: 'Test Campaign',
				message: 'Hello World!',
				segment_id: 'segment123',
				send_at: '2024-01-01T12:00:00Z',
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { id: 'campaign123', name: 'Test Campaign', status: 'draft' },
			pairedItem: { item: 0 }
		}]);
	});

	it('should get a campaign successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getCampaign')
			.mockReturnValueOnce('campaign123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'campaign123',
			name: 'Test Campaign',
			metrics: { sent: 100, delivered: 95 }
		});

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.attentivemobile.com/v1/campaigns/campaign123',
			headers: {
				'Authorization': 'Bearer test-key',
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { id: 'campaign123', name: 'Test Campaign', metrics: { sent: 100, delivered: 95 } },
			pairedItem: { item: 0 }
		}]);
	});

	it('should list campaigns successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('listCampaigns')
			.mockReturnValueOnce(10)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce('sent');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			campaigns: [{ id: 'campaign123', name: 'Test Campaign' }],
			total: 1
		});

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.attentivemobile.com/v1/campaigns',
			headers: {
				'Authorization': 'Bearer test-key',
			},
			qs: {
				limit: 10,
				offset: 0,
				status: 'sent',
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { campaigns: [{ id: 'campaign123', name: 'Test Campaign' }], total: 1 },
			pairedItem: { item: 0 }
		}]);
	});

	it('should update a campaign successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateCampaign')
			.mockReturnValueOnce('campaign123')
			.mockReturnValueOnce('Updated Campaign')
			.mockReturnValueOnce('Updated message')
			.mockReturnValueOnce('2024-02-01T12:00:00Z');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'campaign123',
			name: 'Updated Campaign',
			message: 'Updated message'
		});

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'PUT',
			url: 'https://api.attentivemobile.com/v1/campaigns/campaign123',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			body: {
				name: 'Updated Campaign',
				message: 'Updated message',
				send_at: '2024-02-01T12:00:00Z',
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { id: 'campaign123', name: 'Updated Campaign', message: 'Updated message' },
			pairedItem: { item: 0 }
		}]);
	});

	it('should delete a campaign successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deleteCampaign')
			.mockReturnValueOnce('campaign123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			message: 'Campaign deleted successfully'
		});

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: 'https://api.attentivemobile.com/v1/campaigns/campaign123',
			headers: {
				'Authorization': 'Bearer test-key',
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { success: true, message: 'Campaign deleted successfully' },
			pairedItem: { item: 0 }
		}]);
	});

	it('should handle errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCampaign');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 }
		}]);
	});
});

describe('Segment Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.attentivemobile.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createSegment operation', () => {
		it('should create a segment successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createSegment')
				.mockReturnValueOnce('Test Segment')
				.mockReturnValueOnce('{"age": {"gte": 18}}')
				.mockReturnValueOnce('Test segment description');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'segment123',
				name: 'Test Segment',
				filters: { age: { gte: 18 } },
				description: 'Test segment description',
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.attentivemobile.com/v1/segments',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'Test Segment',
					filters: { age: { gte: 18 } },
					description: 'Test segment description',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: {
					id: 'segment123',
					name: 'Test Segment',
					filters: { age: { gte: 18 } },
					description: 'Test segment description',
				},
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle create segment error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createSegment')
				.mockReturnValueOnce('Test Segment')
				.mockReturnValueOnce('{"age": {"gte": 18}}')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'API Error' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getSegment operation', () => {
		it('should get a segment successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getSegment')
				.mockReturnValueOnce('segment123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'segment123',
				name: 'Test Segment',
				subscriber_count: 1500,
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.attentivemobile.com/v1/segments/segment123',
				headers: {
					'Authorization': 'Bearer test-api-key',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: {
					id: 'segment123',
					name: 'Test Segment',
					subscriber_count: 1500,
				},
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('listSegments operation', () => {
		it('should list segments successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listSegments')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				segments: [
					{ id: 'segment1', name: 'Segment 1' },
					{ id: 'segment2', name: 'Segment 2' },
				],
				total: 2,
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.attentivemobile.com/v1/segments',
				headers: {
					'Authorization': 'Bearer test-api-key',
				},
				qs: {
					limit: 10,
					offset: 0,
				},
				json: true,
			});
		});
	});

	describe('updateSegment operation', () => {
		it('should update a segment successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateSegment')
				.mockReturnValueOnce('segment123')
				.mockReturnValueOnce('Updated Segment')
				.mockReturnValueOnce('{"age": {"gte": 21}}');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'segment123',
				name: 'Updated Segment',
				filters: { age: { gte: 21 } },
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://api.attentivemobile.com/v1/segments/segment123',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'Updated Segment',
					filters: { age: { gte: 21 } },
				},
				json: true,
			});
		});
	});

	describe('deleteSegment operation', () => {
		it('should delete a segment successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteSegment')
				.mockReturnValueOnce('segment123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				success: true,
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.attentivemobile.com/v1/segments/segment123',
				headers: {
					'Authorization': 'Bearer test-api-key',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: { success: true },
				pairedItem: { item: 0 },
			}]);
		});
	});
});

describe('Webhook Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.attentivemobile.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  test('should create webhook successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createWebhook')
      .mockReturnValueOnce('https://example.com/webhook')
      .mockReturnValueOnce(['sms.sent', 'sms.delivered'])
      .mockReturnValueOnce('secret123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'webhook123',
      url: 'https://example.com/webhook',
      events: ['sms.sent', 'sms.delivered']
    });

    const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('webhook123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.attentivemobile.com/v1/webhooks',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
      body: {
        url: 'https://example.com/webhook',
        events: ['sms.sent', 'sms.delivered'],
        secret: 'secret123'
      },
    });
  });

  test('should get webhook successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getWebhook')
      .mockReturnValueOnce('webhook123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'webhook123',
      url: 'https://example.com/webhook',
      events: ['sms.sent']
    });

    const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('webhook123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.attentivemobile.com/v1/webhooks/webhook123',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
  });

  test('should list webhooks successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listWebhooks')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(0);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      webhooks: [
        { id: 'webhook1', url: 'https://example.com/webhook1' },
        { id: 'webhook2', url: 'https://example.com/webhook2' }
      ],
      total: 2
    });

    const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.webhooks).toHaveLength(2);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.attentivemobile.com/v1/webhooks',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      qs: {
        limit: 10,
        offset: 0,
      },
      json: true,
    });
  });

  test('should update webhook successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateWebhook')
      .mockReturnValueOnce('webhook123')
      .mockReturnValueOnce('https://updated.com/webhook')
      .mockReturnValueOnce(['sms.delivered'])
      .mockReturnValueOnce('newsecret');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'webhook123',
      url: 'https://updated.com/webhook',
      events: ['sms.delivered']
    });

    const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.url).toBe('https://updated.com/webhook');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.attentivemobile.com/v1/webhooks/webhook123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
      body: {
        url: 'https://updated.com/webhook',
        events: ['sms.delivered'],
        secret: 'newsecret'
      },
    });
  });

  test('should delete webhook successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteWebhook')
      .mockReturnValueOnce('webhook123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

    const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.attentivemobile.com/v1/webhooks/webhook123',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createWebhook');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  test('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createWebhook');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(
      executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});
});
