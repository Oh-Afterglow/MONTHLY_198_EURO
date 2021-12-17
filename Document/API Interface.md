# xxx

- /project/compose GET
- 获取项目的构成

```ts
type request = { projectName: string };

type response = { name: string; value: string }[];
// 返回结构: 一个数组, 每一项包含了 { name: 成分名, value: 数量(绝对数量即可,饼图会自己计算比例) }
const sample: response = [
  { name: 'C', value: '100' },
  { name: 'Java', value: '300' },
];
```

- /project/numbers GET
- 获取 commit, issue, pr 的数量

```ts
type request = { projectName: string };

type response = { commit: number; issue: number; pullRequest: number };

const sample: response = { commit: 100, issue: 200, pullRequest: 300 };
```

- /project/commit /project/issue /project/pr GET
- 按照指定结构返回 commit, issue, pr 的数量(结构在下面详细描述)

```ts
type request = { projectName: string };

type response = [
  {
    name: '0';
    value: [
      {
        name: string; // 随便填
        value: number[]; // length=7, 表示周一~周日每一天的数量
      }
    ]; // 一个只有一个元素的数组
  }, // 这一项是每一周的数量(按天)
  {
    name: '1';
    value: {
      name: string;
      value: number[]; // length=4 表示第几周里这一天的数量
    }[]; // length=7 表示这一周周几的数量
  }, // 这一项是每个月的数量(按天)
  {
    name: '2';
    value: {
      name: string;
      value: number[]; // length=6 表示第几个月里这一周的数量
    }[]; // length=4 表示一个月里第几周的数量
  } // 这一项是半年的数量(按周)
];

const sample: response = [
  {
    name: '0',
    value: [
      {
        name: 'qwq',
        value: [1, 2, 3, 4, 5, 6, 7],
      },
    ],
  },
  {
    name: '1',
    value: [
      { name: 'Monday', value: [1, 2, 3, 4] },
      { name: 'Tuesday', value: [5, 6, 7, 8] },
      { name: 'Wednesday', value: [9, 10, 11, 12] },
      { name: 'Thursday', value: [13, 14, 15, 16] },
      { name: 'Friday', value: [17, 18, 19, 20] },
      { name: 'Saturday', value: [21, 22, 23, 24] },
      { name: 'Sunday', value: [25, 26, 27, 28] },
    ],
  },
  {
    name: '2',
    value: [
      { name: 'week1', value: [10, 20, 30, 40, 50, 60] },
      { name: 'week2', value: [70, 80, 90, 100, 110, 120] },
      { name: 'week3', value: [130, 140, 150, 160, 170, 180] },
      { name: 'week4', value: [190, 200, 210, 220, 230, 240] },
    ],
  },
];
```
