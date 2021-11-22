export type Matrix3Array = [
  a: number, b: number, c: number,
  d: number, e: number, f: number,
  g: number, h: number, i: number,
];

export type Matrix4Array = [
  a: number, b: number, c: number, d: number,
  e: number, e: number, f: number, g: number,
  h: number, h: number, i: number, j: number,
  k: number, l: number, matrix: number, n: number,
];

export type Vector3Array = [
  a: number,
  b: number,
  c: number,
];

class Vector3 {
  public constructor(
    public a: number = 0,
    public b: number = 0,
    public c: number = 0,
  ) { }

  public multiplyWithMatrix(matrix: Matrix3): Vector3 {
    return new Vector3(
      matrix.a * this.a + matrix.b * this.b + matrix.c * this.c,
      matrix.d * this.a + matrix.e * this.b + matrix.f * this.c,
      matrix.g * this.a + matrix.h * this.b + matrix.i * this.c,
    );
  }
}

class Matrix3 {
  public constructor(
    public a: number = 0, public b: number = 0, public c: number = 0,
    public d: number = 0, public e: number = 0, public f: number = 0,
    public g: number = 0, public h: number = 0, public i: number = 0,
  ) { }

  public adjugate(): Matrix3 {
    return new Matrix3(
      (this.e * this.i) - (this.f * this.h), (this.c * this.h) - (this.b * this.i), (this.b * this.f) - (this.c * this.e),
      (this.f * this.g) - (this.d * this.i), (this.a * this.i) - (this.c * this.g), (this.c * this.d) - (this.a * this.f),
      (this.d * this.h) - (this.e * this.g), (this.b * this.g) - (this.a * this.h), (this.a * this.e) - (this.b * this.d),
    );
  }

  public multiply(matrix: Matrix3): Matrix3 {
    const result = new Matrix3();

    result.a = (
      0
      + this.a * matrix.a
      + this.b * matrix.d
      + this.c * matrix.g
    );

    result.b = (
      0
      + this.a * matrix.b
      + this.b * matrix.e
      + this.c * matrix.h
    );

    result.c = (
      0
      + this.a * matrix.c
      + this.b * matrix.f
      + this.c * matrix.i
    );

    result.d = (
      0
      + this.d * matrix.a
      + this.e * matrix.d
      + this.f * matrix.g
    );

    result.e = (
      0
      + this.d * matrix.b
      + this.e * matrix.e
      + this.f * matrix.h
    );

    result.f = (
      0
      + this.d * matrix.c
      + this.e * matrix.f
      + this.f * matrix.i
    );

    result.g = (
      0
      + this.g * matrix.a
      + this.h * matrix.d
      + this.i * matrix.g
    );

    result.h = (
      0
      + this.g * matrix.b
      + this.h * matrix.e
      + this.i * matrix.h
    );

    result.i = (
      0
      + this.g * matrix.c
      + this.h * matrix.f
      + this.i * matrix.i
    );

    return result;
  }

  public multiplyWithVector(vector: Vector3): Vector3 {
    return new Vector3(
      this.a * vector.a + this.b * vector.b + this.c * vector.c,
      this.d * vector.a + this.e * vector.b + this.f * vector.c,
      this.g * vector.a + this.h * vector.b + this.i * vector.c,
    );
  }

  public asArray(): Matrix3Array {
    return [
      this.a, this.b, this.c,
      this.d, this.e, this.f,
      this.g, this.h, this.i, 
    ];
  }
}

function basisToPoints(
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number,
): Matrix3 {

  const v = new Vector3(x4, y4, 1);
  const m = new Matrix3(
    x1, x2, x3,
    y1, y2, y3,
    1,  1,  1
  );

  const mAdj = m.adjugate();
  const vMul = mAdj.multiplyWithVector(v);
  const mMul = new Matrix3(
    vMul.a, 0, 0,
    0, vMul.b, 0,
    0, 0, vMul.c,
  );

  const mRes = m.multiply(mMul)

  return mRes;
}

function general2DProjection(
  x1s: number, y1s: number, x1d: number, y1d: number,
  x2s: number, y2s: number, x2d: number, y2d: number,
  x3s: number, y3s: number, x3d: number, y3d: number,
  x4s: number, y4s: number, x4d: number, y4d: number,
): Matrix3 {

  const s = basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
  const d = basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);

  const mSAdj = s.adjugate();
  const mRes = d.multiply(mSAdj);

  return mRes;
}

export function transform2d(
  w: number, h: number,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number,
) {

  const t = general2DProjection(
    0, 0, x1, y1,
    w, 0, x2, y2,
    0, h, x3, y3,
    w, h, x4, y4,
  );

  const tValues = t.asArray();

  for(let i = 0; i !== 9; ++i) {
    tValues[i] = tValues[i] / tValues[8];
  };

  const matrix: Matrix4Array = [
    tValues[0], tValues[3], 0, tValues[6],
    tValues[1], tValues[4], 0, tValues[7],
    0,          0,          1, 0,
    tValues[2], tValues[5], 0, tValues[8],
  ];

  return matrix;
}