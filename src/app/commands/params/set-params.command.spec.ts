import { ParamsKey } from './params.enum';
import { convertTo } from './set-params.command';

describe('setParams', () => {
  let log: jest.Mock;
  let logTable: jest.Mock;

  beforeEach(() => {
    log = jest.fn();
    console.log = log;

    logTable = jest.fn();
    console.table = logTable;
  });

  it('should accept valid admins', () => {
    const mockOptions = { admins: 'johndoe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.ADMINS, ParameterValue: mockOptions.admins }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.ADMINS]: mockOptions.admins });
    expect(log).not.toHaveBeenCalled();
  });

  it('should discard admins when there is a space in the delimiter', () => {
    const mockOptions = { admins: 'johndoe1, jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({ '-a, --admins': 'invalid name format for one or more admins' });
  });

  it('should discard admins when there is a space in one name', () => {
    const mockOptions = { admins: 'john doe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({ '-a, --admins': 'invalid name format for one or more admins' });
  });

  it('should discard admins when there is a symbol other than underscore in one name', () => {
    const mockOptions = { admins: 'john-doe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({ '-a, --admins': 'invalid name format for one or more admins' });
  });

  it('should accept valid difficulty', () => {
    const mockOptions = { difficulty: 'peaceful' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.DIFFICULTY, ParameterValue: mockOptions.difficulty }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.DIFFICULTY]: mockOptions.difficulty });
    expect(log).not.toHaveBeenCalled();
  });

  it('should discard invalid difficulty', () => {
    const mockOptions = { difficulty: 'foo' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({ '-d, --difficulty': 'valid values are [peaceful|easy|normal|hard]' });
  });

  it('should accept valid gamemode', () => {
    const mockOptions = { gamemode: 'creative' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.GAMEMODE, ParameterValue: mockOptions.gamemode }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.GAMEMODE]: mockOptions.gamemode });
    expect(log).not.toHaveBeenCalled();
  });

  it('should discard invalid gamemode', () => {
    const mockOptions = { gamemode: 'foo' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({
      '-g, --gamemode': 'valid values are [creative|survival|adventure|spectator]',
    });
  });

  it('should accept valid mem', () => {
    const mockOptions = { mem: '4G' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.MEMORY, ParameterValue: mockOptions.mem }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.MEMORY]: mockOptions.mem });
    expect(log).not.toHaveBeenCalled();
  });

  it('should discard invalid mem', () => {
    const mockOptions = { mem: 'foo' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({
      '-m, --mem': 'valid values are [1G|2G|4G|8G|16G]',
    });
  });

  it('should accept valid playermax', () => {
    const mockOptions = { playermax: '20' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.PLAYERS_MAX, ParameterValue: mockOptions.playermax }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.PLAYERS_MAX]: mockOptions.playermax });
    expect(log).not.toHaveBeenCalled();
  });

  it('should discard invalid playermax', () => {
    const mockOptions = { playermax: 'foo' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({
      '-p, --playermax': 'must be 1 - 100',
    });
  });

  it('should accept valid state', () => {
    const mockOptions = { state: 'stopped' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.SERVER_STATE, ParameterValue: mockOptions.state }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.SERVER_STATE]: mockOptions.state });
    expect(log).not.toHaveBeenCalled();
  });

  it('should discard invalid state', () => {
    const mockOptions = { state: 'foo' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({
      '-s, --state': 'valid values are [running|stopped]',
    });
  });

  it('should accept valid viewdist', () => {
    const mockOptions = { viewdist: '10' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.VIEW_DIST, ParameterValue: mockOptions.viewdist }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.VIEW_DIST]: mockOptions.viewdist });
    expect(log).not.toHaveBeenCalled();
  });

  it('should discard viewdist less than 1', () => {
    const mockOptions = { viewdist: '0' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({
      '-v, --viewdist': 'must be 1 - 20',
    });
  });

  it('should discard viewdist greater than 20', () => {
    const mockOptions = { viewdist: 21 };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({
      '-v, --viewdist': 'must be 1 - 20',
    });
  });

  it('should accept valid whitelist', () => {
    const mockOptions = { whitelist: 'johndoe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.WHITELIST, ParameterValue: mockOptions.whitelist }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.WHITELIST]: mockOptions.whitelist });
    expect(log).not.toHaveBeenCalled();
  });

  it('should discard whitelist when there is a space in the delimiter', () => {
    const mockOptions = { whitelist: 'johndoe1, jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({
      '-w, --whitelist': 'invalid name format for one or more whitelisted players',
    });
  });

  it('should discard whitelist when there is a space in one name', () => {
    const mockOptions = { whitelist: 'john doe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({
      '-w, --whitelist': 'invalid name format for one or more whitelisted players',
    });
  });

  it('should discard whitelist when there is a symbol other than underscore in one name', () => {
    const mockOptions = { whitelist: 'john-doe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({
      '-w, --whitelist': 'invalid name format for one or more whitelisted players',
    });
  });

  it('should accept a valid timezone', () => {
    const mockOptions = { timezone: 'America/New York' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.TIMEZONE, ParameterValue: mockOptions.timezone }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.TIMEZONE]: mockOptions.timezone });
    expect(log).not.toHaveBeenCalled();
  });
});
