# Cutshort assignment

## Todo, Posts Social media

### Components

- Todos
- Posts
- Comments

🚀 Node - `18.14.0`

### Features

- Add Todo
- Modify Todo Text / Mark as Completed / Incomplete
- Add Post
- Comment on Post
- Query Posts / Comments
- Role based access feature (admins vs user)

## APIs

### TODO

```sh
/todo?userId=''&limit=''&page=''
method: GET
query: userId*(required), limit, page
description: Queries all todos
```

```sh
/newTodo
method: POST
body: {text: '', userId: ''}
description: adds a new todo
```

```sh
/updateTodoText
method: PATCH
body: {text: '', todoId: ''}
description: Update todo text
```

```sh
/updateTodoStatus
method: PATCH
body: {text: '', completed: true}
description: Update todo status
```

### POST

```sh
/post?userId=''&limit=''&page=''
method: GET
query: userId*(required), limit, page
description: Queries all posts
```

```sh
/newPost
method: POST
body: {text: '', userId: ''}
description: adds a new post
```

### COMMENT

```sh
/comment?userId=''&limit=''&page=''
method: GET
query: userId*(required), limit, page
description: Queries all comments
```

```sh
/newComment
method: POST
body: {text: '', userId: '', postId: ''}
description: adds a new comment to a post
```
