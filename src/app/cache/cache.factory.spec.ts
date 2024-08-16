import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { mockClient } from 'aws-sdk-client-mock';
import fs from 'fs';
import { CacheFactory } from './cache.factory';

describe('CacheFactory', () => {
  it('should be a singleton', () => {
    const a = CacheFactory.getInstance();
    const b = CacheFactory.getInstance();
    expect(a == b).toBe(true);
  });

  it('should read region from the default aws profile', async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[default]\nregion=us-east-2');
    const cache = CacheFactory.getInstance();
    await cache.init();
    expect(cache.aws.region).toBe('us-east-2');
  });

  it('should set region to us-east-1 when a default profile is not present', async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('no default profile');
    const cache = CacheFactory.getInstance();
    await cache.init();
    expect(cache.aws.region).toBe('us-east-1');
  });

  it('should fetch aws account id', async () => {
    const stsMock = mockClient(STSClient);
    stsMock.on(GetCallerIdentityCommand).resolves({
      Account: '123-456',
    });

    const cache = CacheFactory.getInstance();
    await cache.init();
    expect(cache.aws.accountId).toBe('123-456');
  });

  it('should fail to fetch aws account id and log an error', async () => {
    const consoleErr = jest.fn();
    console.error = consoleErr;

    const stsMock = mockClient(STSClient);
    stsMock.on(GetCallerIdentityCommand).rejects(new Error('foo'));

    try {
      const cache = CacheFactory.getInstance();
      await cache.init();
    } catch (err) {
      expect(consoleErr).toHaveBeenCalledWith('error fetching aws account id');
      expect(consoleErr).toHaveBeenCalledWith(err.message);
    }
  });
});
