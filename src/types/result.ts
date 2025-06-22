export class Result<T> {
  private constructor(
    private readonly _success: boolean,
    private readonly _data: T | null,
    private readonly _error?: string
  ) {}

  public isSuccess(): boolean {
    return this._success;
  }

  public get data(): T {
    if (this.error) throw new Error("Cannot access data of a failed result");

    return this._data!;
  }

  public get error(): string {
    return this._error ?? "";
  }

  public static Success<T>(data: T): Result<T> {
    return new Result<T>(true, data);
  }

  public static Failure<T>(error: string): Result<T> {
    return new Result<T>(false, null, error);
  }
}
