# xxx

- /signup POST
- 注册

```ts
type request = {
  username: string;
  email: string;
  githubName: string;
  password: string;
};
// status code: 200 OK / 400 Bad Request
```

- /login POST
- 登录

```ts
type request = {
  email: string;
  password: string;
};
// status code: 200 OK / 400 Bad Request
```

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

- /project/commit /project/issue /project/pr /project/issuewait/project/prwait  GET
- 按照指定结构返回 commit, issue, pr 的数量，对于issue与pr，/issue返回的是已解决的数量，/issuewait返回的是未解决的数量，pr同理(结构在下面详细描述)

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

- /project/issue/tag GET
- 获取 commit 相关的 tag 的数量列表

```ts
type request = { projectName: string };

type response = { name: string; value: number }[];
// 返回结构：一个数组, 每一项包含了 { name: tag名, value: 数量 }
```

- /member/compose GET
- 获取社区的人员构成

```ts
type request = { projectName: string };

type response = { name: string; value: string }[];
// 返回结构: 一个数组, 每一项包含了 { name: 来源名, value: 数量(绝对数量) }
const sample: response = [
  { name: 'Google', value: '100' },
  { name: 'Facebook', value: '300' },
];
```

- /member/events GET
- 获取社区的人员变动事件

```ts
type request = { projectName: string };
type response = { time: string; event: string }[];
// 返回结构: 一个数组, 每一项包含了 { time: 时间, event: 事件描述 }
const sample: response = [
  { time: '2020-01-01', event: 'Linus Torvalds join the organization' },
  { time: '2020-01-02', event: 'Linus Torvalds leave the organization' },
];
```

- /member/members GET
- 获取社区的所有成员

```ts
type request = { projectName: string };
type response = { name: string; avatar: string; description: string }[];
// 返回结构: 一个数组, 每一项包含了 { name: 成员名, avatar: 头像(一个url,没有的话可以返回名字字符串,MUI会取第一个字符渲染), description: 描述 }
const sample: response = [
  {
    name: 'Linus Torvalds',
    avatar: 'https://avatars0.githubusercontent.com/u/1?s=460&v=4',
    description: 'Linus Torvalds is a Linux kernel developer',
  },
  {
    name: 'Mark Zuckerberg',
    avatar: 'https://avatars0.githubusercontent.com/u/2?s=460&v=4',
    description: 'Mark Zuckerberg is a Facebook developer',
  },
];
```

- /member/projects GET
- 获取一个成员的所有项目

```ts
type request = { memberName: string };
type response = {
  name: string;
  description: string;
  major: string;
  stars: number;
  lastUpdate: string;
}[];
// 返回结构: 一个数组, 每一项包含了 { name: 项目名, description: 描述, major: 最主要的语言, stars: 赞数, lastUpdate: 最后更新时间 }
const sample: response = [
  {
    name: 'Linux Kernel',
    description: 'Linux Kernel is a Linux kernel development',
    major: 'C',
    stars: 100,
    lastUpdate: '2020-01-01',
  },
  {
    name: 'Facebook',
    description: 'Facebook is a Facebook development',
    major: 'Java',
    stars: 300,
    lastUpdate: '2020-01-02',
  },
];
```

- /project/issuesolve /project/prsolve  GET
- 获取Pr与issue解决情况

```ts
type request = { projectName: string };
type response = [];
// 返回结构: 一个数组, 每一项代表在该段时间内解决的数量，目前设计为：周，月，半年，年，未解决
const sample: response = [
  10,20,30,40,20
];
```

- /admin/alluser  GET
- 获取所有本项目用户信息

```ts
type request = {  };
type response = {
    name: string
    avatar: string 
    description: string         //为了复用组件，这里是email，但用的description标签
}[];
// 返回结构: 一个数组, 每一项包含了 { name: 用户名, avatar:用户头像url,  description: 用户的email地址  }
const sample: response = [
    {
        name: '张三',
        avatar: 'https://avatars0.githubusercontent.com/u/8186664?s=460&v=4',
        description: '12333@qq.com',
    },
    {
        name: '李四',
        avatar: 'https://avatars0.githubusercontent.com/u/8186664?s=460&v=4',
        description: '234@qq.com',
    },
];
```

- /admin/allproject GET
- 获取所有可管理的项目信息

```ts
type request = {  };
type response = {
  name: string;
  description: string;
  major: string;
  stars: number;
  lastUpdate: string;
}[];
// 返回结构: 一个数组, 每一项包含了 { name: 项目名, description: 描述, major: 最主要的语言, stars: 赞数, lastUpdate: 最后更新时间 }
const sample: response = [
  {
    name: 'Linux Kernel',
    description: 'Linux Kernel is a Linux kernel development',
    major: 'C',
    stars: 100,
    lastUpdate: '2020-01-01',
  },
  {
    name: 'Facebook',
    description: 'Facebook is a Facebook development',
    major: 'Java',
    stars: 300,
    lastUpdate: '2020-01-02',
  },
]
```

- /admin/getuserpro  GET
- 获取一个user的可以管理的列表信息

```ts
type request = { userid: string };      //按照要求这里传回的是email
type response = {
  name: string;
  description: string;
  major: string;
  stars: number;
  lastUpdate: string;
}[];
// 返回结构: 一个数组, 每一项包含了 { name: 项目名, description: 描述, major: 最主要的语言, stars: 赞数, lastUpdate: 最后更新时间 }
const sample: response = [
  {
    name: 'Linux Kernel',
    description: 'Linux Kernel is a Linux kernel development',
    major: 'C',
    stars: 100,
    lastUpdate: '2020-01-01',
  },
  {
    name: 'Facebook',
    description: 'Facebook is a Facebook development',
    major: 'Java',
    stars: 300,
    lastUpdate: '2020-01-02',
  },
];
```

- admin/add GET
- 增加一个项目至用户的权限中

```ts
type request = { projectname: string };      
type response = {
  name: string;
  description: string;
  major: string;
  stars: number;
  lastUpdate: string;
}[];
// 返回结构: 一个数组, 为了方便前端渲染，这里传回用户的所有可管理组件，每一项包含了 { name: 项目名, description: 描述, major: 最主要的语言, stars: 赞数, lastUpdate: 最后更新时间 } 
const sample: response = [
  {
    name: 'Linux Kernel',
    description: 'Linux Kernel is a Linux kernel development',
    major: 'C',
    stars: 100,
    lastUpdate: '2020-01-01',
  },
  {
    name: 'Facebook',
    description: 'Facebook is a Facebook development',
    major: 'Java',
    stars: 300,
    lastUpdate: '2020-01-02',
  },
];
```

- admin/remove GET
- 从用户权限中移除一个项目

```ts
type request = { projectname: string };      
type response = {
  name: string;
  description: string;
  major: string;
  stars: number;
  lastUpdate: string;
}[];
// 返回结构: 一个数组, 为了方便前端渲染，这里传回用户的所有可管理组件，每一项包含了 { name: 项目名, description: 描述, major: 最主要的语言, stars: 赞数, lastUpdate: 最后更新时间 } 
const sample: response = [
  {
    name: 'Linux Kernel',
    description: 'Linux Kernel is a Linux kernel development',
    major: 'C',
    stars: 100,
    lastUpdate: '2020-01-01',
  },
  {
    name: 'Facebook',
    description: 'Facebook is a Facebook development',
    major: 'Java',
    stars: 300,
    lastUpdate: '2020-01-02',
  },
];
```


- custom/customize POST
- 用户自定义文档

```ts
type request = { chartType: string , paramValue: string, project:string}; 
// chartType: 用户自定义情况的二十余种表格名;paramValue: 后四种表格所带查询需要的tag/用户名(除了后四项外没此项); project：项目名
['Commit_number_by_organization',
'Commit_number_by_week',
'Commit_number_by_year',
'Issue_number_by_organization',
'Issue_number_by_week',
'Issue_number_by_year',
'Pull_request_number_by_organization',
'Pull_request_number_by_week',
'Pull_request_number_by_year',
'Open_issue_number_by_week',
'Open_issue_number_by_year',
'Closed_issue_number_by_week',
'Closed_issue_number_by_year',
'Open_pull_request_number_by_week',
'Open_pull_request_number_by_year',
'Closed_pull_request_number_by_week',
'Closed_pull_request_number_by_year',
'Tagged_issue_number_by_week',
'Tagged_issue_number_by_year',
'Personal_contribution_number_by_week',
'Personal_contribution_number_by_year',]

type response = {
  name: string;
  value: value;
}[];
// 返回结构: 一个数组, 为了方便前端渲染，这里传回用户的所有可管理组件，每一项包含了 { name: 横坐标名,value:纵坐标值 } 
const sample: response = [
  {
      "name": "Mon",
      "value": 4000,
    },
    {
      "name": "Tue",
      "value": 7000,
    },
    {
      "name": "Wed",
      "value": 4000,
    },
    {
      "name": "Thur",
      "value": 2000,
    },
    {
      "name": "Fri",
      "value": 4000,
    },
    {
      "name": "Sat",
      "value": 3000,
    },
    {
      "name": "Sun",
      "value": 4000,
    }
];
```

- user/allproject GET
- 获取用户所有项目

```ts
type request = { };      
type response = {
  name: string;
  description: string;
  major: string;
  stars: number;
  lastUpdate: string;
}[];
// 返回结构: 一个数组, 为了方便前端渲染，这里传回用户的所有可管理组件，每一项包含了 { name: 项目名, description: 描述, major: 最主要的语言, stars: 赞数, lastUpdate: 最后更新时间 } 
const sample: response = [
  {
    name: 'Linux Kernel',
    description: 'Linux Kernel is a Linux kernel development',
    major: 'C',
    stars: 100,
    lastUpdate: '2020-01-01',
  },
  {
    name: 'Facebook',
    description: 'Facebook is a Facebook development',
    major: 'Java',
    stars: 300,
    lastUpdate: '2020-01-02',
  },
];
```
