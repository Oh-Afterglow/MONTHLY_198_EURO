# xxx

- /project/compose GET

```ts
type request = { projectName: string };

type response = { name: string; value: string }[];
```

- /project/number GET

```ts
type request = { projectName: string };

type response = { commit: number; issue: number; pullRequest: number };
```
