import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { mockClient } from 'aws-sdk-client-mock';
import fs from 'fs';
import { CacheFactory } from './cache.factory';

describe('CacheFactory', () => {
  it('should be a singleton', async () => {
    const a = await CacheFactory.getInstance();
    const b = await CacheFactory.getInstance();
    expect(a == b).toBe(true);
  });

  it('should default region to us-east-1', async () => {
    const cache = await CacheFactory.getInstance();
    expect(cache.aws.region).toBe('us-east-1');
  });

  it('should read region from the default aws profile', async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('[default]\nregion=us-east-2');
    const cache = await CacheFactory.getInstance();
    expect(cache.aws.region).toBe('us-east-2');
  });

  it('should fetch aws account id with sts', async () => {
    const stsMock = mockClient(STSClient);
    stsMock.on(GetCallerIdentityCommand).resolves({
      Account: '123-456',
    });

    const cache = await CacheFactory.getInstance();
    expect(cache.aws.accountId).toBe('123-456');
  });
});
