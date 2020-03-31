# Quarkus snippets for VS Code

This extension for Visual Studio Code adds snippets for Quarkus.

## Usage

Type part of a snippet, press `enter`, and the snippet unfolds.

Alternatively, press `Ctrl`+`Space` (Windows, Linux) or `Cmd`+`Space` (OSX) to activate snippets from within the editor.

### Commands

* `Quarkus: Check for update`
  Read your `pom.xml` file and compare your *Quarkus* version with the latest release.

* `Quarkus: Add devcontainer configuration`
  Configure the workspace to run in `devcontainer` mode.
  This command require the [Remote Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

### JAVA snippets

| snippet | Purpose |
| ------- | ------- |
| q-resource | Create new Quarkus REST resource class |
| q-panache-entity | Create a Panache entity |
| q-path | Create new path entrypoint |

### YAML snippets

| snippet | Purpose |
| ------- | ------- |
| postgresql-service | Create new [PostgreSQL](https://hub.docker.com/_/postgres) service for docker-compose |
| mysql-service | Create a [MySQL](https://hub.docker.com/_/mysql)/[MariaDB](https://hub.docker.com/_/mariadb) service for docker-compose |
| keycloak-service | Create a [keycloak](https://hub.docker.com/r/jboss/keycloak) service for docker-compose |
| jaeger-service | Create a [Jaeger](https://www.jaegertracing.io/) service for docker-compose |

## Requirements

* [Language Support for Java(TM) by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.java)

## License

Apache Licence 2.0. See [LICENSE](/LICENSE) file.
