# 🎬 Teste Técnico: Leitura da Lista de Indicados e Vencedores da Categoria "Pior Filme" do Golden Raspberry Awards 🍿

Este projeto tem como objetivo realizar a leitura da lista de indicados e vencedores da categoria "Pior Filme" do **Golden Raspberry Awards**

**Requisitos para executar o projeto:**

- **Node v16.17.0**
- **IDE de sua preferência (recomendado: Visual Studio)

# Requisitos não funcionais do sistema:

1. O web service RESTful deve ser implementado com base no nível 2 de maturidade de Richardson;

2. Devem ser implementados somente testes de integração. Eles devem garantir que os dados obtidos estão de acordo com os dados fornecidos na proposta;

3. O banco de dados deve estar em memória utilizando um SGBD embarcado (por
exemplo, H2). Nenhuma instalação externa deve ser necessária;

4. A aplicação deve conter um readme com instruções para rodar o projeto e os testes de integração.


# Executando o Projeto

Para executar o projeto, siga o passo a passo abaixo:

1. Abra o terminal e utilize o seguinte comando para instalar todas as dependencias do projeto:

```shell
npm install
```
Logo apos, execute o seguinte comando para inciar a aplicação 

```shell
npm start
```
Aguarde alguns segundos e o sistema iniciará automaticamente. 

2. Após o sistema estar em execução, você pode acessar a rota especificada utilizando o `curl`:

```shell
curl --location 'http://localhost:8090/movie/search/winners/interval'
```

o resultado será algo como:

```json
{
	"min": [
		{
			"producer": "joel silver",
			"interval": 1,
			"previousWin": 1990,
			"followingWin": 1991
		}
	],
	"max": [
		{
			"producer": "matthew vaughn",
			"interval": 13,
			"previousWin": 2002,
			"followingWin": 2015
		}
	]
}
```


# Executando os testes

para executar os testes, o passo abaixo:

1. Abra o terminal e utilize o seguinte comando:

```shell
npm test
```


Além dos logs de execução, podemos verificar os testes executados com sucesso analisando as últimas linhas:
```
 PASS  test/integration/movieIntegration.test.js
  GET /
    √ responds with JSON containing a message indicating the server is running (148 ms)
  GET /movie/search/winners/interval
    √ responds with an error message when the route does not exist (9 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.42 s, estimated 3 s
```