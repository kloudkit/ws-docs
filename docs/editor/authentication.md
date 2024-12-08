# Authentication

The animation below displays how to login to the *workspace*:

![authentication-login](/editor/authentication-login.gif)

Given that the majority of users will integrate the *workspace* with an external
authentication provider *(or deploy on a local machine)*, the default deployment is
configured to not require authentication.

The following sections will help you setup our *opt-in* authentication mechanism.

::: warning
Remember to click `Sign out` at the bottom of the `File` menu when you are done working,
as your login session won't expire automatically.
:::

![authentication-logout](/editor/authentication-logout.gif)

## Password Authentication

Passed authentication can be easily configured by setting an environment variable when
deploying the *workspace*.
Setting your password is as simple as defining an `env` variable:

- **`WS_PASSWORD:`** plaintext password.
- **`WS_PASSWORD_HASHED:`** hashed passwords *(will take precedence over plaintext)*.

::: info NOTE
All sensitive `env` variables are purged prior to deploying the workspace, ensuring that
your password is absent from future shell sessions.
:::

```sh{2}
docker run \
  -e WS_PASSWORD=super_duper_secret \
  ghcr.io/kloudkit/workspace:latest
```

### Creating a Hashed Password

To generate a hashed password, execute the following
*(replacing `"super_duper_secret"` with your desired password)*:

```sh
$ echo -n super_duper_secret | npx -s argon2-cli -e
$argon2i$v=19$m=4096,t=3,p=1$z4DjJlJgI6S7fAdQC35ZQw$Rpu8CLMWedxJaH0eiFCetyoRbg+S8ow/RRyVCZzM6QE
```

Then deploy the workspace:

```sh{2}
docker run \
  -e WS_PASSWORD_HASHED="$argon2i$v=19$m=4096,t=3,p=1$z4DjJlJgI6S7fAdQC35ZQw$Rpu8CLMWedxJaH0eiFCetyoRbg+S8ow/RRyVCZzM6QE" \
  ghcr.io/kloudkit/workspace:latest
```

### Rate Limiting

The workspace has a built-in throttling mechanism to rate limit password authentication
attempts to two per minute and an additional twelve per hour.
