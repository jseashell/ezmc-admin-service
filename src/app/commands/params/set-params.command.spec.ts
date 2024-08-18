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
    expect(output).toStrictEqual({
      params: [{ ParameterKey: ParamsKey.ADMINS, ParameterValue: mockOptions.admins }],
      discard: [],
    });
  });

  it('should discard admins when there is a space in the delimiter', () => {
    const mockOptions = { admins: 'johndoe1, jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.ADMINS] });
  });

  it('should discard admins when there is a space in one name', () => {
    const mockOptions = { admins: 'john doe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.ADMINS] });
  });

  it('should discard admins when there is a symbol other than underscore in one name', () => {
    const mockOptions = { admins: 'john-doe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.ADMINS] });
  });

  it('should accept valid difficulty', () => {
    const mockOptions = { difficulty: 'peaceful' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({
      params: [{ ParameterKey: ParamsKey.DIFFICULTY, ParameterValue: mockOptions.difficulty }],
      discard: [],
    });
  });

  it('should discard invalid difficulty', () => {
    const mockOptions = { difficulty: 'foo' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.DIFFICULTY] });
  });

  it('should accept valid gamemode', () => {
    const mockOptions = { gamemode: 'creative' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({
      params: [{ ParameterKey: ParamsKey.GAMEMODE, ParameterValue: mockOptions.gamemode }],
      discard: [],
    });
  });

  it('should discard invalid gamemode', () => {
    const mockOptions = { gamemode: 'foo' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.GAMEMODE] });
  });

  it('should accept valid mem', () => {
    const mockOptions = { mem: '4G' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({
      params: [{ ParameterKey: ParamsKey.MEMORY, ParameterValue: mockOptions.mem }],
      discard: [],
    });
  });

  it('should discard invalid mem', () => {
    const mockOptions = { mem: 'foo' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.MEMORY] });
  });

  it('should accept valid playermax', () => {
    const mockOptions = { playermax: '20' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({
      params: [{ ParameterKey: ParamsKey.PLAYERS_MAX, ParameterValue: mockOptions.playermax }],
      discard: [],
    });
  });

  it('should discard invalid playermax', () => {
    const mockOptions = { playermax: 'foo' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.PLAYERS_MAX] });
  });

  it('should accept valid state', () => {
    const mockOptions = { state: 'stopped' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({
      params: [{ ParameterKey: ParamsKey.SERVER_STATE, ParameterValue: mockOptions.state }],
      discard: [],
    });
  });

  it('should discard invalid state', () => {
    const mockOptions = { state: 'foo' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.SERVER_STATE] });
  });

  it('should accept valid viewdist', () => {
    const mockOptions = { viewdist: '10' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({
      params: [{ ParameterKey: ParamsKey.VIEW_DIST, ParameterValue: mockOptions.viewdist }],
      discard: [],
    });
  });

  it('should discard viewdist less than 1', () => {
    const mockOptions = { viewdist: '0' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.VIEW_DIST] });
  });

  it('should discard viewdist greater than 20', () => {
    const mockOptions = { viewdist: 21 };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.VIEW_DIST] });
  });

  it('should accept valid whitelist', () => {
    const mockOptions = { whitelist: 'johndoe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({
      params: [{ ParameterKey: ParamsKey.WHITELIST, ParameterValue: mockOptions.whitelist }],
      discard: [],
    });
  });

  it('should discard whitelist when there is a space in the delimiter', () => {
    const mockOptions = { whitelist: 'johndoe1, jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.WHITELIST] });
  });

  it('should discard whitelist when there is a space in one name', () => {
    const mockOptions = { whitelist: 'john doe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.WHITELIST] });
  });

  it('should discard whitelist when there is a symbol other than underscore in one name', () => {
    const mockOptions = { whitelist: 'john-doe1,jane_doe' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({ params: [], discard: [ParamsKey.WHITELIST] });
  });

  it('should accept a valid timezone', () => {
    const mockOptions = { timezone: 'America/New York' };
    const output = convertTo(mockOptions);
    expect(output).toStrictEqual({
      params: [{ ParameterKey: ParamsKey.TIMEZONE, ParameterValue: mockOptions.timezone }],
      discard: [],
    });
  });
});
