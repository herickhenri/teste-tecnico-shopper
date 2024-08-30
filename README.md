
<div align="center">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTevuK6TdTHsn-BiH-SH3l7DBL42A5nX7oVWw&s"/>
</div>

# Teste Técnico Shopper

O teste tem como objetivo avaliar minhas skills como programador back-end. A aplicação consiste em um serviço que gerencia a leitura individualizada de consumo de água e gás. Para facilitar o acesso a informação o serviço utilizará IA para obter a medição através da foto de um medidor.

## Funcionalidades

- Realiza uma nova medição
- Valida a medição realizada pelo LLM
- Busca toda as medições de um cliente específico
- Aplicação completamente dockerlizada
- Testes unitários
- Validação dos dados enviados

## Pre-requisitos

Para usar a aplicação, é necessário possuir o docker. Baixe ele pelo site oficial do docker.

- [Tutorial instalação windows](https://docs.docker.com/desktop/install/windows-install/)
- [Tutorial instalação mac](https://docs.docker.com/desktop/install/mac-install/)
- [Tutorial instalação linux](https://docs.docker.com/desktop/install/linux-install/)

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`GEMINI_API_KEY` (Chave de acesso para o gemini. [Crie sua chave aqui](https://aistudio.google.com/app/apikey?hl=pt-br))

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/herickhenri/teste-tecnico-shopper.git
```

crie o container docker

```bash
  docker compose up
```

O servidor será hospedado em http://localhost:3333

## Documentação da API

#### Cria uma nova medição

```
  POST /upload
```

| Parâmetro   | Tipo       | Descrição      |
| :---------- | :--------- | :------------- |
| `image`     | `base64` | **Obrigatório**. Foto do medidor |
| `customer_code`|`string`| **Obrigatório**. Código do cliente |
| `measure_datetime`|`Date`| **Obrigatório**. Data da medição |
| `measure_type`|`"WATER" ou "GAS"`| **Obrigatório**. Tipo da medição |

#### Confirma o valor da medição

```
  PATCH /confirm
```

| Parâmetro   | Tipo       | Descrição      |
| :---------- | :--------- | :------------- |
| `measure_uuid`|`string`| **Obrigatório**. Id da medição |
| `confirmed_value`|`integer`| **Obrigatório**. Valor de confirmação |

#### Retorna as medições de um cliente específico

```
  GET /${customer_code}/list?type=WATER
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `customer_code` | `string` | **Obrigatório**. Id do customer   |
|`type`|`"WATER" ou "GAS"`|**Opcional**. Filtra os measures      |

## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test
```

