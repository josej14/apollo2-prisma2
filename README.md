# My project

## Basic commands
- Install dependencies using `yarn` or `npm i`
- Launch the backend with `yarn dev`
- If you change any model, run the migrations with `yarn migrate:save` and `yarn migrate:up`
- Apply the new migrations to the prisma client with `yarn generate`
- Prisma has an IDE for the database. Launch it with `yarn studio`


## Authorization
All the resources (except _register_ and _login_) have authorization protection. You have to send the JWT token in the headers.

## Queries

- **currentUser**: Returns user info if it is authenticated

```
{
  currentUser {
    id
    username
  }
}
```



- **alumns(take:Int, skip:Int)**: Returns all the alumns in the DB. Implements pagination using _take_ and _skip_ (optional arguments)

```
{
  alumns {
    id
    name
    surname
    email
    seminar {
      id
      title
      description
    }
  }
}
```

- **alumnById(id: Int!)**: Returns alumn resource by its ID

```
{
  alumnById (id: 1){
    id
    name
    surname
    email
    seminar{
      id
      title
      description
    }
  }
}
```

- **alumnByEmail(email: String!)**: Returns alumn resource by its email

```
{
  alumnById (email: "test@mail.com"){
    id
    name
    surname
    email
    seminar{
      id
      title
      description
    }
  }
}
```

- **votes(take, skip)**: Returns all the votes in the DB. Implements pagination using _take_ and _skip_ (optional arguments)

```
{
  votes{
    id
    quality
    utility
    seminar {
      title
    }
    user {
      username
    }
  }
}
```

- **votesByUserId(id)**

```
{
  votesByUserId(id: 1){
    id
    quality
    utility
    seminar {
      title
    }
    user {
      username
    }
  }
}
```


- **votesBySeminarId(id)**

```
{
  votesBySeminarId(id: 1){
    id
    quality
    utility
    seminar {
      title
    }
    user {
      username
    }
  }
}
```

## Mutations
- **register(username, password)**

```
mutation {
  register(username:"test", password:"test") {
    id
    username
  }
}
```

- **login(username, password)**

```
mutation {
  login(username:"test", password: "test"){
    token
  }
}
```

- **voteFor(seminar (int), quality, utility)**: vote a seminar. It uses your token for get your user.

```
mutation {
  voteFor(seminar: 1,quality: 6, utility:10){
    id
    quality
    utility
    seminar {
      title
    }
    user {
      username
    }
  }
}
```

## Suscriptions

- **userRegistered**: Returns a user when it is registered

```
subscription {
	userRegistered {
    username
  }
}
```
  
- **userLogin**: Returns a user when it logins

```
subscription {
	userLogin {
    username
  }
}
```

- **voteAdded**: Returns a vote when it is added

```
subscription {
  voteAdded {
    user {
      username
    }
    seminar {
      title
    }
    quality
    utility
  }
}
```

- **seminarStats**: Returns seminar stats after a vote is added

```
subscription {
  seminarStats {
    quality
    utility
		seminar {
      title
    }
    total
  }
}
```
