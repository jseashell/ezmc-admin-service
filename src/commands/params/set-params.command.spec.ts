import { ParamsKey } from './params.enum';
import { parse } from './set-params.command';

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
    const output = parse(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.ADMINS, ParameterValue: mockOptions.admins }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.ADMINS]: mockOptions.admins });
    expect(log).not.toHaveBeenCalled();
  });

  it('should discard admins when there is a space in the delimiter', () => {
    const mockOptions = { admins: 'johndoe1, jane_doe' };
    const output = parse(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({ '-a, --admins': 'invalid name format for one or more admins' });
  });

  it('should discard admins when there is a space in one name', () => {
    const mockOptions = { admins: 'john doe1,jane_doe' };
    const output = parse(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({ '-a, --admins': 'invalid name format for one or more admins' });
  });

  it('should discard admins when there is a symbol other than underscore in one name', () => {
    const mockOptions = { admins: 'john-doe1,jane_doe' };
    const output = parse(mockOptions);
    expect(output).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith('discarded invalid parameters');
    expect(logTable).toHaveBeenCalledWith({ '-a, --admins': 'invalid name format for one or more admins' });
  });

  it('should accept valid difficulty', () => {
    const mockOptions = { difficulty: 'peaceful' };
    const output = parse(mockOptions);
    expect(output).toStrictEqual([{ ParameterKey: ParamsKey.DIFFICULTY, ParameterValue: mockOptions.difficulty }]);
    expect(logTable).toHaveBeenCalledWith({ [ParamsKey.DIFFICULTY]: mockOptions.difficulty });
    expect(log).not.toHaveBeenCalled();
  });
});
