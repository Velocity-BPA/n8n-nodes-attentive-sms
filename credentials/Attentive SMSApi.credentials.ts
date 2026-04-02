import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AttentiveSmsApi implements ICredentialType {
	name = 'attentiveSmsApi';
	displayName = 'Attentive SMS API';
	documentationUrl = 'https://docs.attentivemobile.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Attentive SMS API key',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.attentivemobile.com/v1',
			description: 'Base URL for the Attentive SMS API',
		},
	];
}