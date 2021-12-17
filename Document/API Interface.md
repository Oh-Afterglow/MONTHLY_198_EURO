# xxx

- /project/compose GET

```ts
type request = { projectName: string };

type response = { name: string; value: string }[];
```

- /project/numbers GET

```ts
type request = { projectName: string };

type response = { commit: number; issue: number; pullRequest: number };
```

- /project/commit /project/issue /project/pr GET

```ts
type request = { projectName: string };

type response = [
  {
    name: '0';
    value: [
      {
        name: string;
        value: number[]; // length=7
      }
    ];
  },
  {
    name: '1';
    value: {
      name: string;
      value: number[]; // length=4
    }[]; // length=7
  },
  {
    name: '2';
    value: {
      name: string;
      value: number[]; // length=6
    }[]; // length=4
  }
];
```
