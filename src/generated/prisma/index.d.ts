
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Despesas
 * 
 */
export type Despesas = $Result.DefaultSelection<Prisma.$DespesasPayload>
/**
 * Model Despesas_recorrentes
 * 
 */
export type Despesas_recorrentes = $Result.DefaultSelection<Prisma.$Despesas_recorrentesPayload>
/**
 * Model Users
 * 
 */
export type Users = $Result.DefaultSelection<Prisma.$UsersPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Despesas_recorrentes_Tipo_recorrencia: {
  semanal: 'semanal',
  mensal: 'mensal',
  anual: 'anual'
};

export type Despesas_recorrentes_Tipo_recorrencia = (typeof Despesas_recorrentes_Tipo_recorrencia)[keyof typeof Despesas_recorrentes_Tipo_recorrencia]

}

export type Despesas_recorrentes_Tipo_recorrencia = $Enums.Despesas_recorrentes_Tipo_recorrencia

export const Despesas_recorrentes_Tipo_recorrencia: typeof $Enums.Despesas_recorrentes_Tipo_recorrencia

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Despesas
 * const despesas = await prisma.despesas.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Despesas
   * const despesas = await prisma.despesas.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.despesas`: Exposes CRUD operations for the **Despesas** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Despesas
    * const despesas = await prisma.despesas.findMany()
    * ```
    */
  get despesas(): Prisma.DespesasDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.despesas_recorrentes`: Exposes CRUD operations for the **Despesas_recorrentes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Despesas_recorrentes
    * const despesas_recorrentes = await prisma.despesas_recorrentes.findMany()
    * ```
    */
  get despesas_recorrentes(): Prisma.Despesas_recorrentesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **Users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.UsersDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.10.1
   * Query Engine version: 9b628578b3b7cae625e8c927178f15a170e74a9c
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Despesas: 'Despesas',
    Despesas_recorrentes: 'Despesas_recorrentes',
    Users: 'Users'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "despesas" | "despesas_recorrentes" | "users"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Despesas: {
        payload: Prisma.$DespesasPayload<ExtArgs>
        fields: Prisma.DespesasFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DespesasFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DespesasPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DespesasFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DespesasPayload>
          }
          findFirst: {
            args: Prisma.DespesasFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DespesasPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DespesasFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DespesasPayload>
          }
          findMany: {
            args: Prisma.DespesasFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DespesasPayload>[]
          }
          create: {
            args: Prisma.DespesasCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DespesasPayload>
          }
          createMany: {
            args: Prisma.DespesasCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DespesasDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DespesasPayload>
          }
          update: {
            args: Prisma.DespesasUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DespesasPayload>
          }
          deleteMany: {
            args: Prisma.DespesasDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DespesasUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DespesasUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DespesasPayload>
          }
          aggregate: {
            args: Prisma.DespesasAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDespesas>
          }
          groupBy: {
            args: Prisma.DespesasGroupByArgs<ExtArgs>
            result: $Utils.Optional<DespesasGroupByOutputType>[]
          }
          count: {
            args: Prisma.DespesasCountArgs<ExtArgs>
            result: $Utils.Optional<DespesasCountAggregateOutputType> | number
          }
        }
      }
      Despesas_recorrentes: {
        payload: Prisma.$Despesas_recorrentesPayload<ExtArgs>
        fields: Prisma.Despesas_recorrentesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.Despesas_recorrentesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Despesas_recorrentesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.Despesas_recorrentesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Despesas_recorrentesPayload>
          }
          findFirst: {
            args: Prisma.Despesas_recorrentesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Despesas_recorrentesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.Despesas_recorrentesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Despesas_recorrentesPayload>
          }
          findMany: {
            args: Prisma.Despesas_recorrentesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Despesas_recorrentesPayload>[]
          }
          create: {
            args: Prisma.Despesas_recorrentesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Despesas_recorrentesPayload>
          }
          createMany: {
            args: Prisma.Despesas_recorrentesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.Despesas_recorrentesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Despesas_recorrentesPayload>
          }
          update: {
            args: Prisma.Despesas_recorrentesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Despesas_recorrentesPayload>
          }
          deleteMany: {
            args: Prisma.Despesas_recorrentesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.Despesas_recorrentesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.Despesas_recorrentesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Despesas_recorrentesPayload>
          }
          aggregate: {
            args: Prisma.Despesas_recorrentesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDespesas_recorrentes>
          }
          groupBy: {
            args: Prisma.Despesas_recorrentesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Despesas_recorrentesGroupByOutputType>[]
          }
          count: {
            args: Prisma.Despesas_recorrentesCountArgs<ExtArgs>
            result: $Utils.Optional<Despesas_recorrentesCountAggregateOutputType> | number
          }
        }
      }
      Users: {
        payload: Prisma.$UsersPayload<ExtArgs>
        fields: Prisma.UsersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          findFirst: {
            args: Prisma.UsersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          findMany: {
            args: Prisma.UsersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          create: {
            args: Prisma.UsersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          createMany: {
            args: Prisma.UsersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UsersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          update: {
            args: Prisma.UsersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          deleteMany: {
            args: Prisma.UsersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UsersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.UsersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    despesas?: DespesasOmit
    despesas_recorrentes?: Despesas_recorrentesOmit
    users?: UsersOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    Despesas: number
    Despesas_recorrentes: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Despesas?: boolean | UsersCountOutputTypeCountDespesasArgs
    Despesas_recorrentes?: boolean | UsersCountOutputTypeCountDespesas_recorrentesArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountDespesasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DespesasWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountDespesas_recorrentesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Despesas_recorrentesWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Despesas
   */

  export type AggregateDespesas = {
    _count: DespesasCountAggregateOutputType | null
    _avg: DespesasAvgAggregateOutputType | null
    _sum: DespesasSumAggregateOutputType | null
    _min: DespesasMinAggregateOutputType | null
    _max: DespesasMaxAggregateOutputType | null
  }

  export type DespesasAvgAggregateOutputType = {
    idDesp: number | null
    Valor_Total: number | null
    Numero_parcelas: number | null
    Parcela_atual: number | null
    Valor_parcelas: number | null
    Usu_rios_idUsu: number | null
  }

  export type DespesasSumAggregateOutputType = {
    idDesp: number | null
    Valor_Total: number | null
    Numero_parcelas: number | null
    Parcela_atual: number | null
    Valor_parcelas: number | null
    Usu_rios_idUsu: number | null
  }

  export type DespesasMinAggregateOutputType = {
    idDesp: number | null
    Nome: string | null
    Valor_Total: number | null
    Forma_pagamento: string | null
    Data_pagamento: Date | null
    Numero_parcelas: number | null
    Parcela_atual: number | null
    Valor_parcelas: number | null
    Usu_rios_idUsu: number | null
  }

  export type DespesasMaxAggregateOutputType = {
    idDesp: number | null
    Nome: string | null
    Valor_Total: number | null
    Forma_pagamento: string | null
    Data_pagamento: Date | null
    Numero_parcelas: number | null
    Parcela_atual: number | null
    Valor_parcelas: number | null
    Usu_rios_idUsu: number | null
  }

  export type DespesasCountAggregateOutputType = {
    idDesp: number
    Nome: number
    Valor_Total: number
    Forma_pagamento: number
    Data_pagamento: number
    Numero_parcelas: number
    Parcela_atual: number
    Valor_parcelas: number
    Usu_rios_idUsu: number
    _all: number
  }


  export type DespesasAvgAggregateInputType = {
    idDesp?: true
    Valor_Total?: true
    Numero_parcelas?: true
    Parcela_atual?: true
    Valor_parcelas?: true
    Usu_rios_idUsu?: true
  }

  export type DespesasSumAggregateInputType = {
    idDesp?: true
    Valor_Total?: true
    Numero_parcelas?: true
    Parcela_atual?: true
    Valor_parcelas?: true
    Usu_rios_idUsu?: true
  }

  export type DespesasMinAggregateInputType = {
    idDesp?: true
    Nome?: true
    Valor_Total?: true
    Forma_pagamento?: true
    Data_pagamento?: true
    Numero_parcelas?: true
    Parcela_atual?: true
    Valor_parcelas?: true
    Usu_rios_idUsu?: true
  }

  export type DespesasMaxAggregateInputType = {
    idDesp?: true
    Nome?: true
    Valor_Total?: true
    Forma_pagamento?: true
    Data_pagamento?: true
    Numero_parcelas?: true
    Parcela_atual?: true
    Valor_parcelas?: true
    Usu_rios_idUsu?: true
  }

  export type DespesasCountAggregateInputType = {
    idDesp?: true
    Nome?: true
    Valor_Total?: true
    Forma_pagamento?: true
    Data_pagamento?: true
    Numero_parcelas?: true
    Parcela_atual?: true
    Valor_parcelas?: true
    Usu_rios_idUsu?: true
    _all?: true
  }

  export type DespesasAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Despesas to aggregate.
     */
    where?: DespesasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Despesas to fetch.
     */
    orderBy?: DespesasOrderByWithRelationInput | DespesasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DespesasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Despesas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Despesas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Despesas
    **/
    _count?: true | DespesasCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DespesasAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DespesasSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DespesasMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DespesasMaxAggregateInputType
  }

  export type GetDespesasAggregateType<T extends DespesasAggregateArgs> = {
        [P in keyof T & keyof AggregateDespesas]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDespesas[P]>
      : GetScalarType<T[P], AggregateDespesas[P]>
  }




  export type DespesasGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DespesasWhereInput
    orderBy?: DespesasOrderByWithAggregationInput | DespesasOrderByWithAggregationInput[]
    by: DespesasScalarFieldEnum[] | DespesasScalarFieldEnum
    having?: DespesasScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DespesasCountAggregateInputType | true
    _avg?: DespesasAvgAggregateInputType
    _sum?: DespesasSumAggregateInputType
    _min?: DespesasMinAggregateInputType
    _max?: DespesasMaxAggregateInputType
  }

  export type DespesasGroupByOutputType = {
    idDesp: number
    Nome: string
    Valor_Total: number
    Forma_pagamento: string
    Data_pagamento: Date
    Numero_parcelas: number | null
    Parcela_atual: number | null
    Valor_parcelas: number | null
    Usu_rios_idUsu: number
    _count: DespesasCountAggregateOutputType | null
    _avg: DespesasAvgAggregateOutputType | null
    _sum: DespesasSumAggregateOutputType | null
    _min: DespesasMinAggregateOutputType | null
    _max: DespesasMaxAggregateOutputType | null
  }

  type GetDespesasGroupByPayload<T extends DespesasGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DespesasGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DespesasGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DespesasGroupByOutputType[P]>
            : GetScalarType<T[P], DespesasGroupByOutputType[P]>
        }
      >
    >


  export type DespesasSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idDesp?: boolean
    Nome?: boolean
    Valor_Total?: boolean
    Forma_pagamento?: boolean
    Data_pagamento?: boolean
    Numero_parcelas?: boolean
    Parcela_atual?: boolean
    Valor_parcelas?: boolean
    Usu_rios_idUsu?: boolean
    Usu_rios?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["despesas"]>



  export type DespesasSelectScalar = {
    idDesp?: boolean
    Nome?: boolean
    Valor_Total?: boolean
    Forma_pagamento?: boolean
    Data_pagamento?: boolean
    Numero_parcelas?: boolean
    Parcela_atual?: boolean
    Valor_parcelas?: boolean
    Usu_rios_idUsu?: boolean
  }

  export type DespesasOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idDesp" | "Nome" | "Valor_Total" | "Forma_pagamento" | "Data_pagamento" | "Numero_parcelas" | "Parcela_atual" | "Valor_parcelas" | "Usu_rios_idUsu", ExtArgs["result"]["despesas"]>
  export type DespesasInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Usu_rios?: boolean | UsersDefaultArgs<ExtArgs>
  }

  export type $DespesasPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Despesas"
    objects: {
      Usu_rios: Prisma.$UsersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      idDesp: number
      Nome: string
      Valor_Total: number
      Forma_pagamento: string
      Data_pagamento: Date
      Numero_parcelas: number | null
      Parcela_atual: number | null
      Valor_parcelas: number | null
      Usu_rios_idUsu: number
    }, ExtArgs["result"]["despesas"]>
    composites: {}
  }

  type DespesasGetPayload<S extends boolean | null | undefined | DespesasDefaultArgs> = $Result.GetResult<Prisma.$DespesasPayload, S>

  type DespesasCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DespesasFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DespesasCountAggregateInputType | true
    }

  export interface DespesasDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Despesas'], meta: { name: 'Despesas' } }
    /**
     * Find zero or one Despesas that matches the filter.
     * @param {DespesasFindUniqueArgs} args - Arguments to find a Despesas
     * @example
     * // Get one Despesas
     * const despesas = await prisma.despesas.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DespesasFindUniqueArgs>(args: SelectSubset<T, DespesasFindUniqueArgs<ExtArgs>>): Prisma__DespesasClient<$Result.GetResult<Prisma.$DespesasPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Despesas that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DespesasFindUniqueOrThrowArgs} args - Arguments to find a Despesas
     * @example
     * // Get one Despesas
     * const despesas = await prisma.despesas.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DespesasFindUniqueOrThrowArgs>(args: SelectSubset<T, DespesasFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DespesasClient<$Result.GetResult<Prisma.$DespesasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Despesas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DespesasFindFirstArgs} args - Arguments to find a Despesas
     * @example
     * // Get one Despesas
     * const despesas = await prisma.despesas.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DespesasFindFirstArgs>(args?: SelectSubset<T, DespesasFindFirstArgs<ExtArgs>>): Prisma__DespesasClient<$Result.GetResult<Prisma.$DespesasPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Despesas that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DespesasFindFirstOrThrowArgs} args - Arguments to find a Despesas
     * @example
     * // Get one Despesas
     * const despesas = await prisma.despesas.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DespesasFindFirstOrThrowArgs>(args?: SelectSubset<T, DespesasFindFirstOrThrowArgs<ExtArgs>>): Prisma__DespesasClient<$Result.GetResult<Prisma.$DespesasPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Despesas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DespesasFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Despesas
     * const despesas = await prisma.despesas.findMany()
     * 
     * // Get first 10 Despesas
     * const despesas = await prisma.despesas.findMany({ take: 10 })
     * 
     * // Only select the `idDesp`
     * const despesasWithIdDespOnly = await prisma.despesas.findMany({ select: { idDesp: true } })
     * 
     */
    findMany<T extends DespesasFindManyArgs>(args?: SelectSubset<T, DespesasFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DespesasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Despesas.
     * @param {DespesasCreateArgs} args - Arguments to create a Despesas.
     * @example
     * // Create one Despesas
     * const Despesas = await prisma.despesas.create({
     *   data: {
     *     // ... data to create a Despesas
     *   }
     * })
     * 
     */
    create<T extends DespesasCreateArgs>(args: SelectSubset<T, DespesasCreateArgs<ExtArgs>>): Prisma__DespesasClient<$Result.GetResult<Prisma.$DespesasPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Despesas.
     * @param {DespesasCreateManyArgs} args - Arguments to create many Despesas.
     * @example
     * // Create many Despesas
     * const despesas = await prisma.despesas.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DespesasCreateManyArgs>(args?: SelectSubset<T, DespesasCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Despesas.
     * @param {DespesasDeleteArgs} args - Arguments to delete one Despesas.
     * @example
     * // Delete one Despesas
     * const Despesas = await prisma.despesas.delete({
     *   where: {
     *     // ... filter to delete one Despesas
     *   }
     * })
     * 
     */
    delete<T extends DespesasDeleteArgs>(args: SelectSubset<T, DespesasDeleteArgs<ExtArgs>>): Prisma__DespesasClient<$Result.GetResult<Prisma.$DespesasPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Despesas.
     * @param {DespesasUpdateArgs} args - Arguments to update one Despesas.
     * @example
     * // Update one Despesas
     * const despesas = await prisma.despesas.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DespesasUpdateArgs>(args: SelectSubset<T, DespesasUpdateArgs<ExtArgs>>): Prisma__DespesasClient<$Result.GetResult<Prisma.$DespesasPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Despesas.
     * @param {DespesasDeleteManyArgs} args - Arguments to filter Despesas to delete.
     * @example
     * // Delete a few Despesas
     * const { count } = await prisma.despesas.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DespesasDeleteManyArgs>(args?: SelectSubset<T, DespesasDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Despesas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DespesasUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Despesas
     * const despesas = await prisma.despesas.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DespesasUpdateManyArgs>(args: SelectSubset<T, DespesasUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Despesas.
     * @param {DespesasUpsertArgs} args - Arguments to update or create a Despesas.
     * @example
     * // Update or create a Despesas
     * const despesas = await prisma.despesas.upsert({
     *   create: {
     *     // ... data to create a Despesas
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Despesas we want to update
     *   }
     * })
     */
    upsert<T extends DespesasUpsertArgs>(args: SelectSubset<T, DespesasUpsertArgs<ExtArgs>>): Prisma__DespesasClient<$Result.GetResult<Prisma.$DespesasPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Despesas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DespesasCountArgs} args - Arguments to filter Despesas to count.
     * @example
     * // Count the number of Despesas
     * const count = await prisma.despesas.count({
     *   where: {
     *     // ... the filter for the Despesas we want to count
     *   }
     * })
    **/
    count<T extends DespesasCountArgs>(
      args?: Subset<T, DespesasCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DespesasCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Despesas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DespesasAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DespesasAggregateArgs>(args: Subset<T, DespesasAggregateArgs>): Prisma.PrismaPromise<GetDespesasAggregateType<T>>

    /**
     * Group by Despesas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DespesasGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DespesasGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DespesasGroupByArgs['orderBy'] }
        : { orderBy?: DespesasGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DespesasGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDespesasGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Despesas model
   */
  readonly fields: DespesasFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Despesas.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DespesasClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Usu_rios<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Despesas model
   */
  interface DespesasFieldRefs {
    readonly idDesp: FieldRef<"Despesas", 'Int'>
    readonly Nome: FieldRef<"Despesas", 'String'>
    readonly Valor_Total: FieldRef<"Despesas", 'Float'>
    readonly Forma_pagamento: FieldRef<"Despesas", 'String'>
    readonly Data_pagamento: FieldRef<"Despesas", 'DateTime'>
    readonly Numero_parcelas: FieldRef<"Despesas", 'Int'>
    readonly Parcela_atual: FieldRef<"Despesas", 'Int'>
    readonly Valor_parcelas: FieldRef<"Despesas", 'Float'>
    readonly Usu_rios_idUsu: FieldRef<"Despesas", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Despesas findUnique
   */
  export type DespesasFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
    /**
     * Filter, which Despesas to fetch.
     */
    where: DespesasWhereUniqueInput
  }

  /**
   * Despesas findUniqueOrThrow
   */
  export type DespesasFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
    /**
     * Filter, which Despesas to fetch.
     */
    where: DespesasWhereUniqueInput
  }

  /**
   * Despesas findFirst
   */
  export type DespesasFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
    /**
     * Filter, which Despesas to fetch.
     */
    where?: DespesasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Despesas to fetch.
     */
    orderBy?: DespesasOrderByWithRelationInput | DespesasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Despesas.
     */
    cursor?: DespesasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Despesas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Despesas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Despesas.
     */
    distinct?: DespesasScalarFieldEnum | DespesasScalarFieldEnum[]
  }

  /**
   * Despesas findFirstOrThrow
   */
  export type DespesasFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
    /**
     * Filter, which Despesas to fetch.
     */
    where?: DespesasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Despesas to fetch.
     */
    orderBy?: DespesasOrderByWithRelationInput | DespesasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Despesas.
     */
    cursor?: DespesasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Despesas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Despesas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Despesas.
     */
    distinct?: DespesasScalarFieldEnum | DespesasScalarFieldEnum[]
  }

  /**
   * Despesas findMany
   */
  export type DespesasFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
    /**
     * Filter, which Despesas to fetch.
     */
    where?: DespesasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Despesas to fetch.
     */
    orderBy?: DespesasOrderByWithRelationInput | DespesasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Despesas.
     */
    cursor?: DespesasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Despesas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Despesas.
     */
    skip?: number
    distinct?: DespesasScalarFieldEnum | DespesasScalarFieldEnum[]
  }

  /**
   * Despesas create
   */
  export type DespesasCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
    /**
     * The data needed to create a Despesas.
     */
    data: XOR<DespesasCreateInput, DespesasUncheckedCreateInput>
  }

  /**
   * Despesas createMany
   */
  export type DespesasCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Despesas.
     */
    data: DespesasCreateManyInput | DespesasCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Despesas update
   */
  export type DespesasUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
    /**
     * The data needed to update a Despesas.
     */
    data: XOR<DespesasUpdateInput, DespesasUncheckedUpdateInput>
    /**
     * Choose, which Despesas to update.
     */
    where: DespesasWhereUniqueInput
  }

  /**
   * Despesas updateMany
   */
  export type DespesasUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Despesas.
     */
    data: XOR<DespesasUpdateManyMutationInput, DespesasUncheckedUpdateManyInput>
    /**
     * Filter which Despesas to update
     */
    where?: DespesasWhereInput
    /**
     * Limit how many Despesas to update.
     */
    limit?: number
  }

  /**
   * Despesas upsert
   */
  export type DespesasUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
    /**
     * The filter to search for the Despesas to update in case it exists.
     */
    where: DespesasWhereUniqueInput
    /**
     * In case the Despesas found by the `where` argument doesn't exist, create a new Despesas with this data.
     */
    create: XOR<DespesasCreateInput, DespesasUncheckedCreateInput>
    /**
     * In case the Despesas was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DespesasUpdateInput, DespesasUncheckedUpdateInput>
  }

  /**
   * Despesas delete
   */
  export type DespesasDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
    /**
     * Filter which Despesas to delete.
     */
    where: DespesasWhereUniqueInput
  }

  /**
   * Despesas deleteMany
   */
  export type DespesasDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Despesas to delete
     */
    where?: DespesasWhereInput
    /**
     * Limit how many Despesas to delete.
     */
    limit?: number
  }

  /**
   * Despesas without action
   */
  export type DespesasDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
  }


  /**
   * Model Despesas_recorrentes
   */

  export type AggregateDespesas_recorrentes = {
    _count: Despesas_recorrentesCountAggregateOutputType | null
    _avg: Despesas_recorrentesAvgAggregateOutputType | null
    _sum: Despesas_recorrentesSumAggregateOutputType | null
    _min: Despesas_recorrentesMinAggregateOutputType | null
    _max: Despesas_recorrentesMaxAggregateOutputType | null
  }

  export type Despesas_recorrentesAvgAggregateOutputType = {
    idDesp: number | null
    Valor: number | null
    Usu_rios_idUsu: number | null
  }

  export type Despesas_recorrentesSumAggregateOutputType = {
    idDesp: number | null
    Valor: number | null
    Usu_rios_idUsu: number | null
  }

  export type Despesas_recorrentesMinAggregateOutputType = {
    idDesp: number | null
    Nome: string | null
    Valor: number | null
    Tipo_recorrencia: $Enums.Despesas_recorrentes_Tipo_recorrencia | null
    Data_pagamento: Date | null
    Usu_rios_idUsu: number | null
  }

  export type Despesas_recorrentesMaxAggregateOutputType = {
    idDesp: number | null
    Nome: string | null
    Valor: number | null
    Tipo_recorrencia: $Enums.Despesas_recorrentes_Tipo_recorrencia | null
    Data_pagamento: Date | null
    Usu_rios_idUsu: number | null
  }

  export type Despesas_recorrentesCountAggregateOutputType = {
    idDesp: number
    Nome: number
    Valor: number
    Tipo_recorrencia: number
    Data_pagamento: number
    Usu_rios_idUsu: number
    _all: number
  }


  export type Despesas_recorrentesAvgAggregateInputType = {
    idDesp?: true
    Valor?: true
    Usu_rios_idUsu?: true
  }

  export type Despesas_recorrentesSumAggregateInputType = {
    idDesp?: true
    Valor?: true
    Usu_rios_idUsu?: true
  }

  export type Despesas_recorrentesMinAggregateInputType = {
    idDesp?: true
    Nome?: true
    Valor?: true
    Tipo_recorrencia?: true
    Data_pagamento?: true
    Usu_rios_idUsu?: true
  }

  export type Despesas_recorrentesMaxAggregateInputType = {
    idDesp?: true
    Nome?: true
    Valor?: true
    Tipo_recorrencia?: true
    Data_pagamento?: true
    Usu_rios_idUsu?: true
  }

  export type Despesas_recorrentesCountAggregateInputType = {
    idDesp?: true
    Nome?: true
    Valor?: true
    Tipo_recorrencia?: true
    Data_pagamento?: true
    Usu_rios_idUsu?: true
    _all?: true
  }

  export type Despesas_recorrentesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Despesas_recorrentes to aggregate.
     */
    where?: Despesas_recorrentesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Despesas_recorrentes to fetch.
     */
    orderBy?: Despesas_recorrentesOrderByWithRelationInput | Despesas_recorrentesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: Despesas_recorrentesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Despesas_recorrentes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Despesas_recorrentes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Despesas_recorrentes
    **/
    _count?: true | Despesas_recorrentesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Despesas_recorrentesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Despesas_recorrentesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Despesas_recorrentesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Despesas_recorrentesMaxAggregateInputType
  }

  export type GetDespesas_recorrentesAggregateType<T extends Despesas_recorrentesAggregateArgs> = {
        [P in keyof T & keyof AggregateDespesas_recorrentes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDespesas_recorrentes[P]>
      : GetScalarType<T[P], AggregateDespesas_recorrentes[P]>
  }




  export type Despesas_recorrentesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Despesas_recorrentesWhereInput
    orderBy?: Despesas_recorrentesOrderByWithAggregationInput | Despesas_recorrentesOrderByWithAggregationInput[]
    by: Despesas_recorrentesScalarFieldEnum[] | Despesas_recorrentesScalarFieldEnum
    having?: Despesas_recorrentesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Despesas_recorrentesCountAggregateInputType | true
    _avg?: Despesas_recorrentesAvgAggregateInputType
    _sum?: Despesas_recorrentesSumAggregateInputType
    _min?: Despesas_recorrentesMinAggregateInputType
    _max?: Despesas_recorrentesMaxAggregateInputType
  }

  export type Despesas_recorrentesGroupByOutputType = {
    idDesp: number
    Nome: string
    Valor: number
    Tipo_recorrencia: $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento: Date
    Usu_rios_idUsu: number
    _count: Despesas_recorrentesCountAggregateOutputType | null
    _avg: Despesas_recorrentesAvgAggregateOutputType | null
    _sum: Despesas_recorrentesSumAggregateOutputType | null
    _min: Despesas_recorrentesMinAggregateOutputType | null
    _max: Despesas_recorrentesMaxAggregateOutputType | null
  }

  type GetDespesas_recorrentesGroupByPayload<T extends Despesas_recorrentesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Despesas_recorrentesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Despesas_recorrentesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Despesas_recorrentesGroupByOutputType[P]>
            : GetScalarType<T[P], Despesas_recorrentesGroupByOutputType[P]>
        }
      >
    >


  export type Despesas_recorrentesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idDesp?: boolean
    Nome?: boolean
    Valor?: boolean
    Tipo_recorrencia?: boolean
    Data_pagamento?: boolean
    Usu_rios_idUsu?: boolean
    Usu_rios?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["despesas_recorrentes"]>



  export type Despesas_recorrentesSelectScalar = {
    idDesp?: boolean
    Nome?: boolean
    Valor?: boolean
    Tipo_recorrencia?: boolean
    Data_pagamento?: boolean
    Usu_rios_idUsu?: boolean
  }

  export type Despesas_recorrentesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idDesp" | "Nome" | "Valor" | "Tipo_recorrencia" | "Data_pagamento" | "Usu_rios_idUsu", ExtArgs["result"]["despesas_recorrentes"]>
  export type Despesas_recorrentesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Usu_rios?: boolean | UsersDefaultArgs<ExtArgs>
  }

  export type $Despesas_recorrentesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Despesas_recorrentes"
    objects: {
      Usu_rios: Prisma.$UsersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      idDesp: number
      Nome: string
      Valor: number
      Tipo_recorrencia: $Enums.Despesas_recorrentes_Tipo_recorrencia
      Data_pagamento: Date
      Usu_rios_idUsu: number
    }, ExtArgs["result"]["despesas_recorrentes"]>
    composites: {}
  }

  type Despesas_recorrentesGetPayload<S extends boolean | null | undefined | Despesas_recorrentesDefaultArgs> = $Result.GetResult<Prisma.$Despesas_recorrentesPayload, S>

  type Despesas_recorrentesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<Despesas_recorrentesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Despesas_recorrentesCountAggregateInputType | true
    }

  export interface Despesas_recorrentesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Despesas_recorrentes'], meta: { name: 'Despesas_recorrentes' } }
    /**
     * Find zero or one Despesas_recorrentes that matches the filter.
     * @param {Despesas_recorrentesFindUniqueArgs} args - Arguments to find a Despesas_recorrentes
     * @example
     * // Get one Despesas_recorrentes
     * const despesas_recorrentes = await prisma.despesas_recorrentes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends Despesas_recorrentesFindUniqueArgs>(args: SelectSubset<T, Despesas_recorrentesFindUniqueArgs<ExtArgs>>): Prisma__Despesas_recorrentesClient<$Result.GetResult<Prisma.$Despesas_recorrentesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Despesas_recorrentes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {Despesas_recorrentesFindUniqueOrThrowArgs} args - Arguments to find a Despesas_recorrentes
     * @example
     * // Get one Despesas_recorrentes
     * const despesas_recorrentes = await prisma.despesas_recorrentes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends Despesas_recorrentesFindUniqueOrThrowArgs>(args: SelectSubset<T, Despesas_recorrentesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__Despesas_recorrentesClient<$Result.GetResult<Prisma.$Despesas_recorrentesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Despesas_recorrentes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Despesas_recorrentesFindFirstArgs} args - Arguments to find a Despesas_recorrentes
     * @example
     * // Get one Despesas_recorrentes
     * const despesas_recorrentes = await prisma.despesas_recorrentes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends Despesas_recorrentesFindFirstArgs>(args?: SelectSubset<T, Despesas_recorrentesFindFirstArgs<ExtArgs>>): Prisma__Despesas_recorrentesClient<$Result.GetResult<Prisma.$Despesas_recorrentesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Despesas_recorrentes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Despesas_recorrentesFindFirstOrThrowArgs} args - Arguments to find a Despesas_recorrentes
     * @example
     * // Get one Despesas_recorrentes
     * const despesas_recorrentes = await prisma.despesas_recorrentes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends Despesas_recorrentesFindFirstOrThrowArgs>(args?: SelectSubset<T, Despesas_recorrentesFindFirstOrThrowArgs<ExtArgs>>): Prisma__Despesas_recorrentesClient<$Result.GetResult<Prisma.$Despesas_recorrentesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Despesas_recorrentes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Despesas_recorrentesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Despesas_recorrentes
     * const despesas_recorrentes = await prisma.despesas_recorrentes.findMany()
     * 
     * // Get first 10 Despesas_recorrentes
     * const despesas_recorrentes = await prisma.despesas_recorrentes.findMany({ take: 10 })
     * 
     * // Only select the `idDesp`
     * const despesas_recorrentesWithIdDespOnly = await prisma.despesas_recorrentes.findMany({ select: { idDesp: true } })
     * 
     */
    findMany<T extends Despesas_recorrentesFindManyArgs>(args?: SelectSubset<T, Despesas_recorrentesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Despesas_recorrentesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Despesas_recorrentes.
     * @param {Despesas_recorrentesCreateArgs} args - Arguments to create a Despesas_recorrentes.
     * @example
     * // Create one Despesas_recorrentes
     * const Despesas_recorrentes = await prisma.despesas_recorrentes.create({
     *   data: {
     *     // ... data to create a Despesas_recorrentes
     *   }
     * })
     * 
     */
    create<T extends Despesas_recorrentesCreateArgs>(args: SelectSubset<T, Despesas_recorrentesCreateArgs<ExtArgs>>): Prisma__Despesas_recorrentesClient<$Result.GetResult<Prisma.$Despesas_recorrentesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Despesas_recorrentes.
     * @param {Despesas_recorrentesCreateManyArgs} args - Arguments to create many Despesas_recorrentes.
     * @example
     * // Create many Despesas_recorrentes
     * const despesas_recorrentes = await prisma.despesas_recorrentes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends Despesas_recorrentesCreateManyArgs>(args?: SelectSubset<T, Despesas_recorrentesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Despesas_recorrentes.
     * @param {Despesas_recorrentesDeleteArgs} args - Arguments to delete one Despesas_recorrentes.
     * @example
     * // Delete one Despesas_recorrentes
     * const Despesas_recorrentes = await prisma.despesas_recorrentes.delete({
     *   where: {
     *     // ... filter to delete one Despesas_recorrentes
     *   }
     * })
     * 
     */
    delete<T extends Despesas_recorrentesDeleteArgs>(args: SelectSubset<T, Despesas_recorrentesDeleteArgs<ExtArgs>>): Prisma__Despesas_recorrentesClient<$Result.GetResult<Prisma.$Despesas_recorrentesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Despesas_recorrentes.
     * @param {Despesas_recorrentesUpdateArgs} args - Arguments to update one Despesas_recorrentes.
     * @example
     * // Update one Despesas_recorrentes
     * const despesas_recorrentes = await prisma.despesas_recorrentes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends Despesas_recorrentesUpdateArgs>(args: SelectSubset<T, Despesas_recorrentesUpdateArgs<ExtArgs>>): Prisma__Despesas_recorrentesClient<$Result.GetResult<Prisma.$Despesas_recorrentesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Despesas_recorrentes.
     * @param {Despesas_recorrentesDeleteManyArgs} args - Arguments to filter Despesas_recorrentes to delete.
     * @example
     * // Delete a few Despesas_recorrentes
     * const { count } = await prisma.despesas_recorrentes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends Despesas_recorrentesDeleteManyArgs>(args?: SelectSubset<T, Despesas_recorrentesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Despesas_recorrentes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Despesas_recorrentesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Despesas_recorrentes
     * const despesas_recorrentes = await prisma.despesas_recorrentes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends Despesas_recorrentesUpdateManyArgs>(args: SelectSubset<T, Despesas_recorrentesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Despesas_recorrentes.
     * @param {Despesas_recorrentesUpsertArgs} args - Arguments to update or create a Despesas_recorrentes.
     * @example
     * // Update or create a Despesas_recorrentes
     * const despesas_recorrentes = await prisma.despesas_recorrentes.upsert({
     *   create: {
     *     // ... data to create a Despesas_recorrentes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Despesas_recorrentes we want to update
     *   }
     * })
     */
    upsert<T extends Despesas_recorrentesUpsertArgs>(args: SelectSubset<T, Despesas_recorrentesUpsertArgs<ExtArgs>>): Prisma__Despesas_recorrentesClient<$Result.GetResult<Prisma.$Despesas_recorrentesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Despesas_recorrentes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Despesas_recorrentesCountArgs} args - Arguments to filter Despesas_recorrentes to count.
     * @example
     * // Count the number of Despesas_recorrentes
     * const count = await prisma.despesas_recorrentes.count({
     *   where: {
     *     // ... the filter for the Despesas_recorrentes we want to count
     *   }
     * })
    **/
    count<T extends Despesas_recorrentesCountArgs>(
      args?: Subset<T, Despesas_recorrentesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Despesas_recorrentesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Despesas_recorrentes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Despesas_recorrentesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Despesas_recorrentesAggregateArgs>(args: Subset<T, Despesas_recorrentesAggregateArgs>): Prisma.PrismaPromise<GetDespesas_recorrentesAggregateType<T>>

    /**
     * Group by Despesas_recorrentes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Despesas_recorrentesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends Despesas_recorrentesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Despesas_recorrentesGroupByArgs['orderBy'] }
        : { orderBy?: Despesas_recorrentesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, Despesas_recorrentesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDespesas_recorrentesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Despesas_recorrentes model
   */
  readonly fields: Despesas_recorrentesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Despesas_recorrentes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__Despesas_recorrentesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Usu_rios<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Despesas_recorrentes model
   */
  interface Despesas_recorrentesFieldRefs {
    readonly idDesp: FieldRef<"Despesas_recorrentes", 'Int'>
    readonly Nome: FieldRef<"Despesas_recorrentes", 'String'>
    readonly Valor: FieldRef<"Despesas_recorrentes", 'Float'>
    readonly Tipo_recorrencia: FieldRef<"Despesas_recorrentes", 'Despesas_recorrentes_Tipo_recorrencia'>
    readonly Data_pagamento: FieldRef<"Despesas_recorrentes", 'DateTime'>
    readonly Usu_rios_idUsu: FieldRef<"Despesas_recorrentes", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Despesas_recorrentes findUnique
   */
  export type Despesas_recorrentesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
    /**
     * Filter, which Despesas_recorrentes to fetch.
     */
    where: Despesas_recorrentesWhereUniqueInput
  }

  /**
   * Despesas_recorrentes findUniqueOrThrow
   */
  export type Despesas_recorrentesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
    /**
     * Filter, which Despesas_recorrentes to fetch.
     */
    where: Despesas_recorrentesWhereUniqueInput
  }

  /**
   * Despesas_recorrentes findFirst
   */
  export type Despesas_recorrentesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
    /**
     * Filter, which Despesas_recorrentes to fetch.
     */
    where?: Despesas_recorrentesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Despesas_recorrentes to fetch.
     */
    orderBy?: Despesas_recorrentesOrderByWithRelationInput | Despesas_recorrentesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Despesas_recorrentes.
     */
    cursor?: Despesas_recorrentesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Despesas_recorrentes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Despesas_recorrentes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Despesas_recorrentes.
     */
    distinct?: Despesas_recorrentesScalarFieldEnum | Despesas_recorrentesScalarFieldEnum[]
  }

  /**
   * Despesas_recorrentes findFirstOrThrow
   */
  export type Despesas_recorrentesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
    /**
     * Filter, which Despesas_recorrentes to fetch.
     */
    where?: Despesas_recorrentesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Despesas_recorrentes to fetch.
     */
    orderBy?: Despesas_recorrentesOrderByWithRelationInput | Despesas_recorrentesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Despesas_recorrentes.
     */
    cursor?: Despesas_recorrentesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Despesas_recorrentes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Despesas_recorrentes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Despesas_recorrentes.
     */
    distinct?: Despesas_recorrentesScalarFieldEnum | Despesas_recorrentesScalarFieldEnum[]
  }

  /**
   * Despesas_recorrentes findMany
   */
  export type Despesas_recorrentesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
    /**
     * Filter, which Despesas_recorrentes to fetch.
     */
    where?: Despesas_recorrentesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Despesas_recorrentes to fetch.
     */
    orderBy?: Despesas_recorrentesOrderByWithRelationInput | Despesas_recorrentesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Despesas_recorrentes.
     */
    cursor?: Despesas_recorrentesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Despesas_recorrentes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Despesas_recorrentes.
     */
    skip?: number
    distinct?: Despesas_recorrentesScalarFieldEnum | Despesas_recorrentesScalarFieldEnum[]
  }

  /**
   * Despesas_recorrentes create
   */
  export type Despesas_recorrentesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
    /**
     * The data needed to create a Despesas_recorrentes.
     */
    data: XOR<Despesas_recorrentesCreateInput, Despesas_recorrentesUncheckedCreateInput>
  }

  /**
   * Despesas_recorrentes createMany
   */
  export type Despesas_recorrentesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Despesas_recorrentes.
     */
    data: Despesas_recorrentesCreateManyInput | Despesas_recorrentesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Despesas_recorrentes update
   */
  export type Despesas_recorrentesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
    /**
     * The data needed to update a Despesas_recorrentes.
     */
    data: XOR<Despesas_recorrentesUpdateInput, Despesas_recorrentesUncheckedUpdateInput>
    /**
     * Choose, which Despesas_recorrentes to update.
     */
    where: Despesas_recorrentesWhereUniqueInput
  }

  /**
   * Despesas_recorrentes updateMany
   */
  export type Despesas_recorrentesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Despesas_recorrentes.
     */
    data: XOR<Despesas_recorrentesUpdateManyMutationInput, Despesas_recorrentesUncheckedUpdateManyInput>
    /**
     * Filter which Despesas_recorrentes to update
     */
    where?: Despesas_recorrentesWhereInput
    /**
     * Limit how many Despesas_recorrentes to update.
     */
    limit?: number
  }

  /**
   * Despesas_recorrentes upsert
   */
  export type Despesas_recorrentesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
    /**
     * The filter to search for the Despesas_recorrentes to update in case it exists.
     */
    where: Despesas_recorrentesWhereUniqueInput
    /**
     * In case the Despesas_recorrentes found by the `where` argument doesn't exist, create a new Despesas_recorrentes with this data.
     */
    create: XOR<Despesas_recorrentesCreateInput, Despesas_recorrentesUncheckedCreateInput>
    /**
     * In case the Despesas_recorrentes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<Despesas_recorrentesUpdateInput, Despesas_recorrentesUncheckedUpdateInput>
  }

  /**
   * Despesas_recorrentes delete
   */
  export type Despesas_recorrentesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
    /**
     * Filter which Despesas_recorrentes to delete.
     */
    where: Despesas_recorrentesWhereUniqueInput
  }

  /**
   * Despesas_recorrentes deleteMany
   */
  export type Despesas_recorrentesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Despesas_recorrentes to delete
     */
    where?: Despesas_recorrentesWhereInput
    /**
     * Limit how many Despesas_recorrentes to delete.
     */
    limit?: number
  }

  /**
   * Despesas_recorrentes without action
   */
  export type Despesas_recorrentesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
  }


  /**
   * Model Users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    idUsu: number | null
  }

  export type UsersSumAggregateOutputType = {
    idUsu: number | null
  }

  export type UsersMinAggregateOutputType = {
    idUsu: number | null
    Nome: string | null
    Email: string | null
    Senha: string | null
    Avatar: string | null
  }

  export type UsersMaxAggregateOutputType = {
    idUsu: number | null
    Nome: string | null
    Email: string | null
    Senha: string | null
    Avatar: string | null
  }

  export type UsersCountAggregateOutputType = {
    idUsu: number
    Nome: number
    Email: number
    Senha: number
    Avatar: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    idUsu?: true
  }

  export type UsersSumAggregateInputType = {
    idUsu?: true
  }

  export type UsersMinAggregateInputType = {
    idUsu?: true
    Nome?: true
    Email?: true
    Senha?: true
    Avatar?: true
  }

  export type UsersMaxAggregateInputType = {
    idUsu?: true
    Nome?: true
    Email?: true
    Senha?: true
    Avatar?: true
  }

  export type UsersCountAggregateInputType = {
    idUsu?: true
    Nome?: true
    Email?: true
    Senha?: true
    Avatar?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to aggregate.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type UsersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsersWhereInput
    orderBy?: UsersOrderByWithAggregationInput | UsersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: UsersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    idUsu: number
    Nome: string
    Email: string
    Senha: string
    Avatar: string | null
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends UsersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type UsersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idUsu?: boolean
    Nome?: boolean
    Email?: boolean
    Senha?: boolean
    Avatar?: boolean
    Despesas?: boolean | Users$DespesasArgs<ExtArgs>
    Despesas_recorrentes?: boolean | Users$Despesas_recorrentesArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>



  export type UsersSelectScalar = {
    idUsu?: boolean
    Nome?: boolean
    Email?: boolean
    Senha?: boolean
    Avatar?: boolean
  }

  export type UsersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idUsu" | "Nome" | "Email" | "Senha" | "Avatar", ExtArgs["result"]["users"]>
  export type UsersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Despesas?: boolean | Users$DespesasArgs<ExtArgs>
    Despesas_recorrentes?: boolean | Users$Despesas_recorrentesArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UsersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Users"
    objects: {
      Despesas: Prisma.$DespesasPayload<ExtArgs>[]
      Despesas_recorrentes: Prisma.$Despesas_recorrentesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idUsu: number
      Nome: string
      Email: string
      Senha: string
      Avatar: string | null
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type UsersGetPayload<S extends boolean | null | undefined | UsersDefaultArgs> = $Result.GetResult<Prisma.$UsersPayload, S>

  type UsersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface UsersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Users'], meta: { name: 'Users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {UsersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsersFindUniqueArgs>(args: SelectSubset<T, UsersFindUniqueArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsersFindUniqueOrThrowArgs>(args: SelectSubset<T, UsersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsersFindFirstArgs>(args?: SelectSubset<T, UsersFindFirstArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsersFindFirstOrThrowArgs>(args?: SelectSubset<T, UsersFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `idUsu`
     * const usersWithIdUsuOnly = await prisma.users.findMany({ select: { idUsu: true } })
     * 
     */
    findMany<T extends UsersFindManyArgs>(args?: SelectSubset<T, UsersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {UsersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends UsersCreateArgs>(args: SelectSubset<T, UsersCreateArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UsersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsersCreateManyArgs>(args?: SelectSubset<T, UsersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Users.
     * @param {UsersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends UsersDeleteArgs>(args: SelectSubset<T, UsersDeleteArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {UsersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsersUpdateArgs>(args: SelectSubset<T, UsersUpdateArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UsersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsersDeleteManyArgs>(args?: SelectSubset<T, UsersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsersUpdateManyArgs>(args: SelectSubset<T, UsersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Users.
     * @param {UsersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends UsersUpsertArgs>(args: SelectSubset<T, UsersUpsertArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UsersCountArgs>(
      args?: Subset<T, UsersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersGroupByArgs['orderBy'] }
        : { orderBy?: UsersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Users model
   */
  readonly fields: UsersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Despesas<T extends Users$DespesasArgs<ExtArgs> = {}>(args?: Subset<T, Users$DespesasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DespesasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Despesas_recorrentes<T extends Users$Despesas_recorrentesArgs<ExtArgs> = {}>(args?: Subset<T, Users$Despesas_recorrentesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Despesas_recorrentesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Users model
   */
  interface UsersFieldRefs {
    readonly idUsu: FieldRef<"Users", 'Int'>
    readonly Nome: FieldRef<"Users", 'String'>
    readonly Email: FieldRef<"Users", 'String'>
    readonly Senha: FieldRef<"Users", 'String'>
    readonly Avatar: FieldRef<"Users", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Users findUnique
   */
  export type UsersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users findUniqueOrThrow
   */
  export type UsersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users findFirst
   */
  export type UsersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users findFirstOrThrow
   */
  export type UsersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users findMany
   */
  export type UsersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users create
   */
  export type UsersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The data needed to create a Users.
     */
    data: XOR<UsersCreateInput, UsersUncheckedCreateInput>
  }

  /**
   * Users createMany
   */
  export type UsersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UsersCreateManyInput | UsersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Users update
   */
  export type UsersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The data needed to update a Users.
     */
    data: XOR<UsersUpdateInput, UsersUncheckedUpdateInput>
    /**
     * Choose, which Users to update.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users updateMany
   */
  export type UsersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UsersUpdateManyMutationInput, UsersUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * Users upsert
   */
  export type UsersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The filter to search for the Users to update in case it exists.
     */
    where: UsersWhereUniqueInput
    /**
     * In case the Users found by the `where` argument doesn't exist, create a new Users with this data.
     */
    create: XOR<UsersCreateInput, UsersUncheckedCreateInput>
    /**
     * In case the Users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsersUpdateInput, UsersUncheckedUpdateInput>
  }

  /**
   * Users delete
   */
  export type UsersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter which Users to delete.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users deleteMany
   */
  export type UsersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * Users.Despesas
   */
  export type Users$DespesasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas
     */
    select?: DespesasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas
     */
    omit?: DespesasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DespesasInclude<ExtArgs> | null
    where?: DespesasWhereInput
    orderBy?: DespesasOrderByWithRelationInput | DespesasOrderByWithRelationInput[]
    cursor?: DespesasWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DespesasScalarFieldEnum | DespesasScalarFieldEnum[]
  }

  /**
   * Users.Despesas_recorrentes
   */
  export type Users$Despesas_recorrentesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Despesas_recorrentes
     */
    select?: Despesas_recorrentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Despesas_recorrentes
     */
    omit?: Despesas_recorrentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Despesas_recorrentesInclude<ExtArgs> | null
    where?: Despesas_recorrentesWhereInput
    orderBy?: Despesas_recorrentesOrderByWithRelationInput | Despesas_recorrentesOrderByWithRelationInput[]
    cursor?: Despesas_recorrentesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Despesas_recorrentesScalarFieldEnum | Despesas_recorrentesScalarFieldEnum[]
  }

  /**
   * Users without action
   */
  export type UsersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DespesasScalarFieldEnum: {
    idDesp: 'idDesp',
    Nome: 'Nome',
    Valor_Total: 'Valor_Total',
    Forma_pagamento: 'Forma_pagamento',
    Data_pagamento: 'Data_pagamento',
    Numero_parcelas: 'Numero_parcelas',
    Parcela_atual: 'Parcela_atual',
    Valor_parcelas: 'Valor_parcelas',
    Usu_rios_idUsu: 'Usu_rios_idUsu'
  };

  export type DespesasScalarFieldEnum = (typeof DespesasScalarFieldEnum)[keyof typeof DespesasScalarFieldEnum]


  export const Despesas_recorrentesScalarFieldEnum: {
    idDesp: 'idDesp',
    Nome: 'Nome',
    Valor: 'Valor',
    Tipo_recorrencia: 'Tipo_recorrencia',
    Data_pagamento: 'Data_pagamento',
    Usu_rios_idUsu: 'Usu_rios_idUsu'
  };

  export type Despesas_recorrentesScalarFieldEnum = (typeof Despesas_recorrentesScalarFieldEnum)[keyof typeof Despesas_recorrentesScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    idUsu: 'idUsu',
    Nome: 'Nome',
    Email: 'Email',
    Senha: 'Senha',
    Avatar: 'Avatar'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const DespesasOrderByRelevanceFieldEnum: {
    Nome: 'Nome',
    Forma_pagamento: 'Forma_pagamento'
  };

  export type DespesasOrderByRelevanceFieldEnum = (typeof DespesasOrderByRelevanceFieldEnum)[keyof typeof DespesasOrderByRelevanceFieldEnum]


  export const Despesas_recorrentesOrderByRelevanceFieldEnum: {
    Nome: 'Nome'
  };

  export type Despesas_recorrentesOrderByRelevanceFieldEnum = (typeof Despesas_recorrentesOrderByRelevanceFieldEnum)[keyof typeof Despesas_recorrentesOrderByRelevanceFieldEnum]


  export const UsersOrderByRelevanceFieldEnum: {
    Nome: 'Nome',
    Email: 'Email',
    Senha: 'Senha',
    Avatar: 'Avatar'
  };

  export type UsersOrderByRelevanceFieldEnum = (typeof UsersOrderByRelevanceFieldEnum)[keyof typeof UsersOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Despesas_recorrentes_Tipo_recorrencia'
   */
  export type EnumDespesas_recorrentes_Tipo_recorrenciaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Despesas_recorrentes_Tipo_recorrencia'>
    
  /**
   * Deep Input Types
   */


  export type DespesasWhereInput = {
    AND?: DespesasWhereInput | DespesasWhereInput[]
    OR?: DespesasWhereInput[]
    NOT?: DespesasWhereInput | DespesasWhereInput[]
    idDesp?: IntFilter<"Despesas"> | number
    Nome?: StringFilter<"Despesas"> | string
    Valor_Total?: FloatFilter<"Despesas"> | number
    Forma_pagamento?: StringFilter<"Despesas"> | string
    Data_pagamento?: DateTimeFilter<"Despesas"> | Date | string
    Numero_parcelas?: IntNullableFilter<"Despesas"> | number | null
    Parcela_atual?: IntNullableFilter<"Despesas"> | number | null
    Valor_parcelas?: FloatNullableFilter<"Despesas"> | number | null
    Usu_rios_idUsu?: IntFilter<"Despesas"> | number
    Usu_rios?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }

  export type DespesasOrderByWithRelationInput = {
    idDesp?: SortOrder
    Nome?: SortOrder
    Valor_Total?: SortOrder
    Forma_pagamento?: SortOrder
    Data_pagamento?: SortOrder
    Numero_parcelas?: SortOrderInput | SortOrder
    Parcela_atual?: SortOrderInput | SortOrder
    Valor_parcelas?: SortOrderInput | SortOrder
    Usu_rios_idUsu?: SortOrder
    Usu_rios?: UsersOrderByWithRelationInput
    _relevance?: DespesasOrderByRelevanceInput
  }

  export type DespesasWhereUniqueInput = Prisma.AtLeast<{
    Valor_Total?: number
    idDesp_Usu_rios_idUsu?: DespesasIdDespUsu_rios_idUsuCompoundUniqueInput
    AND?: DespesasWhereInput | DespesasWhereInput[]
    OR?: DespesasWhereInput[]
    NOT?: DespesasWhereInput | DespesasWhereInput[]
    idDesp?: IntFilter<"Despesas"> | number
    Nome?: StringFilter<"Despesas"> | string
    Forma_pagamento?: StringFilter<"Despesas"> | string
    Data_pagamento?: DateTimeFilter<"Despesas"> | Date | string
    Numero_parcelas?: IntNullableFilter<"Despesas"> | number | null
    Parcela_atual?: IntNullableFilter<"Despesas"> | number | null
    Valor_parcelas?: FloatNullableFilter<"Despesas"> | number | null
    Usu_rios_idUsu?: IntFilter<"Despesas"> | number
    Usu_rios?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }, "idDesp_Usu_rios_idUsu" | "Valor_Total">

  export type DespesasOrderByWithAggregationInput = {
    idDesp?: SortOrder
    Nome?: SortOrder
    Valor_Total?: SortOrder
    Forma_pagamento?: SortOrder
    Data_pagamento?: SortOrder
    Numero_parcelas?: SortOrderInput | SortOrder
    Parcela_atual?: SortOrderInput | SortOrder
    Valor_parcelas?: SortOrderInput | SortOrder
    Usu_rios_idUsu?: SortOrder
    _count?: DespesasCountOrderByAggregateInput
    _avg?: DespesasAvgOrderByAggregateInput
    _max?: DespesasMaxOrderByAggregateInput
    _min?: DespesasMinOrderByAggregateInput
    _sum?: DespesasSumOrderByAggregateInput
  }

  export type DespesasScalarWhereWithAggregatesInput = {
    AND?: DespesasScalarWhereWithAggregatesInput | DespesasScalarWhereWithAggregatesInput[]
    OR?: DespesasScalarWhereWithAggregatesInput[]
    NOT?: DespesasScalarWhereWithAggregatesInput | DespesasScalarWhereWithAggregatesInput[]
    idDesp?: IntWithAggregatesFilter<"Despesas"> | number
    Nome?: StringWithAggregatesFilter<"Despesas"> | string
    Valor_Total?: FloatWithAggregatesFilter<"Despesas"> | number
    Forma_pagamento?: StringWithAggregatesFilter<"Despesas"> | string
    Data_pagamento?: DateTimeWithAggregatesFilter<"Despesas"> | Date | string
    Numero_parcelas?: IntNullableWithAggregatesFilter<"Despesas"> | number | null
    Parcela_atual?: IntNullableWithAggregatesFilter<"Despesas"> | number | null
    Valor_parcelas?: FloatNullableWithAggregatesFilter<"Despesas"> | number | null
    Usu_rios_idUsu?: IntWithAggregatesFilter<"Despesas"> | number
  }

  export type Despesas_recorrentesWhereInput = {
    AND?: Despesas_recorrentesWhereInput | Despesas_recorrentesWhereInput[]
    OR?: Despesas_recorrentesWhereInput[]
    NOT?: Despesas_recorrentesWhereInput | Despesas_recorrentesWhereInput[]
    idDesp?: IntFilter<"Despesas_recorrentes"> | number
    Nome?: StringFilter<"Despesas_recorrentes"> | string
    Valor?: FloatFilter<"Despesas_recorrentes"> | number
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaFilter<"Despesas_recorrentes"> | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeFilter<"Despesas_recorrentes"> | Date | string
    Usu_rios_idUsu?: IntFilter<"Despesas_recorrentes"> | number
    Usu_rios?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }

  export type Despesas_recorrentesOrderByWithRelationInput = {
    idDesp?: SortOrder
    Nome?: SortOrder
    Valor?: SortOrder
    Tipo_recorrencia?: SortOrder
    Data_pagamento?: SortOrder
    Usu_rios_idUsu?: SortOrder
    Usu_rios?: UsersOrderByWithRelationInput
    _relevance?: Despesas_recorrentesOrderByRelevanceInput
  }

  export type Despesas_recorrentesWhereUniqueInput = Prisma.AtLeast<{
    Valor?: number
    idDesp_Usu_rios_idUsu?: Despesas_recorrentesIdDespUsu_rios_idUsuCompoundUniqueInput
    AND?: Despesas_recorrentesWhereInput | Despesas_recorrentesWhereInput[]
    OR?: Despesas_recorrentesWhereInput[]
    NOT?: Despesas_recorrentesWhereInput | Despesas_recorrentesWhereInput[]
    idDesp?: IntFilter<"Despesas_recorrentes"> | number
    Nome?: StringFilter<"Despesas_recorrentes"> | string
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaFilter<"Despesas_recorrentes"> | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeFilter<"Despesas_recorrentes"> | Date | string
    Usu_rios_idUsu?: IntFilter<"Despesas_recorrentes"> | number
    Usu_rios?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }, "idDesp_Usu_rios_idUsu" | "Valor">

  export type Despesas_recorrentesOrderByWithAggregationInput = {
    idDesp?: SortOrder
    Nome?: SortOrder
    Valor?: SortOrder
    Tipo_recorrencia?: SortOrder
    Data_pagamento?: SortOrder
    Usu_rios_idUsu?: SortOrder
    _count?: Despesas_recorrentesCountOrderByAggregateInput
    _avg?: Despesas_recorrentesAvgOrderByAggregateInput
    _max?: Despesas_recorrentesMaxOrderByAggregateInput
    _min?: Despesas_recorrentesMinOrderByAggregateInput
    _sum?: Despesas_recorrentesSumOrderByAggregateInput
  }

  export type Despesas_recorrentesScalarWhereWithAggregatesInput = {
    AND?: Despesas_recorrentesScalarWhereWithAggregatesInput | Despesas_recorrentesScalarWhereWithAggregatesInput[]
    OR?: Despesas_recorrentesScalarWhereWithAggregatesInput[]
    NOT?: Despesas_recorrentesScalarWhereWithAggregatesInput | Despesas_recorrentesScalarWhereWithAggregatesInput[]
    idDesp?: IntWithAggregatesFilter<"Despesas_recorrentes"> | number
    Nome?: StringWithAggregatesFilter<"Despesas_recorrentes"> | string
    Valor?: FloatWithAggregatesFilter<"Despesas_recorrentes"> | number
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaWithAggregatesFilter<"Despesas_recorrentes"> | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeWithAggregatesFilter<"Despesas_recorrentes"> | Date | string
    Usu_rios_idUsu?: IntWithAggregatesFilter<"Despesas_recorrentes"> | number
  }

  export type UsersWhereInput = {
    AND?: UsersWhereInput | UsersWhereInput[]
    OR?: UsersWhereInput[]
    NOT?: UsersWhereInput | UsersWhereInput[]
    idUsu?: IntFilter<"Users"> | number
    Nome?: StringFilter<"Users"> | string
    Email?: StringFilter<"Users"> | string
    Senha?: StringFilter<"Users"> | string
    Avatar?: StringNullableFilter<"Users"> | string | null
    Despesas?: DespesasListRelationFilter
    Despesas_recorrentes?: Despesas_recorrentesListRelationFilter
  }

  export type UsersOrderByWithRelationInput = {
    idUsu?: SortOrder
    Nome?: SortOrder
    Email?: SortOrder
    Senha?: SortOrder
    Avatar?: SortOrderInput | SortOrder
    Despesas?: DespesasOrderByRelationAggregateInput
    Despesas_recorrentes?: Despesas_recorrentesOrderByRelationAggregateInput
    _relevance?: UsersOrderByRelevanceInput
  }

  export type UsersWhereUniqueInput = Prisma.AtLeast<{
    idUsu?: number
    Email?: string
    AND?: UsersWhereInput | UsersWhereInput[]
    OR?: UsersWhereInput[]
    NOT?: UsersWhereInput | UsersWhereInput[]
    Nome?: StringFilter<"Users"> | string
    Senha?: StringFilter<"Users"> | string
    Avatar?: StringNullableFilter<"Users"> | string | null
    Despesas?: DespesasListRelationFilter
    Despesas_recorrentes?: Despesas_recorrentesListRelationFilter
  }, "idUsu" | "Email">

  export type UsersOrderByWithAggregationInput = {
    idUsu?: SortOrder
    Nome?: SortOrder
    Email?: SortOrder
    Senha?: SortOrder
    Avatar?: SortOrderInput | SortOrder
    _count?: UsersCountOrderByAggregateInput
    _avg?: UsersAvgOrderByAggregateInput
    _max?: UsersMaxOrderByAggregateInput
    _min?: UsersMinOrderByAggregateInput
    _sum?: UsersSumOrderByAggregateInput
  }

  export type UsersScalarWhereWithAggregatesInput = {
    AND?: UsersScalarWhereWithAggregatesInput | UsersScalarWhereWithAggregatesInput[]
    OR?: UsersScalarWhereWithAggregatesInput[]
    NOT?: UsersScalarWhereWithAggregatesInput | UsersScalarWhereWithAggregatesInput[]
    idUsu?: IntWithAggregatesFilter<"Users"> | number
    Nome?: StringWithAggregatesFilter<"Users"> | string
    Email?: StringWithAggregatesFilter<"Users"> | string
    Senha?: StringWithAggregatesFilter<"Users"> | string
    Avatar?: StringNullableWithAggregatesFilter<"Users"> | string | null
  }

  export type DespesasCreateInput = {
    idDesp?: number
    Nome: string
    Valor_Total: number
    Forma_pagamento: string
    Data_pagamento: Date | string
    Numero_parcelas?: number | null
    Parcela_atual?: number | null
    Valor_parcelas?: number | null
    Usu_rios: UsersCreateNestedOneWithoutDespesasInput
  }

  export type DespesasUncheckedCreateInput = {
    idDesp?: number
    Nome: string
    Valor_Total: number
    Forma_pagamento: string
    Data_pagamento: Date | string
    Numero_parcelas?: number | null
    Parcela_atual?: number | null
    Valor_parcelas?: number | null
    Usu_rios_idUsu: number
  }

  export type DespesasUpdateInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor_Total?: FloatFieldUpdateOperationsInput | number
    Forma_pagamento?: StringFieldUpdateOperationsInput | string
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
    Numero_parcelas?: NullableIntFieldUpdateOperationsInput | number | null
    Parcela_atual?: NullableIntFieldUpdateOperationsInput | number | null
    Valor_parcelas?: NullableFloatFieldUpdateOperationsInput | number | null
    Usu_rios?: UsersUpdateOneRequiredWithoutDespesasNestedInput
  }

  export type DespesasUncheckedUpdateInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor_Total?: FloatFieldUpdateOperationsInput | number
    Forma_pagamento?: StringFieldUpdateOperationsInput | string
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
    Numero_parcelas?: NullableIntFieldUpdateOperationsInput | number | null
    Parcela_atual?: NullableIntFieldUpdateOperationsInput | number | null
    Valor_parcelas?: NullableFloatFieldUpdateOperationsInput | number | null
    Usu_rios_idUsu?: IntFieldUpdateOperationsInput | number
  }

  export type DespesasCreateManyInput = {
    idDesp?: number
    Nome: string
    Valor_Total: number
    Forma_pagamento: string
    Data_pagamento: Date | string
    Numero_parcelas?: number | null
    Parcela_atual?: number | null
    Valor_parcelas?: number | null
    Usu_rios_idUsu: number
  }

  export type DespesasUpdateManyMutationInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor_Total?: FloatFieldUpdateOperationsInput | number
    Forma_pagamento?: StringFieldUpdateOperationsInput | string
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
    Numero_parcelas?: NullableIntFieldUpdateOperationsInput | number | null
    Parcela_atual?: NullableIntFieldUpdateOperationsInput | number | null
    Valor_parcelas?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type DespesasUncheckedUpdateManyInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor_Total?: FloatFieldUpdateOperationsInput | number
    Forma_pagamento?: StringFieldUpdateOperationsInput | string
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
    Numero_parcelas?: NullableIntFieldUpdateOperationsInput | number | null
    Parcela_atual?: NullableIntFieldUpdateOperationsInput | number | null
    Valor_parcelas?: NullableFloatFieldUpdateOperationsInput | number | null
    Usu_rios_idUsu?: IntFieldUpdateOperationsInput | number
  }

  export type Despesas_recorrentesCreateInput = {
    idDesp?: number
    Nome: string
    Valor: number
    Tipo_recorrencia: $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento: Date | string
    Usu_rios: UsersCreateNestedOneWithoutDespesas_recorrentesInput
  }

  export type Despesas_recorrentesUncheckedCreateInput = {
    idDesp?: number
    Nome: string
    Valor: number
    Tipo_recorrencia: $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento: Date | string
    Usu_rios_idUsu: number
  }

  export type Despesas_recorrentesUpdateInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor?: FloatFieldUpdateOperationsInput | number
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaFieldUpdateOperationsInput | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
    Usu_rios?: UsersUpdateOneRequiredWithoutDespesas_recorrentesNestedInput
  }

  export type Despesas_recorrentesUncheckedUpdateInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor?: FloatFieldUpdateOperationsInput | number
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaFieldUpdateOperationsInput | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
    Usu_rios_idUsu?: IntFieldUpdateOperationsInput | number
  }

  export type Despesas_recorrentesCreateManyInput = {
    idDesp?: number
    Nome: string
    Valor: number
    Tipo_recorrencia: $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento: Date | string
    Usu_rios_idUsu: number
  }

  export type Despesas_recorrentesUpdateManyMutationInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor?: FloatFieldUpdateOperationsInput | number
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaFieldUpdateOperationsInput | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Despesas_recorrentesUncheckedUpdateManyInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor?: FloatFieldUpdateOperationsInput | number
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaFieldUpdateOperationsInput | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
    Usu_rios_idUsu?: IntFieldUpdateOperationsInput | number
  }

  export type UsersCreateInput = {
    Nome: string
    Email: string
    Senha: string
    Avatar?: string | null
    Despesas?: DespesasCreateNestedManyWithoutUsu_riosInput
    Despesas_recorrentes?: Despesas_recorrentesCreateNestedManyWithoutUsu_riosInput
  }

  export type UsersUncheckedCreateInput = {
    idUsu?: number
    Nome: string
    Email: string
    Senha: string
    Avatar?: string | null
    Despesas?: DespesasUncheckedCreateNestedManyWithoutUsu_riosInput
    Despesas_recorrentes?: Despesas_recorrentesUncheckedCreateNestedManyWithoutUsu_riosInput
  }

  export type UsersUpdateInput = {
    Nome?: StringFieldUpdateOperationsInput | string
    Email?: StringFieldUpdateOperationsInput | string
    Senha?: StringFieldUpdateOperationsInput | string
    Avatar?: NullableStringFieldUpdateOperationsInput | string | null
    Despesas?: DespesasUpdateManyWithoutUsu_riosNestedInput
    Despesas_recorrentes?: Despesas_recorrentesUpdateManyWithoutUsu_riosNestedInput
  }

  export type UsersUncheckedUpdateInput = {
    idUsu?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Email?: StringFieldUpdateOperationsInput | string
    Senha?: StringFieldUpdateOperationsInput | string
    Avatar?: NullableStringFieldUpdateOperationsInput | string | null
    Despesas?: DespesasUncheckedUpdateManyWithoutUsu_riosNestedInput
    Despesas_recorrentes?: Despesas_recorrentesUncheckedUpdateManyWithoutUsu_riosNestedInput
  }

  export type UsersCreateManyInput = {
    idUsu?: number
    Nome: string
    Email: string
    Senha: string
    Avatar?: string | null
  }

  export type UsersUpdateManyMutationInput = {
    Nome?: StringFieldUpdateOperationsInput | string
    Email?: StringFieldUpdateOperationsInput | string
    Senha?: StringFieldUpdateOperationsInput | string
    Avatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UsersUncheckedUpdateManyInput = {
    idUsu?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Email?: StringFieldUpdateOperationsInput | string
    Senha?: StringFieldUpdateOperationsInput | string
    Avatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type UsersScalarRelationFilter = {
    is?: UsersWhereInput
    isNot?: UsersWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DespesasOrderByRelevanceInput = {
    fields: DespesasOrderByRelevanceFieldEnum | DespesasOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DespesasIdDespUsu_rios_idUsuCompoundUniqueInput = {
    idDesp: number
    Usu_rios_idUsu: number
  }

  export type DespesasCountOrderByAggregateInput = {
    idDesp?: SortOrder
    Nome?: SortOrder
    Valor_Total?: SortOrder
    Forma_pagamento?: SortOrder
    Data_pagamento?: SortOrder
    Numero_parcelas?: SortOrder
    Parcela_atual?: SortOrder
    Valor_parcelas?: SortOrder
    Usu_rios_idUsu?: SortOrder
  }

  export type DespesasAvgOrderByAggregateInput = {
    idDesp?: SortOrder
    Valor_Total?: SortOrder
    Numero_parcelas?: SortOrder
    Parcela_atual?: SortOrder
    Valor_parcelas?: SortOrder
    Usu_rios_idUsu?: SortOrder
  }

  export type DespesasMaxOrderByAggregateInput = {
    idDesp?: SortOrder
    Nome?: SortOrder
    Valor_Total?: SortOrder
    Forma_pagamento?: SortOrder
    Data_pagamento?: SortOrder
    Numero_parcelas?: SortOrder
    Parcela_atual?: SortOrder
    Valor_parcelas?: SortOrder
    Usu_rios_idUsu?: SortOrder
  }

  export type DespesasMinOrderByAggregateInput = {
    idDesp?: SortOrder
    Nome?: SortOrder
    Valor_Total?: SortOrder
    Forma_pagamento?: SortOrder
    Data_pagamento?: SortOrder
    Numero_parcelas?: SortOrder
    Parcela_atual?: SortOrder
    Valor_parcelas?: SortOrder
    Usu_rios_idUsu?: SortOrder
  }

  export type DespesasSumOrderByAggregateInput = {
    idDesp?: SortOrder
    Valor_Total?: SortOrder
    Numero_parcelas?: SortOrder
    Parcela_atual?: SortOrder
    Valor_parcelas?: SortOrder
    Usu_rios_idUsu?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumDespesas_recorrentes_Tipo_recorrenciaFilter<$PrismaModel = never> = {
    equals?: $Enums.Despesas_recorrentes_Tipo_recorrencia | EnumDespesas_recorrentes_Tipo_recorrenciaFieldRefInput<$PrismaModel>
    in?: $Enums.Despesas_recorrentes_Tipo_recorrencia[]
    notIn?: $Enums.Despesas_recorrentes_Tipo_recorrencia[]
    not?: NestedEnumDespesas_recorrentes_Tipo_recorrenciaFilter<$PrismaModel> | $Enums.Despesas_recorrentes_Tipo_recorrencia
  }

  export type Despesas_recorrentesOrderByRelevanceInput = {
    fields: Despesas_recorrentesOrderByRelevanceFieldEnum | Despesas_recorrentesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type Despesas_recorrentesIdDespUsu_rios_idUsuCompoundUniqueInput = {
    idDesp: number
    Usu_rios_idUsu: number
  }

  export type Despesas_recorrentesCountOrderByAggregateInput = {
    idDesp?: SortOrder
    Nome?: SortOrder
    Valor?: SortOrder
    Tipo_recorrencia?: SortOrder
    Data_pagamento?: SortOrder
    Usu_rios_idUsu?: SortOrder
  }

  export type Despesas_recorrentesAvgOrderByAggregateInput = {
    idDesp?: SortOrder
    Valor?: SortOrder
    Usu_rios_idUsu?: SortOrder
  }

  export type Despesas_recorrentesMaxOrderByAggregateInput = {
    idDesp?: SortOrder
    Nome?: SortOrder
    Valor?: SortOrder
    Tipo_recorrencia?: SortOrder
    Data_pagamento?: SortOrder
    Usu_rios_idUsu?: SortOrder
  }

  export type Despesas_recorrentesMinOrderByAggregateInput = {
    idDesp?: SortOrder
    Nome?: SortOrder
    Valor?: SortOrder
    Tipo_recorrencia?: SortOrder
    Data_pagamento?: SortOrder
    Usu_rios_idUsu?: SortOrder
  }

  export type Despesas_recorrentesSumOrderByAggregateInput = {
    idDesp?: SortOrder
    Valor?: SortOrder
    Usu_rios_idUsu?: SortOrder
  }

  export type EnumDespesas_recorrentes_Tipo_recorrenciaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Despesas_recorrentes_Tipo_recorrencia | EnumDespesas_recorrentes_Tipo_recorrenciaFieldRefInput<$PrismaModel>
    in?: $Enums.Despesas_recorrentes_Tipo_recorrencia[]
    notIn?: $Enums.Despesas_recorrentes_Tipo_recorrencia[]
    not?: NestedEnumDespesas_recorrentes_Tipo_recorrenciaWithAggregatesFilter<$PrismaModel> | $Enums.Despesas_recorrentes_Tipo_recorrencia
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDespesas_recorrentes_Tipo_recorrenciaFilter<$PrismaModel>
    _max?: NestedEnumDespesas_recorrentes_Tipo_recorrenciaFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DespesasListRelationFilter = {
    every?: DespesasWhereInput
    some?: DespesasWhereInput
    none?: DespesasWhereInput
  }

  export type Despesas_recorrentesListRelationFilter = {
    every?: Despesas_recorrentesWhereInput
    some?: Despesas_recorrentesWhereInput
    none?: Despesas_recorrentesWhereInput
  }

  export type DespesasOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type Despesas_recorrentesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsersOrderByRelevanceInput = {
    fields: UsersOrderByRelevanceFieldEnum | UsersOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UsersCountOrderByAggregateInput = {
    idUsu?: SortOrder
    Nome?: SortOrder
    Email?: SortOrder
    Senha?: SortOrder
    Avatar?: SortOrder
  }

  export type UsersAvgOrderByAggregateInput = {
    idUsu?: SortOrder
  }

  export type UsersMaxOrderByAggregateInput = {
    idUsu?: SortOrder
    Nome?: SortOrder
    Email?: SortOrder
    Senha?: SortOrder
    Avatar?: SortOrder
  }

  export type UsersMinOrderByAggregateInput = {
    idUsu?: SortOrder
    Nome?: SortOrder
    Email?: SortOrder
    Senha?: SortOrder
    Avatar?: SortOrder
  }

  export type UsersSumOrderByAggregateInput = {
    idUsu?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UsersCreateNestedOneWithoutDespesasInput = {
    create?: XOR<UsersCreateWithoutDespesasInput, UsersUncheckedCreateWithoutDespesasInput>
    connectOrCreate?: UsersCreateOrConnectWithoutDespesasInput
    connect?: UsersWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UsersUpdateOneRequiredWithoutDespesasNestedInput = {
    create?: XOR<UsersCreateWithoutDespesasInput, UsersUncheckedCreateWithoutDespesasInput>
    connectOrCreate?: UsersCreateOrConnectWithoutDespesasInput
    upsert?: UsersUpsertWithoutDespesasInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutDespesasInput, UsersUpdateWithoutDespesasInput>, UsersUncheckedUpdateWithoutDespesasInput>
  }

  export type UsersCreateNestedOneWithoutDespesas_recorrentesInput = {
    create?: XOR<UsersCreateWithoutDespesas_recorrentesInput, UsersUncheckedCreateWithoutDespesas_recorrentesInput>
    connectOrCreate?: UsersCreateOrConnectWithoutDespesas_recorrentesInput
    connect?: UsersWhereUniqueInput
  }

  export type EnumDespesas_recorrentes_Tipo_recorrenciaFieldUpdateOperationsInput = {
    set?: $Enums.Despesas_recorrentes_Tipo_recorrencia
  }

  export type UsersUpdateOneRequiredWithoutDespesas_recorrentesNestedInput = {
    create?: XOR<UsersCreateWithoutDespesas_recorrentesInput, UsersUncheckedCreateWithoutDespesas_recorrentesInput>
    connectOrCreate?: UsersCreateOrConnectWithoutDespesas_recorrentesInput
    upsert?: UsersUpsertWithoutDespesas_recorrentesInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutDespesas_recorrentesInput, UsersUpdateWithoutDespesas_recorrentesInput>, UsersUncheckedUpdateWithoutDespesas_recorrentesInput>
  }

  export type DespesasCreateNestedManyWithoutUsu_riosInput = {
    create?: XOR<DespesasCreateWithoutUsu_riosInput, DespesasUncheckedCreateWithoutUsu_riosInput> | DespesasCreateWithoutUsu_riosInput[] | DespesasUncheckedCreateWithoutUsu_riosInput[]
    connectOrCreate?: DespesasCreateOrConnectWithoutUsu_riosInput | DespesasCreateOrConnectWithoutUsu_riosInput[]
    createMany?: DespesasCreateManyUsu_riosInputEnvelope
    connect?: DespesasWhereUniqueInput | DespesasWhereUniqueInput[]
  }

  export type Despesas_recorrentesCreateNestedManyWithoutUsu_riosInput = {
    create?: XOR<Despesas_recorrentesCreateWithoutUsu_riosInput, Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput> | Despesas_recorrentesCreateWithoutUsu_riosInput[] | Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput[]
    connectOrCreate?: Despesas_recorrentesCreateOrConnectWithoutUsu_riosInput | Despesas_recorrentesCreateOrConnectWithoutUsu_riosInput[]
    createMany?: Despesas_recorrentesCreateManyUsu_riosInputEnvelope
    connect?: Despesas_recorrentesWhereUniqueInput | Despesas_recorrentesWhereUniqueInput[]
  }

  export type DespesasUncheckedCreateNestedManyWithoutUsu_riosInput = {
    create?: XOR<DespesasCreateWithoutUsu_riosInput, DespesasUncheckedCreateWithoutUsu_riosInput> | DespesasCreateWithoutUsu_riosInput[] | DespesasUncheckedCreateWithoutUsu_riosInput[]
    connectOrCreate?: DespesasCreateOrConnectWithoutUsu_riosInput | DespesasCreateOrConnectWithoutUsu_riosInput[]
    createMany?: DespesasCreateManyUsu_riosInputEnvelope
    connect?: DespesasWhereUniqueInput | DespesasWhereUniqueInput[]
  }

  export type Despesas_recorrentesUncheckedCreateNestedManyWithoutUsu_riosInput = {
    create?: XOR<Despesas_recorrentesCreateWithoutUsu_riosInput, Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput> | Despesas_recorrentesCreateWithoutUsu_riosInput[] | Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput[]
    connectOrCreate?: Despesas_recorrentesCreateOrConnectWithoutUsu_riosInput | Despesas_recorrentesCreateOrConnectWithoutUsu_riosInput[]
    createMany?: Despesas_recorrentesCreateManyUsu_riosInputEnvelope
    connect?: Despesas_recorrentesWhereUniqueInput | Despesas_recorrentesWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DespesasUpdateManyWithoutUsu_riosNestedInput = {
    create?: XOR<DespesasCreateWithoutUsu_riosInput, DespesasUncheckedCreateWithoutUsu_riosInput> | DespesasCreateWithoutUsu_riosInput[] | DespesasUncheckedCreateWithoutUsu_riosInput[]
    connectOrCreate?: DespesasCreateOrConnectWithoutUsu_riosInput | DespesasCreateOrConnectWithoutUsu_riosInput[]
    upsert?: DespesasUpsertWithWhereUniqueWithoutUsu_riosInput | DespesasUpsertWithWhereUniqueWithoutUsu_riosInput[]
    createMany?: DespesasCreateManyUsu_riosInputEnvelope
    set?: DespesasWhereUniqueInput | DespesasWhereUniqueInput[]
    disconnect?: DespesasWhereUniqueInput | DespesasWhereUniqueInput[]
    delete?: DespesasWhereUniqueInput | DespesasWhereUniqueInput[]
    connect?: DespesasWhereUniqueInput | DespesasWhereUniqueInput[]
    update?: DespesasUpdateWithWhereUniqueWithoutUsu_riosInput | DespesasUpdateWithWhereUniqueWithoutUsu_riosInput[]
    updateMany?: DespesasUpdateManyWithWhereWithoutUsu_riosInput | DespesasUpdateManyWithWhereWithoutUsu_riosInput[]
    deleteMany?: DespesasScalarWhereInput | DespesasScalarWhereInput[]
  }

  export type Despesas_recorrentesUpdateManyWithoutUsu_riosNestedInput = {
    create?: XOR<Despesas_recorrentesCreateWithoutUsu_riosInput, Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput> | Despesas_recorrentesCreateWithoutUsu_riosInput[] | Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput[]
    connectOrCreate?: Despesas_recorrentesCreateOrConnectWithoutUsu_riosInput | Despesas_recorrentesCreateOrConnectWithoutUsu_riosInput[]
    upsert?: Despesas_recorrentesUpsertWithWhereUniqueWithoutUsu_riosInput | Despesas_recorrentesUpsertWithWhereUniqueWithoutUsu_riosInput[]
    createMany?: Despesas_recorrentesCreateManyUsu_riosInputEnvelope
    set?: Despesas_recorrentesWhereUniqueInput | Despesas_recorrentesWhereUniqueInput[]
    disconnect?: Despesas_recorrentesWhereUniqueInput | Despesas_recorrentesWhereUniqueInput[]
    delete?: Despesas_recorrentesWhereUniqueInput | Despesas_recorrentesWhereUniqueInput[]
    connect?: Despesas_recorrentesWhereUniqueInput | Despesas_recorrentesWhereUniqueInput[]
    update?: Despesas_recorrentesUpdateWithWhereUniqueWithoutUsu_riosInput | Despesas_recorrentesUpdateWithWhereUniqueWithoutUsu_riosInput[]
    updateMany?: Despesas_recorrentesUpdateManyWithWhereWithoutUsu_riosInput | Despesas_recorrentesUpdateManyWithWhereWithoutUsu_riosInput[]
    deleteMany?: Despesas_recorrentesScalarWhereInput | Despesas_recorrentesScalarWhereInput[]
  }

  export type DespesasUncheckedUpdateManyWithoutUsu_riosNestedInput = {
    create?: XOR<DespesasCreateWithoutUsu_riosInput, DespesasUncheckedCreateWithoutUsu_riosInput> | DespesasCreateWithoutUsu_riosInput[] | DespesasUncheckedCreateWithoutUsu_riosInput[]
    connectOrCreate?: DespesasCreateOrConnectWithoutUsu_riosInput | DespesasCreateOrConnectWithoutUsu_riosInput[]
    upsert?: DespesasUpsertWithWhereUniqueWithoutUsu_riosInput | DespesasUpsertWithWhereUniqueWithoutUsu_riosInput[]
    createMany?: DespesasCreateManyUsu_riosInputEnvelope
    set?: DespesasWhereUniqueInput | DespesasWhereUniqueInput[]
    disconnect?: DespesasWhereUniqueInput | DespesasWhereUniqueInput[]
    delete?: DespesasWhereUniqueInput | DespesasWhereUniqueInput[]
    connect?: DespesasWhereUniqueInput | DespesasWhereUniqueInput[]
    update?: DespesasUpdateWithWhereUniqueWithoutUsu_riosInput | DespesasUpdateWithWhereUniqueWithoutUsu_riosInput[]
    updateMany?: DespesasUpdateManyWithWhereWithoutUsu_riosInput | DespesasUpdateManyWithWhereWithoutUsu_riosInput[]
    deleteMany?: DespesasScalarWhereInput | DespesasScalarWhereInput[]
  }

  export type Despesas_recorrentesUncheckedUpdateManyWithoutUsu_riosNestedInput = {
    create?: XOR<Despesas_recorrentesCreateWithoutUsu_riosInput, Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput> | Despesas_recorrentesCreateWithoutUsu_riosInput[] | Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput[]
    connectOrCreate?: Despesas_recorrentesCreateOrConnectWithoutUsu_riosInput | Despesas_recorrentesCreateOrConnectWithoutUsu_riosInput[]
    upsert?: Despesas_recorrentesUpsertWithWhereUniqueWithoutUsu_riosInput | Despesas_recorrentesUpsertWithWhereUniqueWithoutUsu_riosInput[]
    createMany?: Despesas_recorrentesCreateManyUsu_riosInputEnvelope
    set?: Despesas_recorrentesWhereUniqueInput | Despesas_recorrentesWhereUniqueInput[]
    disconnect?: Despesas_recorrentesWhereUniqueInput | Despesas_recorrentesWhereUniqueInput[]
    delete?: Despesas_recorrentesWhereUniqueInput | Despesas_recorrentesWhereUniqueInput[]
    connect?: Despesas_recorrentesWhereUniqueInput | Despesas_recorrentesWhereUniqueInput[]
    update?: Despesas_recorrentesUpdateWithWhereUniqueWithoutUsu_riosInput | Despesas_recorrentesUpdateWithWhereUniqueWithoutUsu_riosInput[]
    updateMany?: Despesas_recorrentesUpdateManyWithWhereWithoutUsu_riosInput | Despesas_recorrentesUpdateManyWithWhereWithoutUsu_riosInput[]
    deleteMany?: Despesas_recorrentesScalarWhereInput | Despesas_recorrentesScalarWhereInput[]
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumDespesas_recorrentes_Tipo_recorrenciaFilter<$PrismaModel = never> = {
    equals?: $Enums.Despesas_recorrentes_Tipo_recorrencia | EnumDespesas_recorrentes_Tipo_recorrenciaFieldRefInput<$PrismaModel>
    in?: $Enums.Despesas_recorrentes_Tipo_recorrencia[]
    notIn?: $Enums.Despesas_recorrentes_Tipo_recorrencia[]
    not?: NestedEnumDespesas_recorrentes_Tipo_recorrenciaFilter<$PrismaModel> | $Enums.Despesas_recorrentes_Tipo_recorrencia
  }

  export type NestedEnumDespesas_recorrentes_Tipo_recorrenciaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Despesas_recorrentes_Tipo_recorrencia | EnumDespesas_recorrentes_Tipo_recorrenciaFieldRefInput<$PrismaModel>
    in?: $Enums.Despesas_recorrentes_Tipo_recorrencia[]
    notIn?: $Enums.Despesas_recorrentes_Tipo_recorrencia[]
    not?: NestedEnumDespesas_recorrentes_Tipo_recorrenciaWithAggregatesFilter<$PrismaModel> | $Enums.Despesas_recorrentes_Tipo_recorrencia
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDespesas_recorrentes_Tipo_recorrenciaFilter<$PrismaModel>
    _max?: NestedEnumDespesas_recorrentes_Tipo_recorrenciaFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UsersCreateWithoutDespesasInput = {
    Nome: string
    Email: string
    Senha: string
    Avatar?: string | null
    Despesas_recorrentes?: Despesas_recorrentesCreateNestedManyWithoutUsu_riosInput
  }

  export type UsersUncheckedCreateWithoutDespesasInput = {
    idUsu?: number
    Nome: string
    Email: string
    Senha: string
    Avatar?: string | null
    Despesas_recorrentes?: Despesas_recorrentesUncheckedCreateNestedManyWithoutUsu_riosInput
  }

  export type UsersCreateOrConnectWithoutDespesasInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutDespesasInput, UsersUncheckedCreateWithoutDespesasInput>
  }

  export type UsersUpsertWithoutDespesasInput = {
    update: XOR<UsersUpdateWithoutDespesasInput, UsersUncheckedUpdateWithoutDespesasInput>
    create: XOR<UsersCreateWithoutDespesasInput, UsersUncheckedCreateWithoutDespesasInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutDespesasInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutDespesasInput, UsersUncheckedUpdateWithoutDespesasInput>
  }

  export type UsersUpdateWithoutDespesasInput = {
    Nome?: StringFieldUpdateOperationsInput | string
    Email?: StringFieldUpdateOperationsInput | string
    Senha?: StringFieldUpdateOperationsInput | string
    Avatar?: NullableStringFieldUpdateOperationsInput | string | null
    Despesas_recorrentes?: Despesas_recorrentesUpdateManyWithoutUsu_riosNestedInput
  }

  export type UsersUncheckedUpdateWithoutDespesasInput = {
    idUsu?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Email?: StringFieldUpdateOperationsInput | string
    Senha?: StringFieldUpdateOperationsInput | string
    Avatar?: NullableStringFieldUpdateOperationsInput | string | null
    Despesas_recorrentes?: Despesas_recorrentesUncheckedUpdateManyWithoutUsu_riosNestedInput
  }

  export type UsersCreateWithoutDespesas_recorrentesInput = {
    Nome: string
    Email: string
    Senha: string
    Avatar?: string | null
    Despesas?: DespesasCreateNestedManyWithoutUsu_riosInput
  }

  export type UsersUncheckedCreateWithoutDespesas_recorrentesInput = {
    idUsu?: number
    Nome: string
    Email: string
    Senha: string
    Avatar?: string | null
    Despesas?: DespesasUncheckedCreateNestedManyWithoutUsu_riosInput
  }

  export type UsersCreateOrConnectWithoutDespesas_recorrentesInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutDespesas_recorrentesInput, UsersUncheckedCreateWithoutDespesas_recorrentesInput>
  }

  export type UsersUpsertWithoutDespesas_recorrentesInput = {
    update: XOR<UsersUpdateWithoutDespesas_recorrentesInput, UsersUncheckedUpdateWithoutDespesas_recorrentesInput>
    create: XOR<UsersCreateWithoutDespesas_recorrentesInput, UsersUncheckedCreateWithoutDespesas_recorrentesInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutDespesas_recorrentesInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutDespesas_recorrentesInput, UsersUncheckedUpdateWithoutDespesas_recorrentesInput>
  }

  export type UsersUpdateWithoutDespesas_recorrentesInput = {
    Nome?: StringFieldUpdateOperationsInput | string
    Email?: StringFieldUpdateOperationsInput | string
    Senha?: StringFieldUpdateOperationsInput | string
    Avatar?: NullableStringFieldUpdateOperationsInput | string | null
    Despesas?: DespesasUpdateManyWithoutUsu_riosNestedInput
  }

  export type UsersUncheckedUpdateWithoutDespesas_recorrentesInput = {
    idUsu?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Email?: StringFieldUpdateOperationsInput | string
    Senha?: StringFieldUpdateOperationsInput | string
    Avatar?: NullableStringFieldUpdateOperationsInput | string | null
    Despesas?: DespesasUncheckedUpdateManyWithoutUsu_riosNestedInput
  }

  export type DespesasCreateWithoutUsu_riosInput = {
    idDesp?: number
    Nome: string
    Valor_Total: number
    Forma_pagamento: string
    Data_pagamento: Date | string
    Numero_parcelas?: number | null
    Parcela_atual?: number | null
    Valor_parcelas?: number | null
  }

  export type DespesasUncheckedCreateWithoutUsu_riosInput = {
    idDesp?: number
    Nome: string
    Valor_Total: number
    Forma_pagamento: string
    Data_pagamento: Date | string
    Numero_parcelas?: number | null
    Parcela_atual?: number | null
    Valor_parcelas?: number | null
  }

  export type DespesasCreateOrConnectWithoutUsu_riosInput = {
    where: DespesasWhereUniqueInput
    create: XOR<DespesasCreateWithoutUsu_riosInput, DespesasUncheckedCreateWithoutUsu_riosInput>
  }

  export type DespesasCreateManyUsu_riosInputEnvelope = {
    data: DespesasCreateManyUsu_riosInput | DespesasCreateManyUsu_riosInput[]
    skipDuplicates?: boolean
  }

  export type Despesas_recorrentesCreateWithoutUsu_riosInput = {
    idDesp?: number
    Nome: string
    Valor: number
    Tipo_recorrencia: $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento: Date | string
  }

  export type Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput = {
    idDesp?: number
    Nome: string
    Valor: number
    Tipo_recorrencia: $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento: Date | string
  }

  export type Despesas_recorrentesCreateOrConnectWithoutUsu_riosInput = {
    where: Despesas_recorrentesWhereUniqueInput
    create: XOR<Despesas_recorrentesCreateWithoutUsu_riosInput, Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput>
  }

  export type Despesas_recorrentesCreateManyUsu_riosInputEnvelope = {
    data: Despesas_recorrentesCreateManyUsu_riosInput | Despesas_recorrentesCreateManyUsu_riosInput[]
    skipDuplicates?: boolean
  }

  export type DespesasUpsertWithWhereUniqueWithoutUsu_riosInput = {
    where: DespesasWhereUniqueInput
    update: XOR<DespesasUpdateWithoutUsu_riosInput, DespesasUncheckedUpdateWithoutUsu_riosInput>
    create: XOR<DespesasCreateWithoutUsu_riosInput, DespesasUncheckedCreateWithoutUsu_riosInput>
  }

  export type DespesasUpdateWithWhereUniqueWithoutUsu_riosInput = {
    where: DespesasWhereUniqueInput
    data: XOR<DespesasUpdateWithoutUsu_riosInput, DespesasUncheckedUpdateWithoutUsu_riosInput>
  }

  export type DespesasUpdateManyWithWhereWithoutUsu_riosInput = {
    where: DespesasScalarWhereInput
    data: XOR<DespesasUpdateManyMutationInput, DespesasUncheckedUpdateManyWithoutUsu_riosInput>
  }

  export type DespesasScalarWhereInput = {
    AND?: DespesasScalarWhereInput | DespesasScalarWhereInput[]
    OR?: DespesasScalarWhereInput[]
    NOT?: DespesasScalarWhereInput | DespesasScalarWhereInput[]
    idDesp?: IntFilter<"Despesas"> | number
    Nome?: StringFilter<"Despesas"> | string
    Valor_Total?: FloatFilter<"Despesas"> | number
    Forma_pagamento?: StringFilter<"Despesas"> | string
    Data_pagamento?: DateTimeFilter<"Despesas"> | Date | string
    Numero_parcelas?: IntNullableFilter<"Despesas"> | number | null
    Parcela_atual?: IntNullableFilter<"Despesas"> | number | null
    Valor_parcelas?: FloatNullableFilter<"Despesas"> | number | null
    Usu_rios_idUsu?: IntFilter<"Despesas"> | number
  }

  export type Despesas_recorrentesUpsertWithWhereUniqueWithoutUsu_riosInput = {
    where: Despesas_recorrentesWhereUniqueInput
    update: XOR<Despesas_recorrentesUpdateWithoutUsu_riosInput, Despesas_recorrentesUncheckedUpdateWithoutUsu_riosInput>
    create: XOR<Despesas_recorrentesCreateWithoutUsu_riosInput, Despesas_recorrentesUncheckedCreateWithoutUsu_riosInput>
  }

  export type Despesas_recorrentesUpdateWithWhereUniqueWithoutUsu_riosInput = {
    where: Despesas_recorrentesWhereUniqueInput
    data: XOR<Despesas_recorrentesUpdateWithoutUsu_riosInput, Despesas_recorrentesUncheckedUpdateWithoutUsu_riosInput>
  }

  export type Despesas_recorrentesUpdateManyWithWhereWithoutUsu_riosInput = {
    where: Despesas_recorrentesScalarWhereInput
    data: XOR<Despesas_recorrentesUpdateManyMutationInput, Despesas_recorrentesUncheckedUpdateManyWithoutUsu_riosInput>
  }

  export type Despesas_recorrentesScalarWhereInput = {
    AND?: Despesas_recorrentesScalarWhereInput | Despesas_recorrentesScalarWhereInput[]
    OR?: Despesas_recorrentesScalarWhereInput[]
    NOT?: Despesas_recorrentesScalarWhereInput | Despesas_recorrentesScalarWhereInput[]
    idDesp?: IntFilter<"Despesas_recorrentes"> | number
    Nome?: StringFilter<"Despesas_recorrentes"> | string
    Valor?: FloatFilter<"Despesas_recorrentes"> | number
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaFilter<"Despesas_recorrentes"> | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeFilter<"Despesas_recorrentes"> | Date | string
    Usu_rios_idUsu?: IntFilter<"Despesas_recorrentes"> | number
  }

  export type DespesasCreateManyUsu_riosInput = {
    idDesp?: number
    Nome: string
    Valor_Total: number
    Forma_pagamento: string
    Data_pagamento: Date | string
    Numero_parcelas?: number | null
    Parcela_atual?: number | null
    Valor_parcelas?: number | null
  }

  export type Despesas_recorrentesCreateManyUsu_riosInput = {
    idDesp?: number
    Nome: string
    Valor: number
    Tipo_recorrencia: $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento: Date | string
  }

  export type DespesasUpdateWithoutUsu_riosInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor_Total?: FloatFieldUpdateOperationsInput | number
    Forma_pagamento?: StringFieldUpdateOperationsInput | string
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
    Numero_parcelas?: NullableIntFieldUpdateOperationsInput | number | null
    Parcela_atual?: NullableIntFieldUpdateOperationsInput | number | null
    Valor_parcelas?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type DespesasUncheckedUpdateWithoutUsu_riosInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor_Total?: FloatFieldUpdateOperationsInput | number
    Forma_pagamento?: StringFieldUpdateOperationsInput | string
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
    Numero_parcelas?: NullableIntFieldUpdateOperationsInput | number | null
    Parcela_atual?: NullableIntFieldUpdateOperationsInput | number | null
    Valor_parcelas?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type DespesasUncheckedUpdateManyWithoutUsu_riosInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor_Total?: FloatFieldUpdateOperationsInput | number
    Forma_pagamento?: StringFieldUpdateOperationsInput | string
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
    Numero_parcelas?: NullableIntFieldUpdateOperationsInput | number | null
    Parcela_atual?: NullableIntFieldUpdateOperationsInput | number | null
    Valor_parcelas?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type Despesas_recorrentesUpdateWithoutUsu_riosInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor?: FloatFieldUpdateOperationsInput | number
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaFieldUpdateOperationsInput | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Despesas_recorrentesUncheckedUpdateWithoutUsu_riosInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor?: FloatFieldUpdateOperationsInput | number
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaFieldUpdateOperationsInput | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Despesas_recorrentesUncheckedUpdateManyWithoutUsu_riosInput = {
    idDesp?: IntFieldUpdateOperationsInput | number
    Nome?: StringFieldUpdateOperationsInput | string
    Valor?: FloatFieldUpdateOperationsInput | number
    Tipo_recorrencia?: EnumDespesas_recorrentes_Tipo_recorrenciaFieldUpdateOperationsInput | $Enums.Despesas_recorrentes_Tipo_recorrencia
    Data_pagamento?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}